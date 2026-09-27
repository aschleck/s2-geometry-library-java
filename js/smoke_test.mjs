// Checks that the compiled package exposes a working API. Run it after building:
//
//   bazel build //js:npm_package && node js/smoke_test.mjs
//
// It also checks that everything index.d.ts declares survived compilation, which catches a name
// missing from exports.js or externs.js. The encoded values below came from the Java library, so
// this also checks that JS decodes what Java encodes.

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as s2 from '../bazel-bin/js/npm_package/index.js';
import {
  ArrayList,
  Bytes,
  Long,
  R1Interval,
  S1Angle,
  S1ChordAngle,
  S1Interval,
  S2Cap,
  S2Cell,
  S2CellId,
  S2CellUnion,
  S2Earth,
  S2LatLng,
  S2LatLngRect,
  S2Loop,
  S2Point,
  S2Polygon,
  S2Polyline,
  S2RegionCoverer,
} from '../bazel-bin/js/npm_package/index.js';

// A 1 degree square with corners at (47, -122) and (48, -121), encoded by S2Polygon#encode
const SQUARE =
    'AQEAAQAAAAEEAAAAdzNviD4h17/VK1Nf/IHiv4JpyOA/Z+c/a7ngw/Z61r/fiDcn77Tiv4JpyOA/Z+c/38t2gWEO1r/a' +
    'uezyk1riv8K+M6jXx+c/AdXnHYax1r8yrHBBlyjiv8K+M6jXx+c/AAAAAAAB51Zpvu8/6j9OPN2oEc/qP9q9tlLPCAHA' +
    'oBhyxRDlAMAB51Zpvu8/6j9OPN2oEc/qP9q9tlLPCAHAoBhyxRDlAMA=';
const SQUARE_AREA = 2.057906391923525e-4;
// The cells 80b and 89c25, encoded by S2CellUnion#encode
const CELL_UNION = 'AQIAAAAAAAAAAAAAAAAAsIAAAAAAAFDCiQ==';

function decode(coder, base64) {
  const bytes = Bytes.fromByteArray(Uint8Array.from(Buffer.from(base64, 'base64')));
  return coder.decode(bytes, bytes.cursor(Long.fromInt(0), bytes.length()));
}

