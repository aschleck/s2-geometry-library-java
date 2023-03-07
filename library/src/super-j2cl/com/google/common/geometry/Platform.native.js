Platform.IEEEremainder = function(f1, f2) {
  // f1 - f2 * round_towards_even(f1 / f2)
  const div = f1 / f2;
  let rounded;
  const remainder = div % 1;
  if (remainder === 0.5 || remainder === -0.5) {
    const fn = div < 0 ? Math.ceil : Math.floor;
    rounded = fn(div) + fn(div % 2);
  } else {
    rounded = Math.round(div);
  }
  return f1 - (f2 * rounded)
}

// https://stackoverflow.com/questions/9383593/extracting-the-exponent-and-mantissa-of-a-javascript-number
const gE_float = new Float64Array(1);
const gE_view = new DataView(gE_float.buffer);
Platform.getExponent = function(d) {
  if (d === 0) {
    return -Infinity;
  }
  gE_view.setFloat64(0, d, /* littleEndian= */ true);
  return ((gE_view.getUint8(7) & 0x7f) << 4 | gE_view.getUint8(6) >> 4) - 0x3ff;
};

Platform.printf = function(stream, format, params) {
  stream.printf(format);
  stream.printf(params);
};

Platform.formatString = function(format, ...params) {
  return `$format: ${params.join(' ')}`;
};

Platform.formatDouble = function(d) {
  return String(d);
};

Platform.ulp = function(x) {
  const trunc = Math.abs(Math.fround(x));
  return Platform.nextAfter(trunc, 1) - trunc;
}

const nA_float = new Float64Array(1);
const nA_view = new DataView(nA_float.buffer);
const ONE = BigInt(1);
const NEGATIVE_ONE = BigInt(-1);

Platform.nextAfter = function(x, dir) {
  nA_view.setFloat64(0, x, true);
  if (dir < 0) {
    nA_view.setBigUint64(0, nA_view.getBigUint64(0, true) + NEGATIVE_ONE, true);
  } else {
    nA_view.setBigUint64(0, nA_view.getBigUint64(0, true) + ONE, true);
  }
  return nA_view.getFloat64(0, true);
};
