"""Adds the Java library's javadoc to index.d.ts and orders members as the Java source does.

index.d.ts only declares signatures. For each class and member it declares, this finds the Java
declaration with the same JavaScript name and copies its javadoc over, converted to TSDoc, so that
the docs follow upstream whenever the library is updated. A comment already in index.d.ts is kept
after the javadoc, as a note on how the JavaScript API differs.

Usage: dts_javadoc.py <index.d.ts> <output> <java source>...
"""

import html
import os
import re
import sys

# The Java type behind each TypeScript declaration, as a file and a path of nested classes. Types
# not listed here, like Long, have no Java source.
JAVA_TYPES = {
    "Bytes": ("PrimitiveArrays", ["PrimitiveArrays", "Bytes"]),
    "Cursor": ("PrimitiveArrays", ["PrimitiveArrays", "Cursor"]),
    "S2RegionCovererBuilder": ("S2RegionCoverer", ["S2RegionCoverer", "Builder"]),
}
for name in [
    "R1Interval", "S1Angle", "S1ChordAngle", "S1Interval", "S2Cap", "S2Cell", "S2CellId",
    "S2CellUnion", "S2Coder", "S2Earth", "S2LatLng", "S2LatLngRect", "S2Loop", "S2Point",
    "S2Polygon", "S2Polyline", "S2Region", "S2RegionCoverer",
]:
    JAVA_TYPES[name] = (name, [name])

# Where to look for a member's javadoc when the class itself declares it without one, as with an
# override of an S2Region method.
SUPERTYPES = {
    "S2LatLngRect": ["S2LatLngRectBase"],
}
REGION_TYPES = ["S2Cap", "S2Cell", "S2CellUnion", "S2LatLngRect", "S2Loop", "S2Point", "S2Polygon",
                "S2Polyline"]


class JavaMember:
  def __init__(self, name, js_name, is_static, is_constructor, is_ignored, params, javadoc, line):
    self.name = name
    self.js_name = js_name
    self.is_static = is_static
    self.is_constructor = is_constructor
    # Hidden from JavaScript, but a factory in exports.js may stand in for it
    self.is_ignored = is_ignored
    self.params = params
    self.javadoc = javadoc
    self.line = line


class JavaType:
  def __init__(self, javadoc, members):
    self.javadoc = javadoc
    self.members = members


def strip_code(text):
  """Blanks out comments and literals, keeping offsets, so braces can be matched."""
  out = []
  i = 0
  while i < len(text):
    if text.startswith("//", i):
      end = text.find("\n", i)
      end = len(text) if end < 0 else end
    elif text.startswith("/*", i):
      end = text.index("*/", i) + 2
    elif text[i] in "\"'":
      end = i + 1
      while text[end] != text[i]:
        end += 2 if text[end] == "\\" else 1
      end += 1
    else:
      out.append(text[i])
      i += 1
      continue
    out.append(re.sub(r"[^\n]", " ", text[i:end]))
    i = end
  return "".join(out)


def find_type(text, stripped, path, start=0, end=None):
  """Returns the javadoc and body span of the nested type `path` within text[start:end]."""
  end = len(text) if end is None else end
  pattern = re.compile(r"\b(?:class|interface|enum)\s+%s\b" % re.escape(path[0]))
  match = pattern.search(stripped, start, end)
  if not match:
    raise ValueError("Unable to find %s" % path[0])
  open_brace = stripped.index("{", match.end())
  depth = 0
  for i in range(open_brace, end):
    if stripped[i] == "{":
      depth += 1
    elif stripped[i] == "}":
      depth -= 1
      if depth == 0:
        close_brace = i
        break
  if len(path) > 1:
    return find_type(text, stripped, path[1:], open_brace + 1, close_brace)
  line_start = text.rfind("\n", 0, match.start()) + 1
  return preceding_javadoc(text, line_start), open_brace + 1, close_brace


def preceding_javadoc(text, pos):
  """Returns the javadoc ending just before pos, skipping annotations, or None."""
  before = text[:pos].rstrip()
  while True:
    # Skip annotation lines, such as @JsType or @Override
    last_line_start = before.rfind("\n") + 1
    if before[last_line_start:].lstrip().startswith("@"):
      before = before[:last_line_start].rstrip()
    else:
      break
  if not before.endswith("*/"):
    return None
  start = before.rfind("/**")
  if start < 0 or "*/" in before[start:-2]:
    return None
  return before[start:]