function close(actual, expected, epsilon = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} is not close to ${expected}`);
}

/** @typedef {{name: string, isConst: boolean, statics: string[], instance: string[]}} Declared */

/**
 * Returns the members index.d.ts declares for each exported value, so that a test can check that
 * exports.js and externs.js kept all of them.
 */
function declaredMembers() {
  const dts = readFileSync(new URL('../bazel-bin/js/npm_package/index.d.ts', import.meta.url), 'utf8');
  /** @type {Declared[]} */
  const declared = [];
  /** @type {Declared|undefined} */
  let current;
  for (const line of dts.split('\n')) {
    const start = line.match(/^export (?:class (\w+)|const (\w+): \{)/);
    if (start) {
      // A const, like Bytes, is an object of functions rather than a class
      current = {name: start[1] ?? start[2], isConst: !start[1], statics: [], instance: []};
      declared.push(current);
      continue;
    }
    if (/^\S/.test(line)) {
      current = undefined;
      continue;
    }
    const member = line.match(/^  (static )?(?:readonly )?(\w+)[(<:]/);
    if (current && member && member[2] !== 'constructor') {
      (member[1] || current.isConst ? current.statics : current.instance).push(member[2]);
    }
  }
  return declared;
}

const tests = {
  declaredApiExists() {
    const missing = [];
    for (const {name, statics, instance} of declaredMembers()) {
      const value = s2[name];
      if (value === undefined) {
        missing.push(name);
        continue;
      }
      for (const m of statics) {
        if (value[m] === undefined) {
          missing.push(`${name}.${m}`);
        }
      }
      for (const m of instance) {
        if (!(m in value.prototype)) {
          missing.push(`${name}#${m}`);
        }
      }
    }
    assert.deepEqual(missing, []);
    assert.deepEqual(
        Object.keys(s2).sort(), declaredMembers().map(({name}) => name).sort());
  },

  noGlobalsLeak() {
    assert.equal(globalThis.$s2exports, undefined);
    assert.equal(globalThis.com, undefined);
  },

  angles() {
    close(S1Angle.degrees(180).radians(), Math.PI);
    close(S1Angle.e7(1800000000).degrees(), 180);
    close(S1Angle.radians(1).radians(), 1);
    close(new S1Angle(2).radians(), 2);
  },

  latLngs() {
    const ll = S2LatLng.fromDegrees(47.5, -121.5);
    close(ll.latDegrees(), 47.5);
    close(ll.lngDegrees(), -121.5);
    close(S2LatLng.fromE7(475000000, -1215000000).latRadians(), ll.latRadians());
    const roundTripped = S2LatLng.fromPoint(ll.toPoint());
    close(roundTripped.lngRadians(), ll.lngRadians());
    close(S2LatLng.fromRadians(0, 0).getDistance(S2LatLng.fromRadians(0, 1)).radians(), 1);
    assert.equal(typeof ll.toStringDegrees(), 'string');
  },

  points() {
    const p = new S2Point(1, 2, 3);
    assert.equal(p.add(p).getX(), 2);
    assert.equal(p.sub(p).getY(), 0);
    assert.equal(p.mul(2).getZ(), 6);
    assert.equal(p.div(2).getZ(), 1.5);
    close(new S2Point(1, 0, 0).angle(new S2Point(0, 1, 0)), Math.PI / 2);
  },

  cellIds() {
    const ll = S2LatLng.fromDegrees(47.5, -121.5);
    const id = S2CellId.fromLatLng(ll).parentAtLevel(10);
    assert.equal(id.level(), 10);
    assert.equal(S2CellId.fromToken(id.toToken()).toToken(), id.toToken());
    assert.equal(S2CellId.fromPoint(ll.toPoint()).parentAtLevel(10).toToken(), id.toToken());
    assert.equal(new S2CellId(Long.fromString(id.id().toString())).toToken(), id.toToken());
    const raw = id.id();
    assert.ok(Long.fromBits(raw.getLowBits(), raw.getHighBits()).equals(raw));
    assert.ok(id.rangeMin().id().toNumber() <= id.rangeMax().id().toNumber());
    assert.equal(id.toLoop(10).numVertices(), 4);
    assert.equal(S2CellId.fromFace(0).level(), 0);

    const cell = S2Cell.fromCellId(id);
    assert.equal(cell.id().toToken(), id.toToken());
    assert.equal(cell.level(), 10);
    assert.ok(cell.exactArea() > 0);
    assert.equal(S2Cell.fromFace(1).level(), 0);
  },

  lists() {
    const list = ArrayList.create();
    list.add('a');
    list.add('b');
    assert.equal(list.size(), 2);
    assert.equal(list.getAtIndex(1), 'b');
  },

  polygons() {
    const vertices = ArrayList.create();
    vertices.add(S2LatLng.fromDegrees(47, -122).toPoint());
    vertices.add(S2LatLng.fromDegrees(47, -121).toPoint());
    vertices.add(S2LatLng.fromDegrees(48, -121).toPoint());
    vertices.add(S2LatLng.fromDegrees(48, -122).toPoint());
    const loop = S2Loop.fromVertices(vertices);
    assert.equal(loop.numVertices(), 4);
    assert.equal(loop.isHole(), false);
    assert.equal(loop.sign(), 1);
    assert.equal(loop.vertices().size(), 4);
    assert.ok(loop.vertex(0).getX() !== 0);

    const polygon = S2Polygon.fromLoopArray(loop);
    close(polygon.getArea(), SQUARE_AREA);
    assert.equal(polygon.numLoops(), 1);
    assert.equal(polygon.loop(0).numVertices(), 4);
    assert.equal(polygon.getLoops().getAtIndex(0).numVertices(), 4);
    assert.ok(polygon.containsPoint(S2LatLng.fromDegrees(47.5, -121.5).toPoint()));
    assert.ok(!polygon.containsPoint(S2LatLng.fromDegrees(46.5, -121.5).toPoint()));
    close(polygon.getRectBound().lo().latDegrees(), 47, 1e-6);

    const empty = S2Polygon.fromLoopArray();
    assert.equal(empty.numLoops(), 0);
    const union = S2Polygon.fromLoopArray();
    union.initToUnion(polygon, empty);
    close(union.getArea(), SQUARE_AREA);
    const intersection = S2Polygon.fromLoopArray();
    intersection.initToIntersection(polygon, union);
    assert.ok(polygon.contains(intersection));
    assert.ok(polygon.intersects(union));
    assert.equal(S2Loop.empty().numVertices(), 1);
    assert.equal(S2Polygon.fromLoops(ArrayList.create()).numLoops(), 0);
  },

  decoding() {
    const fast = decode(S2Polygon.FAST_CODER, SQUARE);
    close(fast.getArea(), SQUARE_AREA);
    const compact = decode(S2Polygon.COMPACT_CODER, SQUARE);
    assert.equal(compact.numLoops(), 1);
    // trailcatalog's empty polygon, in the compressed encoding
    const compressed = Bytes.fromByteArray(Uint8Array.from([4, 1, 0]));
    assert.equal(
        S2Polygon.FAST_CODER.decode(compressed, compressed.cursor(Long.fromInt(0), compressed.length()))
            .numLoops(),
        0);

    const cells = decode(S2CellUnion.FAST_CODER, CELL_UNION);
    assert.equal(cells.size(), 2);
    assert.equal(cells.cellIds().getAtIndex(0).toToken(), '80b');
    assert.equal(cells.cellIds().getAtIndex(1).toToken(), '89c25');
    assert.ok(cells.containsCellId(S2CellId.fromToken('89c25').parentAtLevel(1).rangeMin()) === false);
    assert.ok(cells.intersectsCellId(S2CellId.fromToken('89c25')));
  },

  rects() {
    const rect = S2LatLngRect.fromPointPair(
        S2LatLng.fromDegrees(47, -122), S2LatLng.fromDegrees(48, -121));
    close(rect.getCenter().latDegrees(), 47.5);
    close(rect.getSize().lngDegrees(), 1);
    close(rect.lat().lo(), S1Angle.degrees(47).radians());
    close(rect.lng().hi(), S1Angle.degrees(-121).radians());
    assert.ok(rect.area() > 0);
    assert.ok(rect.contains(S2LatLngRect.fromPoint(S2LatLng.fromDegrees(47.5, -121.5))));
    assert.ok(rect.intersects(rect.expanded(S2LatLng.fromDegrees(1, 1))));
    assert.ok(rect.expandedByDistance(S1Angle.degrees(1)).contains(rect));
    assert.ok(S2LatLngRect.empty().getSize().latDegrees() < 0);
    assert.ok(S2LatLngRect.full().contains(rect));
    assert.equal(typeof rect.toStringDegrees(), 'string');
    assert.ok(S2LatLngRect.fromCenterSize(rect.getCenter(), rect.getSize()).contains(rect));

    // Spans more than half the world, which fromPointPair would take the short way around
    const wide = S2LatLngRect.fromIntervals(
        R1Interval.fromPointPair(0, 0.5), new S1Interval(-2, 2));
    close(wide.lng().hi() - wide.lng().lo(), 4);
    assert.ok(R1Interval.empty().lo() > R1Interval.empty().hi());
    assert.ok(S1Interval.full().hi() > S1Interval.full().lo());
    close(S1Interval.fromPointPair(1, -1).lo(), -1);
    assert.ok(S1Interval.empty().lo() > 0);
    close(new R1Interval(1, 2).hi(), 2);
  },

  covering() {
    const coverer = S2RegionCoverer.builder()
        .setMaxCells(1000)
        .setMinLevel(6)
        .setMaxLevel(6)
        .build();
    const rect = S2LatLngRect.fromPointPair(
        S2LatLng.fromDegrees(47, -122), S2LatLng.fromDegrees(48, -121));
    const union = new S2CellUnion();
    coverer.getCoveringCellUnion(rect, union);
    assert.ok(union.size() > 0);
    union.expandAtLevel(6);
    const cells = ArrayList.create();
    union.denormalize(6, 1, cells);
    assert.ok(cells.size() >= union.size());
    for (let i = 0; i < cells.size(); ++i) {
      assert.equal(cells.getAtIndex(i).level(), 6);
    }

    const list = ArrayList.create();
    coverer.getCoveringList(rect, list);
    assert.ok(list.size() > 0);

    const raw = new S2CellUnion();
    raw.initRawCellIds(list);
    assert.equal(raw.size(), list.size());
  },

  chordAngles() {
    const right = S1ChordAngle.RIGHT;
    close(right.degrees(), 90, 1e-12);
    close(right.getLength2(), 2);
    close(S1ChordAngle.STRAIGHT.degrees(), 180);
    assert.ok(S1ChordAngle.STRAIGHT.isStraight());
    assert.ok(S1ChordAngle.ZERO.isZero());
    assert.ok(S1ChordAngle.INFINITY.isInfinity() && S1ChordAngle.INFINITY.isSpecial());
    assert.ok(S1ChordAngle.NEGATIVE.isNegative());
    const x = new S2Point(1, 0, 0);
    const y = new S2Point(0, 1, 0);
    assert.ok(S1ChordAngle.fromPoints(x, y).equals(right));
    close(S1ChordAngle.fromDegrees(30).radians(), Math.PI / 6);
    close(S1ChordAngle.fromRadians(1).toAngle().radians(), 1);
    close(S1ChordAngle.fromS1Angle(S1Angle.degrees(45)).degrees(), 45, 1e-12);
    close(S1ChordAngle.fromE5(4500000).e5(), 4500000, 1e-3);
    close(S1ChordAngle.fromE6(45000000).e6(), 45000000, 1e-2);
    close(S1ChordAngle.fromE7(450000000).e7(), 450000000, 1e-1);
    close(S1ChordAngle.fromLength2(2).degrees(), 90, 1e-12);
    const thirty = S1ChordAngle.fromDegrees(30);
    const sixty = S1ChordAngle.fromDegrees(60);
    close(S1ChordAngle.add(thirty, sixty).degrees(), 90, 1e-9);
    close(S1ChordAngle.sub(sixty, thirty).degrees(), 30, 1e-9);
    close(S1ChordAngle.sin(thirty), 0.5, 1e-12);
    close(S1ChordAngle.sin2(thirty), 0.25, 1e-12);
    close(S1ChordAngle.cos(sixty), 0.5, 1e-12);
    close(S1ChordAngle.tan(S1ChordAngle.fromDegrees(45)), 1, 1e-12);
    assert.ok(S1ChordAngle.max(thirty, sixty).equals(sixty));
    assert.ok(S1ChordAngle.min(thirty, sixty).equals(thirty));
    assert.ok(thirty.lessThan(sixty) && thirty.lessOrEquals(sixty));
    assert.ok(sixty.greaterThan(thirty) && sixty.greaterOrEquals(thirty));
    assert.ok(thirty.compareTo(sixty) < 0);
    assert.ok(thirty.successor().greaterThan(thirty));
    assert.ok(thirty.predecessor().lessThan(thirty));
    assert.ok(thirty.plusError(thirty.getS1AngleConstructorMaxError()).greaterOrEquals(thirty));
    assert.ok(thirty.getS2PointConstructorMaxError() > 0);
    assert.ok(thirty.isValid());
    assert.equal(typeof thirty.toString(), 'string');

    const cap = S2Cap.fromAxisChord(x, right);
    assert.ok(cap.radius().equals(right));
    assert.ok(cap.containsPoint(y));
    const cell = S2Cell.fromFace(0);
    assert.ok(cell.getDistanceToPoint(cell.getCenter()).isZero());
    assert.ok(cell.getDistanceToPoint(x.neg()).greaterThan(right));
    assert.ok(cell.getDistance(S2Cell.fromFace(3)).greaterThan(S1ChordAngle.ZERO));
    assert.ok(cell.getMaxDistance(cell).greaterThan(S1ChordAngle.ZERO));
  },

  encoding() {
    const square = S2Polygon.FAST_CODER.unsafeDecode(
        Bytes.fromByteArray(Uint8Array.from(Buffer.from(SQUARE, 'base64'))));
    close(square.getArea(), SQUARE_AREA);
    // Java bytes are signed, so compare them as such
    const encoded = S2Polygon.COMPACT_CODER.unsafeEncode(square);
    assert.deepEqual(Int8Array.from(encoded), new Int8Array(Buffer.from(SQUARE, 'base64')));
    const cells = decode(S2CellUnion.FAST_CODER, CELL_UNION);
    assert.deepEqual(
        Int8Array.from(S2CellUnion.FAST_CODER.unsafeEncode(cells)),
        new Int8Array(Buffer.from(CELL_UNION, 'base64')));
    assert.equal(S2Polygon.FAST_CODER.isLazy(), false);

    const roundTrip = (coder, value) =>
        coder.unsafeDecode(Bytes.fromByteArray(coder.unsafeEncode(value)));
    const p = S2LatLng.fromDegrees(10, 20).toPoint();
    assert.ok(roundTrip(S2Point.CODER, p).equalsPoint(p));
    assert.ok(roundTrip(S2LatLng.CODER, S2LatLng.fromDegrees(10, 20)).equals(S2LatLng.fromDegrees(10, 20)));
    const rect = S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(0, 0), S2LatLng.fromDegrees(1, 1));
    assert.ok(roundTrip(S2LatLngRect.CODER, rect).equals(rect));
    const cap = S2Cap.fromAxisAngle(p, S1Angle.degrees(1));
    assert.ok(roundTrip(S2Cap.CODER, cap).equals(cap));
    const id = S2CellId.fromToken('89c25');
    assert.equal(roundTrip(S2CellId.CODER, id).toToken(), '89c25');
    assert.equal(roundTrip(S2CellId.TOKEN_CODER, id).toToken(), '89c25');
    const line = new S2Polyline([p, S2LatLng.fromDegrees(11, 20).toPoint()]);
    assert.ok(roundTrip(S2Polyline.FAST_CODER, line).equals(line));
    assert.ok(roundTrip(S2Polyline.COMPACT_CODER, line).equals(line));
  },

  angleMath() {
    const a = S1Angle.degrees(30);
    const b = S1Angle.degrees(60);
    close(a.add(b).degrees(), 90);
    close(b.sub(a).degrees(), 30, 1e-12);
    close(a.mul(2).degrees(), 60, 1e-12);
    close(b.div(2).degrees(), 30, 1e-12);
    close(a.neg().abs().degrees(), 30);
    close(a.sin(), 0.5, 1e-12);
    close(b.cos(), 0.5, 1e-12);
    close(S1Angle.degrees(45).tan(), 1, 1e-12);
    close(S1Angle.degrees(270).normalize().degrees(), -90, 1e-12);
    close(S1Angle.radians(2).distance(3), 6);
    close(S1Angle.e5(4500000).e5(), 4500000, 1e-6);
    close(S1Angle.e6(45000000).e6(), 45000000, 1e-6);
    close(a.e7(), 300000000, 1e-6);
    assert.ok(S1Angle.max(a, b).equals(b) && S1Angle.min(a, b).equals(a));
    assert.ok(a.lessThan(b) && a.lessOrEquals(b) && b.greaterThan(a) && b.greaterOrEquals(a));
    assert.ok(a.compareTo(b) < 0);
    assert.ok(S1Angle.ZERO.isZero());
    assert.ok(S1Angle.INFINITY.greaterThan(b));
    assert.equal(typeof a.toString(), 'string');

    const r = new R1Interval(1, 3);
    assert.ok(r.containsPoint(2) && r.interiorContainsPoint(2) && !r.interiorContainsPoint(1));
    assert.ok(r.contains(new R1Interval(1, 2)) && r.interiorContains(new R1Interval(1.5, 2)));
    assert.ok(r.intersects(new R1Interval(3, 4)) && !r.interiorIntersects(new R1Interval(3, 4)));
    close(r.getCenter(), 2);
    close(r.getLength(), 2);
    close(r.clampPoint(5), 3);
    close(r.expanded(1).lo(), 0);
    close(r.union(new R1Interval(5, 6)).hi(), 6);
    close(r.intersection(new R1Interval(2, 6)).lo(), 2);
    close(r.addPoint(0).lo(), 0);
    close(r.getDirectedHausdorffDistance(new R1Interval(1, 2)), 1);
    assert.ok(R1Interval.fromPoint(1).containsPoint(1) && R1Interval.empty().isEmpty());
    assert.ok(r.approxEquals(r) && r.approxEqualsWithMaxError(new R1Interval(1, 3.1), 0.2));
    assert.ok(r.equals(new R1Interval(1, 3)));
    assert.equal(typeof r.toString(), 'string');

    const s = new S1Interval(3, -3);
    assert.ok(s.isInverted() && s.isValid() && !s.isEmpty() && !s.isFull());
    assert.ok(s.containsPoint(Math.PI) && s.fastContains(Math.PI) && s.interiorContainsPoint(Math.PI));
    assert.ok(s.contains(new S1Interval(3.1, -3.1)));
    assert.ok(s.interiorContains(new S1Interval(3.1, -3.1)));
    assert.ok(s.intersects(new S1Interval(2, 3)) && !s.interiorIntersects(new S1Interval(2, 3)));
    close(s.getLength(), 2 * Math.PI - 6, 1e-12);
    close(Math.abs(s.getCenter()), Math.PI, 1e-12);
    close(s.complement().lo(), -3);
    close(s.getComplementCenter(), 0);
    close(s.get(0), 3);
    close(s.clampPoint(1), 3);
    assert.ok(s.expanded(0.1).contains(s));
    assert.ok(s.union(new S1Interval(2, 3)).containsPoint(2.5));
    assert.ok(s.intersection(new S1Interval(3, 3.1)).containsPoint(3.05));
    assert.ok(s.addPoint(2).containsPoint(2));
    assert.ok(s.getDirectedHausdorffDistance(s) === 0);
    assert.ok(s.approxEquals(s) && s.approxEqualsWithMaxError(s, 0) && s.equals(new S1Interval(3, -3)));
    assert.ok(S1Interval.fromPoint(1).containsPoint(1));
    close(S1Interval.positiveDistance(3, -3), 2 * Math.PI - 6, 1e-12);
    assert.equal(typeof s.toString(), 'string');
  },

  cellNeighbors() {
    const id = S2CellId.fromToken('89c25');
    const edges = new Array(4);
    id.getEdgeNeighbors(edges);
    assert.equal(edges.length, 4);
    for (const n of edges) {
      assert.equal(n.level(), id.level());
      assert.ok(!n.equals(id));
    }
    const vertex = ArrayList.create();
    id.getVertexNeighbors(id.level() - 1, vertex);
    assert.equal(vertex.size(), 4);
    const all = ArrayList.create();
    id.getAllNeighbors(id.level(), all);
    assert.equal(all.size(), 8);
    assert.ok(id.childBeginAtLevel(id.level() + 2).compareTo(id.childEndAtLevel(id.level() + 2)) < 0);
    assert.equal(id.child(2).childPosition(), 2);
    assert.equal(id.childPositionAtLevel(id.level()), id.childPosition());
    assert.equal(S2CellId.end(0).prevWrap().nextWrap().toToken(), S2CellId.begin(0).toToken());
    assert.equal(id.advance(Long.fromInt(1)).toToken(), id.next().toToken());
    assert.equal(id.advanceWrap(Long.fromInt(-1)).toToken(), id.prev().toToken());
    assert.equal(S2CellId.begin(id.level()).advance(id.distanceFromBegin()).toToken(), '89c25');
    assert.equal(S2CellId.fromFaceIJ(id.face(), id.getI(), id.getJ()).parentAtLevel(id.level()).toToken(), '89c25');
    assert.ok(id.getOrientation() >= 0 && id.getOrientation() < 4);
    assert.equal(id.getSizeIJ(), S2CellId.getSizeIJ(id.level()));
    close(id.getSizeST(), S2CellId.getSizeST(id.level()));
    assert.ok(id.lowestOnBit().equals(S2CellId.lowestOnBitForLevel(id.level())));
    assert.ok(id.pos().toNumber() !== 0);
    assert.ok(id.maximumTile(id.rangeMax().next()).contains(id));
    assert.ok(id.lessThan(id.next()) && id.lessOrEquals(id));
    assert.ok(id.next().greaterThan(id) && id.greaterOrEquals(id));
    assert.equal(S2CellId.FACE_CELLS.length, 6);
    assert.ok(S2CellId.sentinel().greaterThan(S2CellId.end(30).prev()));
    assert.ok(S2CellId.isValidOrNoneToken('X'));

    const cell = S2Cell.fromCellId(id);
    assert.ok(cell.getEdge(0).norm() > 0);
    assert.ok(cell.getSizeIJ() > 0);
    assert.ok(cell.orientation() >= 0);
    assert.ok(cell.equals(S2Cell.fromCellId(id)));
    const far = S2LatLng.fromDegrees(-40, 100).toPoint();
    assert.ok(cell.getMaxDistanceToPoint(far).greaterThan(cell.getDistanceToPoint(far)));
    assert.ok(cell.getBoundaryDistance(cell.getCenter()).greaterThan(S1ChordAngle.ZERO));
    assert.ok(cell.getDistanceToEdge(far, far.neg()).greaterOrEquals(S1ChordAngle.ZERO));
    assert.ok(cell.getMaxDistanceToEdge(far, far).greaterThan(S1ChordAngle.ZERO));
    assert.ok(cell.isDistanceLessOrEqual(cell, S1ChordAngle.ZERO));
    assert.equal(S2Cell.fromFacePosLevel(4, id.pos(), id.level()).id().toToken(), '89c25');
    const bound = ArrayList.create();
    cell.getCellUnionBound(bound);
    assert.ok(bound.size() > 0);
  },

  moreCellUnions() {
    const a = new S2CellUnion().initFromCellId(S2CellId.fromToken('89c25'));
    const b = new S2CellUnion().initFromCellId(S2CellId.fromToken('80b'));
    assert.equal(S2CellUnion.union(a, b).size(), 2);
    assert.equal(S2CellUnion.intersection(a, b).size(), 0);
    const clipped = new S2CellUnion();
    clipped.getIntersection(a, S2CellId.fromToken('89c25').child(1));
    assert.equal(clipped.size(), 1);
    assert.equal(S2CellUnion.wholeSphere().size(), 6);
    assert.ok(a.isValid() && a.isNormalized());
    assert.ok(a.leafCellsCovered().toNumber() > 0);
    assert.ok(a.averageBasedArea() > 0);
    const ids = ArrayList.create();
    ids.add(S2CellId.fromToken('89c25').id());
    assert.equal(new S2CellUnion().initFromIds(ids).size(), 1);
    assert.equal(new S2CellUnion().initRawIds(ids).size(), 1);
    assert.equal(new S2CellUnion().initFromId(S2CellId.fromToken('80b').id()).size(), 1);
    const swap = ArrayList.create();
    swap.add(S2CellId.fromToken('89c25'));
    assert.equal(new S2CellUnion().initSwap(swap).size(), 1);
    const rawSwap = ArrayList.create();
    rawSwap.add(S2CellId.fromToken('89c25'));
    const raw = new S2CellUnion();
    raw.initRawSwap(rawSwap);
    assert.equal(raw.size(), 1);
    const range = new S2CellUnion();
    range.initFromMinMax(
        S2CellId.fromToken('89c25').rangeMin(), S2CellId.fromToken('89c25').rangeMax());
    assert.equal(range.cellId(0).toToken(), '89c25');
    const expanded = new S2CellUnion().initFromCellId(S2CellId.fromToken('89c25'));
    expanded.expand(S1Angle.degrees(0.1), 2);
    assert.ok(expanded.contains(a) && expanded.size() > 1);
    a.pack();
    assert.ok(a.equals(new S2CellUnion().initFromCellId(S2CellId.fromToken('89c25'))));
    a.clear();
    assert.ok(a.isEmpty());
    assert.equal(typeof b.toString(), 'string');
  },

  polylinesAndPolygons() {
    const center = S2LatLng.fromDegrees(0, 0).toPoint();
    const polygon = S2Polygon.fromLoopArray(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 32));
    const line = new S2Polyline([
      S2LatLng.fromDegrees(0, -2).toPoint(),
      S2LatLng.fromDegrees(0, 2).toPoint(),
    ]);
    assert.ok(polygon.intersectsPolyline(line));
    assert.ok(!polygon.containsPolyline(line));
    assert.ok(!polygon.disjoint(line));
    const inside = polygon.intersectWithPolyline(line);
    assert.equal(inside.size(), 1);
    close(inside.getAtIndex(0).getArclengthAngle().degrees(), 2, 1e-2);
    const outside = polygon.subtractFromPolyline(line);
    assert.equal(outside.size(), 2);
    assert.equal(polygon.approxSubtractFromPolyline(line, S1Angle.degrees(0.001)).size(), 2);

    assert.ok(polygon.projectToBoundary(center).dotProd(center) < 1);
    assert.ok(polygon.approxContains(polygon, S1Angle.degrees(0.001)));
    assert.ok(polygon.boundaryApproxEquals(polygon, 1e-9));
    assert.ok(polygon.isNormalized());
    assert.ok(polygon.equalsPolygon(polygon) && polygon.equals(polygon));
    assert.equal(polygon.getParent(0), -1);
    assert.equal(polygon.getLastDescendant(0), 0);
    assert.equal(polygon.simplify(8).numVertices() <= 8, true);
    const snapped = S2Polygon.fromLoopArray();
    snapped.initToSnapped(polygon, 20);
    assert.equal(snapped.getSnapLevel(), 20);
    const merged = S2Polygon.fromLoopArray();
    merged.initToUnionMergeRadius(polygon, polygon, S1Angle.degrees(0.001));
    close(merged.getArea(), polygon.getArea(), 1e-9);
    const inCell = S2Polygon.fromLoopArray();
    inCell.initToSimplifiedInCell(
        polygon, S2Cell.fromFace(0), S1Angle.degrees(0.01), S1Angle.degrees(0.01));
    assert.ok(inCell.numVertices() > 0);
    close(S2Polygon.getOverlapFraction(polygon, polygon), 1, 1e-9);

    const loops = ArrayList.create();
    loops.add(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16));
    const nested = S2Polygon.fromLoopArray();
    nested.initNested(loops);
    assert.equal(nested.numLoops(), 1);
    const oneLoop = S2Polygon.fromLoopArray();
    oneLoop.initOneLoop(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16));
    assert.equal(oneLoop.numLoops(), 1);
    const oriented = ArrayList.create();
    oriented.add(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16));
    const orientedPolygon = S2Polygon.fromLoopArray();
    orientedPolygon.initOriented(oriented);
    assert.equal(orientedPolygon.numLoops(), 1);
    const initLoops = ArrayList.create();
    initLoops.add(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16));
    const initPolygon = S2Polygon.fromLoopArray();
    initPolygon.init(initLoops);
    assert.equal(initPolygon.numLoops(), 1);

    const loop = S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16);
    // Gauss-Bonnet: on the sphere a loop turns less than 2 pi, by its area
    close(loop.getTurningAngle(), 2 * Math.PI - loop.getArea(), 1e-9);
    assert.ok(loop.containsNested(S2Loop.makeRegularLoop(center, S1Angle.degrees(0.5), 16)));
    assert.equal(loop.compareBoundary(S2Loop.makeRegularLoop(center, S1Angle.degrees(0.5), 16)), 1);
    assert.ok(loop.getSubregionBound().contains(loop.getRectBound()));
    assert.ok(!loop.isEmptyOrFull());
    assert.equal(typeof loop.isOriginInside(), 'boolean');
    assert.ok(loop.orientedVertex(0).equalsPoint(loop.vertex(0)));
    assert.equal(loop.orientedVertices().size(), 16);
    assert.equal(loop.depth(), 0);
    assert.ok(loop.equals(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16)));
    assert.equal(loop.compareTo(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16)), 0);
    assert.equal(S2Loop.makeRegularVertices(center, S1Angle.degrees(1), 5).size(), 5);

    close(S2LatLng.fromPoint(line.getCentroid()).lngDegrees(), 0, 1e-9);
    close(S2LatLng.fromPoint(line.projectToEdge(S2LatLng.fromDegrees(1, 1).toPoint(), 0)).latDegrees(), 0, 1e-9);
    assert.ok(S2Polyline.fromSnapped(line, 20).getSnapLevel() === 20);
    assert.ok(!line.isEmpty() && !line.isFull());
    const dupes = ArrayList.create();
    dupes.add(center);
    dupes.add(center);
    dupes.add(S2LatLng.fromDegrees(0, 1).toPoint());
    S2Polyline.deduplicatePoints(dupes);
    assert.equal(dupes.size(), 2);
  },

  pointsAndRects() {
    const x = S2Point.X_POS;
    assert.ok(x.equalsPoint(new S2Point(1, 0, 0)) && S2Point.X_NEG.equalsPoint(x.neg()));
    assert.ok(S2Point.Y_POS.getY() === 1 && S2Point.Y_NEG.getY() === -1);
    assert.ok(S2Point.Z_POS.getZ() === 1 && S2Point.Z_NEG.getZ() === -1);
    assert.equal(S2Point.ZERO.norm(), 0);
    assert.ok(S2Point.minus(x, x).equalsPoint(S2Point.ZERO));
    close(S2Point.scalarTripleProduct(S2Point.Z_POS, x, S2Point.Y_POS), 1);
    close(S2Point.rotate(x, S2Point.Z_POS, Math.PI / 2).getY(), 1, 1e-12);
    close(x.rotate(S2Point.Z_POS, Math.PI / 2).getY(), 1, 1e-12);
    close(x.crossProdNorm(S2Point.Y_POS), 1);
    assert.equal(new S2Point(-1, -3, 2).fabs().getY(), 3);
    assert.equal(new S2Point(1, -3, 2).largestAbsComponent(), 1);
    assert.equal(new S2Point(1, 2, 3).get(2), 3);
    close(x.getDistance2(S2Point.Y_POS), 2);
    assert.ok(x.isValid());
    assert.ok(S2Point.X_NEG.lessThan(x) && S2Point.X_NEG.compareTo(x) < 0);
    assert.ok(x.equals(new S2Point(1, 0, 0)));
    assert.equal(typeof x.toString(), 'string');

    close(S2LatLng.latitude(S2LatLng.fromDegrees(10, 20).toPoint()).degrees(), 10, 1e-12);
    close(S2LatLng.longitude(S2LatLng.fromDegrees(10, 20).toPoint()).degrees(), 20, 1e-12);
    assert.ok(S2LatLng.isValid(0, 0) && !S2LatLng.isValid(2, 0));
    close(S2LatLng.fromDegrees(0, 0).getDistanceWithRadius(S2LatLng.fromRadians(0, 1), 2), 2);
    assert.ok(S2LatLng.fromDegrees(0, 0).approxEqualsWithMaxError(S2LatLng.fromDegrees(0, 0.5), 0.01));

    const a = S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(0, 0), S2LatLng.fromDegrees(10, 10));
    const b = S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(0, 20), S2LatLng.fromDegrees(10, 30));
    close(a.getDistanceLatLng(S2LatLng.fromDegrees(0, 11)).degrees(), 1, 1e-9);
    close(a.getHausdorffDistance(a).degrees(), 0);
    close(a.getDirectedHausdorffDistance(a).degrees(), 0);
    assert.ok(a.getCentroid().norm() > 0);
    assert.ok(a.interiorContainsPoint(S2LatLng.fromDegrees(5, 5).toPoint()));
    assert.ok(a.interiorContainsLatLng(S2LatLng.fromDegrees(5, 5)));
    assert.ok(!a.interiorIntersects(b));
    assert.ok(a.boundaryIntersects(
        S2LatLng.fromDegrees(5, -5).toPoint(), S2LatLng.fromDegrees(5, 5).toPoint()));
    assert.ok(!a.isInverted() && !a.isPoint());
    assert.ok(S2LatLngRect.fromPoint(S2LatLng.fromDegrees(1, 1)).isPoint());
    assert.ok(a.approxEqualsWithMaxError(a, 0));
    assert.ok(a.approxEqualsLatLng(a, S2LatLng.fromDegrees(0, 0)));
    assert.ok(S2LatLngRect.isValidIntervals(a.lat(), a.lng()));
    assert.ok(S2LatLngRect.isValidLoHi(a.lo(), a.hi()));
    assert.ok(S2LatLngRect.intersectsLngEdge(
        S2LatLng.fromDegrees(0, 4).toPoint(), S2LatLng.fromDegrees(0, 6).toPoint(),
        new R1Interval(-0.1, 0.1), S1Angle.degrees(5).radians()));
    assert.ok(S2LatLngRect.intersectsLatEdge(
        S2LatLng.fromDegrees(-1, 0).toPoint(), S2LatLng.fromDegrees(1, 0).toPoint(),
        0, new S1Interval(-0.1, 0.1)));

    const cap = S2Cap.fromAxisAngle(x, S1Angle.degrees(10));
    assert.ok(cap.interiorIntersects(cap));
    assert.equal(typeof cap.toString(), 'string');

    const coverer = S2RegionCoverer.DEFAULT;
    assert.ok(coverer.equals(S2RegionCoverer.DEFAULT));
    const fast = ArrayList.create();
    coverer.getFastCovering(cap, fast);
    assert.ok(fast.size() > 0);
    coverer.normalizeCovering(fast);
    assert.ok(fast.size() > 0);
    close(S2Earth.steradiansToSquareKm(S2Earth.squareKmToSteradians(3)), 3, 1e-9);
    close(S2Earth.haversine(Math.PI), 1, 1e-12);
  },

  earth() {
    close(S2Earth.getRadiusMeters(), 6371010);
    close(S2Earth.toMeters(S1Angle.radians(1)), 6371010, 1e-6);
    close(S2Earth.metersToRadians(S2Earth.radiansToMeters(0.25)), 0.25);
    close(S2Earth.kmToRadians(S2Earth.radiansToKm(0.25)), 0.25);
    close(S2Earth.toKm(S1Angle.radians(1)), 6371.01, 1e-9);
    const a = S2LatLng.fromDegrees(0, 0);
    const b = S2LatLng.fromDegrees(0, 1);
    close(S2Earth.getDistanceBetweenLatLngsMeters(a, b), 6371010 * Math.PI / 180, 1e-6);
    close(S2Earth.getDistanceBetweenLatLngsKm(a, b), 6371.01 * Math.PI / 180, 1e-9);
    close(
        S2Earth.getDistanceBetweenPointsMeters(a.toPoint(), b.toPoint()),
        S2Earth.getDistanceBetweenPointsKm(a.toPoint(), b.toPoint()) * 1000,
        1e-6);
    close(S2Earth.getInitialBearing(a, b).degrees(), 90, 1e-9);
    close(S2Earth.steradiansToSquareMeters(S2Earth.squareMetersToSteradians(5)), 5, 1e-9);
    close(S2Earth.getRadiusKm(), 6371.01);
  },

  cellNavigation() {
    assert.equal(S2CellId.MAX_LEVEL, 30);
    assert.equal(S2CellId.NUM_FACES, 6);
    const id = S2CellId.fromToken('89c25');
    assert.equal(id.parent().level(), id.level() - 1);
    assert.ok(id.parent().contains(id));
    assert.equal(id.child(0).parent().toToken(), id.toToken());
    assert.ok(id.childBegin().compareTo(id.childEnd()) < 0);
    assert.ok(id.next().compareTo(id) > 0);
    assert.equal(id.next().prev().toToken(), id.toToken());
    assert.ok(id.isValid());
    assert.ok(!id.isLeaf());
    assert.ok(!id.isFace());
    assert.ok(S2CellId.fromFace(2).isFace());
    assert.equal(id.face(), 4);
    assert.ok(id.intersects(id.parent()));
    assert.equal(id.getCommonAncestorLevel(id.next()), id.level() - 1);
    assert.ok(id.equals(S2CellId.fromToken('89c25')));
    assert.equal(S2CellId.fromPoint(id.toPoint()).parentAtLevel(id.level()).toToken(), '89c25');
    close(id.toLatLng().latDegrees(), S2LatLng.fromPoint(id.toPoint()).latDegrees());
    assert.equal(typeof id.toString(), 'string');
    assert.equal(S2CellId.begin(0).toToken(), S2CellId.fromFace(0).toToken());
    assert.ok(S2CellId.end(0).compareTo(S2CellId.begin(0)) > 0);
    assert.equal(S2CellId.fromFacePosLevel(4, id.childBegin().id(), 0).level(), 0);
    assert.ok(S2CellId.isValidToken('89c25'));
    assert.ok(!S2CellId.isValidToken('not a token'));
    assert.ok(!S2CellId.none().isValid());

    const cell = S2Cell.fromCellId(id);
    assert.ok(cell.containsPoint(cell.getCenter()));
    assert.ok(cell.getRectBound().containsPoint(cell.getVertex(2)));
    assert.ok(cell.getCapBound().containsPoint(cell.getCenter()));
    assert.ok(cell.containsCell(S2Cell.fromCellId(id.child(1))));
    assert.ok(cell.mayIntersect(S2Cell.fromCellId(id.parent())));
    assert.equal(cell.face(), 4);
    assert.ok(!cell.isLeaf());
    close(cell.approxArea(), cell.exactArea(), cell.exactArea() * 0.05);
    close(cell.averageArea(), S2Cell.averageAreaAtLevel(cell.level()));
  },

  latLngMath() {
    const ll = S2LatLng.fromDegrees(10, 20);
    close(ll.add(ll).latDegrees(), 20);
    close(ll.sub(ll).lngDegrees(), 0);
    close(ll.mul(2).lngDegrees(), 40);
    close(ll.lat().degrees(), 10);
    close(ll.lng().degrees(), 20);
    assert.ok(ll.isValid());
    assert.ok(!S2LatLng.fromDegrees(100, 0).isValid());
    assert.ok(S2LatLng.fromDegrees(100, 0).normalized().isValid());
    assert.ok(ll.approxEquals(S2LatLng.fromE6(10000000, 20000000)));
    assert.ok(ll.equals(S2LatLng.fromE5(1000000, 2000000)));
    assert.equal(S2LatLng.CENTER.latRadians(), 0);
    assert.equal(typeof ll.toString(), 'string');

    const x = new S2Point(1, 0, 0);
    const y = new S2Point(0, 1, 0);
    assert.equal(x.crossProd(y).getZ(), 1);
    assert.equal(x.dotProd(y), 0);
    assert.equal(x.neg().getX(), -1);
    assert.equal(new S2Point(3, 4, 0).norm(), 5);
    assert.equal(new S2Point(3, 4, 0).norm2(), 25);
    close(new S2Point(3, 4, 0).normalize().norm(), 1);
    assert.ok(x.equalsPoint(new S2Point(1, 0, 0)));
    assert.equal(x.ortho().dotProd(x), 0);
    close(x.getDistance(y), Math.SQRT2);
    assert.equal(typeof x.toDegreesString(), 'string');
    assert.ok(x.containsPoint(x));
  },

  rectOperations() {
    const a = S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(0, 0), S2LatLng.fromDegrees(10, 10));
    const b = S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(5, 5), S2LatLng.fromDegrees(15, 15));
    close(a.union(b).hi().latDegrees(), 15);
    close(a.intersection(b).lo().latDegrees(), 5);
    assert.ok(a.intersection(S2LatLngRect.fromPoint(S2LatLng.fromDegrees(50, 50))).isEmpty());
    assert.ok(S2LatLngRect.full().isFull());
    assert.ok(a.containsLatLng(S2LatLng.fromDegrees(1, 1)));
    assert.ok(a.containsPoint(S2LatLng.fromDegrees(1, 1).toPoint()));
    assert.ok(a.interiorContains(
        S2LatLngRect.fromPointPair(S2LatLng.fromDegrees(1, 1), S2LatLng.fromDegrees(2, 2))));
    assert.ok(a.intersectsCell(S2Cell.fromCellId(S2CellId.fromLatLng(S2LatLng.fromDegrees(1, 1)))));
    close(a.latLo().degrees(), 0);
    close(a.latHi().degrees(), 10);
    close(a.lngLo().degrees(), 0);
    close(a.lngHi().degrees(), 10);
    close(a.getVertex(2).latDegrees(), 10);
    assert.ok(a.isValid());
    assert.ok(a.approxEquals(a));
    assert.ok(a.equals(a));
    close(a.getDistance(S2LatLngRect.fromPoint(S2LatLng.fromDegrees(0, 11))).degrees(), 1, 1e-9);
    close(a.addLatLng(S2LatLng.fromDegrees(20, 0)).hi().latDegrees(), 20);
    close(a.addPoint(S2LatLng.fromDegrees(0, 20).toPoint()).hi().lngDegrees(), 20, 1e-9);
    assert.ok(a.convolveWithCap(S1Angle.degrees(1)).contains(a));
    assert.ok(a.polarClosure().contains(a));
    assert.ok(S2LatLngRect.fullLat().hi() > 1.5);
    assert.ok(S2LatLngRect.fullLng().hi() > 3);
    assert.ok(a.getCapBound().containsPoint(a.getCenter().toPoint()));
    assert.ok(a.mayIntersect(S2Cell.fromFace(0)));
  },

  caps() {
    const center = S2LatLng.fromDegrees(47.6, -122.3).toPoint();
    const cap = S2Cap.fromAxisAngle(center, S1Angle.radians(S2Earth.metersToRadians(1000)));
    assert.ok(cap.containsPoint(center));
    assert.ok(cap.interiorContains(center));
    assert.ok(!cap.containsPoint(S2LatLng.fromDegrees(47.7, -122.3).toPoint()));
    close(cap.angle().radians(), S2Earth.metersToRadians(1000), 1e-12);
    assert.ok(cap.axis().equalsPoint(center));
    assert.ok(cap.area() > 0);
    assert.ok(cap.height() > 0);
    assert.ok(cap.isValid());
    assert.ok(!cap.isEmpty() && !cap.isFull());
    assert.ok(S2Cap.empty().isEmpty());
    assert.ok(S2Cap.full().isFull());
    assert.ok(cap.complement().containsPoint(center.neg()));
    assert.ok(cap.expanded(S1Angle.degrees(1)).containsCap(cap));
    assert.ok(cap.union(cap).containsCap(cap));
    assert.ok(cap.addPoint(S2LatLng.fromDegrees(48, -122.3).toPoint()).containsCap(cap));
    assert.ok(cap.addCap(cap).intersectsCap(cap));
    assert.ok(cap.getRectBound().containsPoint(center));
    assert.ok(cap.getCentroid().dotProd(center) > 0);
    close(S2Cap.fromAxisArea(center, cap.area()).area(), cap.area(), 1e-15);
    close(S2Cap.fromAxisHeight(center, cap.height()).height(), cap.height());

    const covering = S2RegionCoverer.builder()
        .setMaxCells(8)
        .setMinLevel(10)
        .setMaxLevel(16)
        .setLevelMod(2)
        .build();
    assert.equal(covering.maxCells(), 8);
    assert.equal(covering.minLevel(), 10);
    assert.equal(covering.maxLevel(), 16);
    assert.equal(covering.levelMod(), 2);
    const union = covering.getCovering(cap);
    assert.ok(union.size() > 0 && union.size() <= 8);
    assert.ok(union.containsPoint(center));
    const interior = covering.getInteriorCovering(cap);
    assert.ok(union.contains(interior));
    const interiorUnion = new S2CellUnion();
    covering.getInteriorCoveringCellUnion(cap, interiorUnion);
    assert.equal(interiorUnion.size(), interior.size());
    const interiorList = ArrayList.create();
    covering.getInteriorCoveringList(cap, interiorList);
    assert.equal(interiorList.size(), interior.size());
    const simple = ArrayList.create();
    S2RegionCoverer.getSimpleCovering(cap, center, 14, simple);
    assert.ok(simple.size() > 0);
  },

  cellUnions() {
    const cells = ArrayList.create();
    cells.add(S2CellId.fromToken('89c25'));
    cells.add(S2CellId.fromToken('89c25').child(0));
    // initFromCellIds takes ownership of the list, so hand it a copy
    const copy = ArrayList.create();
    copy.add(cells.getAtIndex(0));
    copy.add(cells.getAtIndex(1));
    const union = new S2CellUnion().initFromCellIds(copy);
    assert.equal(union.size(), 1);
    assert.equal(union.cellId(0).toToken(), '89c25');
    assert.ok(!union.isEmpty());
    assert.ok(union.containsCell(S2Cell.fromCellId(S2CellId.fromToken('89c25').child(3))));
    assert.ok(union.mayIntersect(S2Cell.fromCellId(S2CellId.fromToken('89c25'))));
    assert.ok(union.getRectBound().containsPoint(union.cellId(0).toPoint()));
    assert.ok(union.getCapBound().containsPoint(union.cellId(0).toPoint()));
    close(union.exactArea(), S2Cell.fromCellId(union.cellId(0)).exactArea(), 1e-15);
    assert.ok(union.approxArea() > 0);
    assert.equal(union.denormalized(union.cellId(0).level() + 1).size(), 4);
    assert.equal(S2CellUnion.copyFrom(union).size(), 1);

    const child = new S2CellUnion().initFromCellId(S2CellId.fromToken('89c25').child(0));
    const difference = new S2CellUnion();
    difference.getDifference(union, child);
    assert.equal(difference.size(), 3);
    const intersection = new S2CellUnion();
    intersection.getIntersectionCellUnion(union, child);
    assert.equal(intersection.size(), 1);
    const both = new S2CellUnion();
    both.getUnion(difference, child);
    assert.equal(both.size(), 1);
    assert.ok(union.intersects(child));
    assert.ok(union.contains(child));

    const range = new S2CellUnion();
    range.initFromBeginEnd(
        S2CellId.fromToken('89c25').rangeMin(), S2CellId.fromToken('89c25').rangeMax().next());
    assert.equal(range.cellId(0).toToken(), '89c25');
    const raw = new S2CellUnion();
    raw.initRawCellIds(cells);
    assert.equal(raw.size(), 2);
    assert.ok(raw.normalize());
    assert.equal(raw.size(), 1);
  },

  polygonOperations() {
    const center = S2LatLng.fromDegrees(0, 0).toPoint();
    const big = S2Polygon.fromLoopArray(S2Loop.makeRegularLoop(center, S1Angle.degrees(2), 32));
    const small = S2Polygon.fromLoopArray(S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 32));
    const ring = S2Polygon.fromLoopArray();
    assert.ok(ring.initToDifference(big, small));
    close(ring.getArea(), big.getArea() - small.getArea(), 1e-12);
    assert.equal(ring.numLoops(), 2);
    assert.equal(ring.numVertices(), 64);
    assert.ok(!ring.containsPoint(center));
    assert.ok(ring.isValid());
    const symmetric = S2Polygon.fromLoopArray();
    assert.ok(symmetric.initToSymmetricDifference(big, small));
    close(symmetric.getArea(), ring.getArea(), 1e-12);
    const complement = S2Polygon.fromLoopArray();
    complement.initToComplement(big);
    close(complement.getArea(), 4 * Math.PI - big.getArea(), 1e-9);
    const simplified = S2Polygon.fromLoopArray();
    simplified.initToSimplified(big, S1Angle.degrees(0.5), false);
    assert.ok(simplified.numVertices() < big.numVertices());
    assert.ok(big.getCentroid().dotProd(center) > 0);
    close(small.getDistance(S2LatLng.fromDegrees(0, 3).toPoint()).degrees(), 2, 1e-3);
    // The loop's edges are chords, so its boundary is a little inside the 1 degree circle
    close(small.getDistanceToBoundary(center).degrees(), 1, 1e-2);
    assert.ok(small.project(S2LatLng.fromDegrees(0, 3).toPoint()).dotProd(center) > 0);
    assert.ok(big.approxEquals(big, S1Angle.degrees(0.001)));
    assert.ok(!big.isEmpty() && !big.isFull());
    assert.ok(big.containsCell(S2Cell.fromCellId(S2CellId.fromPoint(center).parentAtLevel(10))));
    assert.ok(big.mayIntersect(S2Cell.fromFace(0)));
    assert.ok(big.getCapBound().containsPoint(center));
    close(S2Polygon.getIntersectionOverUnion(big, small), small.getArea() / big.getArea(), 1e-9);
    const polygons = ArrayList.create();
    polygons.add(big);
    polygons.add(small);
    close(S2Polygon.union(polygons).getArea(), big.getArea(), 1e-12);
    const cells = new S2CellUnion().initFromCellId(S2CellId.fromToken('89c25'));
    close(
        S2Polygon.fromCellUnionBorder(cells).getArea(),
        S2Cell.fromCellId(S2CellId.fromToken('89c25')).exactArea(),
        1e-12);

    const loop = S2Loop.makeRegularLoop(center, S1Angle.degrees(1), 16);
    assert.ok(loop.isValid() && loop.isNormalized());
    assert.ok(loop.containsPoint(center));
    assert.ok(loop.containsCell(S2Cell.fromCellId(S2CellId.fromPoint(center))));
    assert.ok(loop.mayIntersect(S2Cell.fromCellId(S2CellId.fromPoint(center))));
    assert.ok(loop.getRectBound().containsPoint(center));
    assert.ok(loop.getCapBound().containsPoint(center));
    assert.ok(loop.getCentroid().dotProd(center) > 0);
    close(loop.getDistance(S2LatLng.fromDegrees(0, 2).toPoint()).degrees(), 1, 1e-2);
    assert.ok(loop.contains(S2Loop.makeRegularLoop(center, S1Angle.degrees(0.5), 16)));
    assert.ok(!loop.isEmpty() && !loop.isFull());
    const area = loop.getArea();
    loop.invert();
    close(loop.getArea(), 4 * Math.PI - area, 1e-9);
    assert.ok(loop.normalize().isNormalized());
  },

  polylines() {
    const a = S2LatLng.fromDegrees(0, 0).toPoint();
    const b = S2LatLng.fromDegrees(0, 10).toPoint();
    const c = S2LatLng.fromDegrees(10, 10).toPoint();
    const line = new S2Polyline([a, b, c]);
    assert.equal(line.numVertices(), 3);
    assert.ok(line.vertex(1).equalsPoint(b));
    assert.equal(line.vertices().size(), 3);
    assert.ok(line.isValid());
    close(line.getArclengthAngle().degrees(), 20, 1e-9);
    close(S2LatLng.fromPoint(line.interpolate(0.25)).lngDegrees(), 5, 1e-9);
    close(line.uninterpolate(line.interpolate(0.75)), 0.75, 1e-9);
    const query = S2LatLng.fromDegrees(1, 5).toPoint();
    assert.equal(line.getNearestEdgeIndex(query), 0);
    close(S2LatLng.fromPoint(line.project(query)).latDegrees(), 0, 1e-9);
    assert.ok(line.reversed().vertex(0).equalsPoint(c));
    assert.ok(line.intersects(new S2Polyline([
      S2LatLng.fromDegrees(-1, 5).toPoint(),
      S2LatLng.fromDegrees(1, 5).toPoint(),
    ])));
    assert.equal(line.subsampleVertices(S1Angle.degrees(1)).numVertices(), 3);
    assert.ok(line.getRectBound().containsPoint(b));
    assert.ok(line.getCapBound().containsPoint(b));
    assert.ok(line.mayIntersect(S2Cell.fromCellId(S2CellId.fromPoint(b))));
    assert.ok(!line.containsCell(S2Cell.fromCellId(S2CellId.fromPoint(b))));
    assert.ok(!line.containsPoint(b));
  },
};

let failed = 0;
for (const [name, test] of Object.entries(tests)) {
  try {
    test();
    console.log(`ok   ${name}`);
  } catch (e) {
    failed += 1;
    console.log(`FAIL ${name}\n${e.stack}`);
  }
}
process.exit(failed > 0 ? 1 : 0);
