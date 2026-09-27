// Cell ids: finding the cell for a location, moving around the hierarchy, and naming cells.

import {S2Cell, S2CellId, S2Earth, S2LatLng} from '@aschleck/s2-geometry-java';
import {toArray} from './lists.ts';

const spaceNeedle = S2LatLng.fromDegrees(47.6205, -122.3493);

// fromLatLng gives the leaf cell (level 30, about 1 cm across) containing the point
const leaf = S2CellId.fromLatLng(spaceNeedle);
console.log(`leaf cell ${leaf.toToken()} is at level ${leaf.level()}`);

// Coarser cells contain it. Tokens are the compact way to store and send cell ids.
for (const level of [4, 8, 12, 16]) {
  const cell = leaf.parentAtLevel(level);
  const area = S2Earth.steradiansToSquareKm(S2Cell.fromCellId(cell).exactArea());
  console.log(`level ${level}: ${cell.toToken()} covers ${area.toFixed(3)} km²`);
}

// Tokens round trip, and a parent contains all of its descendants
const neighborhood = S2CellId.fromToken(leaf.parentAtLevel(12).toToken());
console.log(`level 12 cell contains the leaf: ${neighborhood.contains(leaf)}`);

// Every cell has four children, one level down
const children = [0, 1, 2, 3].map(i => neighborhood.child(i).toToken());
console.log(`children of ${neighborhood.toToken()}: ${children.join(', ')}`);

// Neighbors across each edge, and all eight around the cell
const edges = new Array<S2CellId>(4);
neighborhood.getEdgeNeighbors(edges);
console.log(`edge neighbors: ${edges.map(c => c.toToken()).join(', ')}`);

// Cell ids are 64 bit, which JavaScript numbers can't hold, so they come back as Long objects
const id = neighborhood.id();
console.log(`as a 64 bit id: ${id.toString()} (hex ${id.toString(16)})`);
console.log(`center: ${neighborhood.toLatLng().toStringDegrees()}`);

const cell = S2Cell.fromCellId(neighborhood);
const corners = [0, 1, 2, 3].map(k => S2LatLng.fromPoint(cell.getVertex(k)).toStringDegrees());
console.log(`corners: ${corners.join(' ')}`);
console.log(`vertices of its boundary loop: ${toArray(neighborhood.toLoop(12).vertices()).length}`);
