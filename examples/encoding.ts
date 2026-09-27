// Encoding: storing and sending S2 objects in the same binary format as the Java library.

import {Bytes, S2CellId, S2CellUnion, S2LatLng, S2Loop, S2Polygon} from '@aschleck/s2-geometry-java';
import {toArrayList} from './lists.ts';

const polygon = S2Polygon.fromLoopArray(S2Loop.fromVertices(toArrayList([
  S2LatLng.fromDegrees(47.0, -122.0).toPoint(),
  S2LatLng.fromDegrees(47.0, -121.0).toPoint(),
  S2LatLng.fromDegrees(48.0, -121.0).toPoint(),
  S2LatLng.fromDegrees(48.0, -122.0).toPoint(),
])));

// unsafeEncode returns Java bytes, which are signed, so wrap them in an Int8Array
const encoded = Int8Array.from(S2Polygon.COMPACT_CODER.unsafeEncode(polygon));
const base64 = Buffer.from(encoded.buffer).toString('base64');
console.log(`encoded polygon: ${encoded.length} bytes, ${base64.slice(0, 32)}...`);

// Decoding takes signed or unsigned bytes, such as a Uint8Array from fetch() or a file. This is
// also how to read polygons that a Java server encoded with S2Polygon#encode.
const bytes = Uint8Array.from(Buffer.from(base64, 'base64'));
const decoded = S2Polygon.COMPACT_CODER.unsafeDecode(Bytes.fromByteArray(bytes));
console.log(`decoded it back: ${decoded.equalsPolygon(polygon)}`);

// Cell unions, cell ids, points and the other classes all have coders too
const cells = new S2CellUnion().initFromCellIds(toArrayList([
  S2CellId.fromToken('54906b'),
  S2CellId.fromToken('549015'),
]));
const encodedCells = S2CellUnion.FAST_CODER.unsafeEncode(cells);
const decodedCells = S2CellUnion.FAST_CODER.unsafeDecode(Bytes.fromByteArray(encodedCells));
console.log(`cell union in ${encodedCells.length} bytes, decoded equal: ${decodedCells.equals(cells)}`);

const token = S2CellId.TOKEN_CODER.unsafeEncode(S2CellId.fromToken('54906b'));
console.log(`the token coder writes ASCII: ${Buffer.from(Int8Array.from(token)).toString()}`);
