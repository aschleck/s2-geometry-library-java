# Examples

Small scripts that use [@aschleck/s2-geometry-java](https://www.npmjs.com/package/@aschleck/s2-geometry-java)
from npm. They're TypeScript that Node runs directly, which needs Node 22.18 or newer.

```sh
npm install
npm run cells       # or covering, polygons, trails, encoding
npm run all
npm run typecheck
```

- [cells.ts](cells.ts): finding the cell for a location, parents, children, neighbors and tokens
- [covering.ts](covering.ts): covering a radius or a map viewport with cells, and cell set operations
- [polygons.ts](polygons.ts): building polygons from coordinates, areas, containment and boolean
  operations
- [trails.ts](trails.ts): polyline lengths, snapping a point onto a path, and clipping a path to a
  polygon
- [encoding.ts](encoding.ts): encoding and decoding in the Java library's binary format
- [lists.ts](lists.ts): converting between JavaScript arrays and the Java lists the library uses