def parse_members(text, stripped, type_name, body_start, body_end):
  """Finds the members declared directly in a type body, skipping nested types."""
  members = []
  depth = 0
  parens = 0
  i = body_start
  statement_start = body_start
  while i < body_end:
    c = stripped[i]
    if c == "(":
      parens += 1
    elif c == ")":
      parens -= 1
    elif parens:
      pass
    elif c == "{" or c == ";":
      if depth == 0:
        declaration = stripped[statement_start:i]
        member = parse_declaration(text, type_name, statement_start, declaration)
        if member:
          members.append(member)
      if c == "{":
        depth += 1
      elif depth == 0:
        statement_start = i + 1
    elif c == "}":
      depth -= 1
      if depth == 0:
        statement_start = i + 1
    elif c == "=" and depth == 0 and stripped[i + 1] != "=" and stripped[i - 1] not in "!<>=":
      # A field initializer, which can contain braces of its own, like an anonymous class
      declaration = stripped[statement_start:i]
      member = parse_declaration(text, type_name, statement_start, declaration)
      if member:
        members.append(member)
      semicolon = i
      nested = 0
      while stripped[semicolon] != ";" or nested:
        if stripped[semicolon] in "({[":
          nested += 1
        elif stripped[semicolon] in ")}]":
          nested -= 1
        semicolon += 1
      i = semicolon
      statement_start = i + 1
    i += 1
  return members


def parse_declaration(text, type_name, start, declaration):
  # Annotations stay with the declaration, the javadoc is before them
  source = text[start:start + len(declaration)]
  body = re.sub(r"@\w+(\s*\([^)]*\))?", "", declaration).strip()
  if not body or re.match(r"(static\s*)?$", body):
    return None
  if re.search(r"\b(class|interface|enum|record)\b", body.split("(")[0]):
    return None
  annotations = re.findall(r"@(\w+)(?:\s*\(([^)]*)\))?", source)
  names = dict(annotations)
  is_static = bool(re.search(r"\bstatic\b", body.split("(")[0]))
  if "(" in body:
    head = body[:body.index("(")].split()
    if not head:
      return None
    name = head[-1]
    params = body[body.index("(") + 1:body.rindex(")")]
    is_constructor = name == type_name
  else:
    name = body.split()[-1]
    params = None
    is_constructor = False
  js_name = name
  for key in ("JsMethod", "JsProperty"):
    if key in names:
      renamed = re.search(r'name\s*=\s*"(\w+)"', names[key])
      if renamed:
        js_name = renamed.group(1)
  offset = len(declaration) - len(declaration.lstrip())
  javadoc = preceding_javadoc(text, start + offset)
  return JavaMember(
      name,
      js_name,
      is_static,
      is_constructor,
      "JsIgnore" in names,
      params,
      javadoc,
      text.count("\n", 0, start))


def load_types(sources):
  files = {}
  for path in sources:
    name = os.path.splitext(os.path.basename(path))[0]
    # The J2CL platform shims have no documentation worth taking
    if "super-j2cl" in path:
      continue
    files[name] = path

  types = {}

  def load(file_name, path):
    key = ".".join(path)
    if key not in types:
      with open(files[file_name]) as f:
        text = f.read()
      stripped = strip_code(text)
      javadoc, start, end = find_type(text, stripped, path)
      types[key] = JavaType(javadoc, parse_members(text, stripped, path[-1], start, end))
    return types[key]

  resolved = {}
  for ts_name, (file_name, path) in JAVA_TYPES.items():
    chain = [load(file_name, path)]
    for supertype in SUPERTYPES.get(ts_name, []):
      chain.append(load(supertype, [supertype]))
    if ts_name in REGION_TYPES:
      chain.append(load("S2Region", ["S2Region"]))
    resolved[ts_name] = chain
  return resolved


