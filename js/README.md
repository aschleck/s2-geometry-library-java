# @aschleck/s2-geometry-java

[Google's S2 Geometry library for Java](https://github.com/google/s2-geometry-library-java),
compiled to JavaScript with [J2CL](https://github.com/google/j2cl).

This is an unofficial build and is not affiliated with or endorsed by Google.

```ts
import {S2CellId, S2LatLng} from '@aschleck/s2-geometry-java';

const cell = S2CellId.fromLatLng(S2LatLng.fromDegrees(47.6, -122.3)).parentAtLevel(10);
console.log(cell.toToken());
```

## What's exposed

Only part of the library is exported, listed in `index.d.ts`. Names and behavior follow the Java
API, with a few differences that come from running Java in JavaScript:

- Java `long` values are `Long` objects (Closure's `goog.math.Long`), for example
  `S2CellId#id()`. Tokens (`toToken`, `fromToken`) are usually easier to work with.
- Java collections stay Java collections: lists are `List`/`ArrayList`, read with `getAtIndex`
  and `size`, and created with `ArrayList.create()`.
- Overloaded methods take the JavaScript names that upstream assigns them, such as
  `S2Polygon.fromLoopArray(...loops)` and `S2RegionCoverer#getCoveringCellUnion`.
- Where upstream exposes no constructor to JavaScript, there is a factory named after it:
  `S1ChordAngle.fromPoints`, `S2Cell.fromCellId`, `S2Loop.fromVertices` and
  `S2LatLngRect.fromIntervals`.

The documentation in `index.d.ts` is the Java library's javadoc.

Encoding and decoding work through each class's `S2Coder`, and produce the same bytes as Java:

```ts
import {Bytes, S2Polygon} from '@aschleck/s2-geometry-java';

const polygon = S2Polygon.FAST_CODER.unsafeDecode(Bytes.fromByteArray(new Uint8Array(buffer)));
const encoded = Int8Array.from(S2Polygon.COMPACT_CODER.unsafeEncode(polygon));
```

## License

Apache 2.0. The build adds J2CL platform shims and a reimplementation of the fastutil classes needed
by the S2 Java library.
