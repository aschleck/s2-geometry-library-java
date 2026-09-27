// Coverings: approximating a region with cells, such as to index it or query a database by cell.

import {
  S1Angle,
  S2Cap,
  S2CellId,
  S2CellUnion,
  S2Earth,
  S2LatLng,
  S2LatLngRect,
  S2RegionCoverer,
} from '@aschleck/s2-geometry-java';
import {toArray} from './lists.ts';

// Everything within 2 km of a point is a cap, a disc on the sphere
const center = S2LatLng.fromDegrees(47.6205, -122.3493);
const radius = S1Angle.radians(S2Earth.metersToRadians(2000));
const cap = S2Cap.fromAxisAngle(center.toPoint(), radius);

// The coverer trades off how many cells to use against how tightly they fit
const coverer = S2RegionCoverer.builder().setMinLevel(10).setMaxLevel(16).setMaxCells(8).build();
const covering = coverer.getCovering(cap);
console.log(`2 km around the Space Needle in ${covering.size()} cells:`);
for (const id of toArray(covering.cellIds())) {
  console.log(`  ${id.toToken()} (level ${id.level()})`);
}

// Checking a point against the covering is a fast, conservative test for being near the center
const pikePlace = S2LatLng.fromDegrees(47.6097, -122.3422);
console.log(`Pike Place is covered: ${covering.containsPoint(pikePlace.toPoint())}`);
console.log(`and within 2 km: ${cap.containsPoint(pikePlace.toPoint())}`);
const meters = S2Earth.getDistanceBetweenLatLngsMeters(center, pikePlace);
console.log(`at ${meters.toFixed(0)} m away`);

// The interior covering only has cells that are entirely inside the region
const interior = coverer.getInteriorCovering(cap);
console.log(`interior covering: ${interior.size()} cells`);

// Coverings of rectangles work the same way, such as for a map's viewport
const viewport = S2LatLngRect.fromPointPair(
    S2LatLng.fromDegrees(47.60, -122.36), S2LatLng.fromDegrees(47.63, -122.32));
const tiles = S2RegionCoverer.builder().setMinLevel(13).setMaxLevel(13).setMaxCells(100).build();
console.log(`viewport needs ${tiles.getCovering(viewport).size()} level 13 cells`);

// Cell unions support set operations. They merge cells into their parents where they can, so
// compare them by area rather than by how many cells they have.
const union = S2CellUnion.union(covering, tiles.getCovering(viewport));
const intersection = S2CellUnion.intersection(covering, tiles.getCovering(viewport));
const km2 = (cells: S2CellUnion) => S2Earth.steradiansToSquareKm(cells.exactArea()).toFixed(1);
console.log(`the union covers ${km2(union)} km², the intersection ${km2(intersection)} km²`);
const leaf = S2CellId.fromLatLng(pikePlace);
console.log(`the intersection contains Pike Place: ${intersection.containsCellId(leaf)}`);