def find_member(chain, js_name, is_static):
  """Returns the documented member, and the position to sort by from the type itself."""
  position = None
  for i, java_type in enumerate(chain):
    for member in java_type.members:
      if (member.is_constructor or member.is_ignored or member.js_name != js_name
          or member.is_static != is_static):
        continue
      if i == 0 and position is None:
        position = member.line
      if member.javadoc and "{@inheritDoc}" not in member.javadoc:
        return member, position
  return None, position


def find_constructor(chain, param_types):
  for member in chain[0].members:
    if not member.is_constructor:
      continue
    types = [p.split()[-2].split(".")[-1] for p in split_params(member.params)]
    types = [re.sub(r"<.*", "", t) for t in types]
    if types == param_types:
      return member
  return None


def split_params(params):
  params = re.sub(r"\b(final)\s+", "", params).strip()
  if not params:
    return []
  out = []
  depth = 0
  current = ""
  for c in params:
    if c == "," and depth == 0:
      out.append(current.strip())
      current = ""
      continue
    depth += c == "<"
    depth -= c == ">"
    current += c
  out.append(current.strip())
  return out


def javadoc_to_tsdoc(javadoc):
  """Converts javadoc to the lines of a TSDoc comment's body."""
  body = javadoc[3:-2]
  lines = []
  for line in body.split("\n"):
    line = line.strip()
    if line.startswith("*"):
      line = line[1:]
      if line.startswith(" "):
        line = line[1:]
    lines.append(line.rstrip())
  text = "\n".join(lines).strip("\n")
  text = re.sub(r"^@author\b.*\n?", "", text, flags=re.M)
  text = convert_snippets(text)

  # Each keeps a line break that was inside the tag, so that lines keep their length
  def code(match):
    return ("\n" if "\n" in match.group(0) else "") + "`%s`" % match.group(1).strip()

  def link(match):
    target, label = match.group(1), (match.group(2) or "").strip()
    if label:
      label = re.sub(r"\s*\n\s*", "\n", label)
      return ("\n" if "\n" in match.group(0) and "\n" not in label else "") + label
    target = re.sub(r"\(.*\)", "", target)
    target = target.lstrip("#").replace("#", ".")
    return ("\n" if "\n" in match.group(0) else "") + "`%s`" % target

  text = re.sub(r"\{@code\s+((?:[^{}]|\{[^{}]*\})*)\}", code, text)
  text = re.sub(r"\{@(?:link|linkplain)\s+([^\s}]+(?:\([^)]*\))?)\s*([^}]*)\}", link, text)
  # Upstream has at least one link missing its closing brace
  text = re.sub(r"\{@link\s+#?([\w.#]+)(?:\([^)]*\))?", lambda m: "`%s`" % m.group(1), text)
  text = re.sub(r"\{@literal\s+([^}]*)\}", r"\1", text)
  text = re.sub(r"</?(?:code|tt)>", "`", text)
  text = re.sub(r"</?(?:em|i)>", "*", text)
  text = re.sub(r"</?(?:b|strong)>", "**", text)
  text = re.sub(r"\s*<p>\s*", "\n\n", text)
  text = re.sub(r"</p>", "", text)
  text = re.sub(r"\s*<pre>\s*", "\n\n```\n", text)
  text = re.sub(r"\s*</pre>\s*", "\n```\n\n", text)
  text = re.sub(r"\s*</?(?:ul|ol)>\s*", "\n\n", text)
  text = re.sub(r"\s*<li>\s*", "\n- ", text)
  text = re.sub(r"</li>", "", text)
  text = re.sub(r"<br\s*/?>", "\n", text)
  text = re.sub(r"^@return\b", "@returns", text, flags=re.M)
  text = html.unescape(text).replace("\u0000", "@")
  # Collapse the blank lines the replacements above leave behind
  text = re.sub(r"\n{3,}", "\n\n", text).strip("\n")
  return text.split("\n")


def convert_snippets(text):
  """Turns each {@snippet : ...} into a fenced code block, matching braces in the code."""
  while True:
    start = text.find("{@snippet")
    if start < 0:
      return text
    code_start = text.index("\n", start) + 1
    depth = 1
    i = code_start
    while depth:
      depth += {"{": 1, "}": -1}.get(text[i], 0)
      i += 1
    code = text[code_start:i - 1].rstrip()
    # Protect the code from the javadoc conversions that follow
    code = code.replace("{@", "{\u0000")
    text = text[:start] + "```\n" + code + "\n```" + text[i:]


def comment(lines, indent):
  out = [indent + "/**"]
  for line in lines:
    out.append((indent + " * " + line).rstrip())
  out.append(indent + " */")
  return out


def note_lines(note):
  """Returns the body of a comment written in index.d.ts."""
  body = "\n".join(note).strip()
  body = body[3:-2] if body.startswith("/**") else body
  lines = [re.sub(r"^\s*\* ?", "", l).rstrip() for l in body.split("\n")]
  return "\n".join(lines).strip().split("\n")


def process(dts, chains):
  lines = dts.split("\n")
  out = []
  i = 0
  pending = []
  while i < len(lines):
    line = lines[i]
    start = re.match(r"^export (?:class|interface) (\w+)", line)
    if line.startswith("/**") or (pending and not start and not line.startswith("export")):
      pending.append(line)
      i += 1
      continue
    if not start:
      out.extend(pending)
      pending = []
      out.append(line)
      i += 1
      continue

    name = start.group(1)
    chain = chains.get(name)
    note = note_lines(pending) if pending else []
    pending = []
    doc = []
    if chain and chain[0].javadoc:
      doc = javadoc_to_tsdoc(chain[0].javadoc)
    if doc and note:
      doc += [""] + note
    elif note:
      doc = note
    if doc:
      out.extend(comment(doc, ""))
    out.append(line)
    i += 1
    if line.endswith("{}"):
      continue

    # Gather the members, each with any comment above it
    members = []
    member_note = []
    in_note = False
    while lines[i] != "}":
      member = lines[i]
      if not member.strip():
        i += 1
        continue
      if member.strip().startswith("/**") or in_note:
        member_note.append(member)
        in_note = not member.strip().endswith("*/")
        i += 1
        continue
      # A declaration can wrap onto following lines
      declaration = [member]
      while not declaration[-1].rstrip().endswith(";"):
        i += 1
        declaration.append(lines[i])
      i += 1
      members.append((declaration, member_note))
      member_note = []

    ordered = []
    for index, (declaration, member_note) in enumerate(members):
      text = declaration[0].strip()
      parsed = re.match(r"(?:private )?(static )?(?:readonly )?(\w+)", text)
      is_static = bool(parsed.group(1))
      member_name = parsed.group(2)
      doc = []
      position = None
      if chain and member_name != "constructor":
        java, position = find_member(chain, member_name, is_static)
        if java:
          doc = javadoc_to_tsdoc(java.javadoc)
      note = note_lines(member_note) if member_note else []
      factory = re.match(r"Java's `new (\w+)\(([^)]*)\)`", " ".join(note))
      if chain and factory:
        param_types = [t.strip() for t in factory.group(2).split(",") if t.strip()]
        param_types = [re.sub(r"<.*", "", t) for t in param_types]
        constructor = find_constructor(chain, param_types)
        if constructor is None:
          raise ValueError("No constructor %s(%s)" % (factory.group(1), factory.group(2)))
        position = constructor.line
        if constructor.javadoc:
          doc = javadoc_to_tsdoc(constructor.javadoc)
      if doc and note:
        doc += [""] + note
      elif note:
        doc = note
      # Members Java doesn't have, like the constructor, keep their place ahead of the rest
      key = (0, index) if position is None and member_name == "constructor" else (
          (1, position) if position is not None else (2, index))
      ordered.append((key, doc, declaration))

    ordered.sort(key=lambda entry: entry[0])
    for n, (_, doc, declaration) in enumerate(ordered):
      if doc:
        if n > 0:
          out.append("")
        out.extend(comment(doc, "  "))
      elif n > 0 and ordered[n - 1][1]:
        out.append("")
      out.extend(declaration)
    out.append(lines[i])
    i += 1
  out.extend(pending)
  return "\n".join(out)


def main():
  dts_path, output_path, *sources = sys.argv[1:]
  with open(dts_path) as f:
    dts = f.read()
  chains = load_types(sources)
  with open(output_path, "w") as f:
    f.write(process(dts, chains))


if __name__ == "__main__":
  main()
