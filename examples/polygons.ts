// Polygons: building them from coordinates, measuring them, and combining them.

import {S1Angle, S2Earth, S2LatLng, S2Loop, S2Polygon} from '@aschleck/s2-geometry-java';
import {toArrayList} from './lists.ts';

/** Builds a polygon from [lat, lng] pairs in degrees, listed counter-clockwise. */
function polygon(coordinates: Array<[number, number]>): S2Polygon {
  const vertices = coordinates.map(([lat, lng]) => S2LatLng.fromDegrees(lat, lng).toPoint());
  return S2Polygon.fromLoopArray(S2Loop.fromVertices(toArrayList(vertices)));
}

function squareKm(p: S2Polygon): string {
  return S2Earth.steradiansToSquareKm(p.getArea()).toFixed(2);
}

// Roughly Seattle's Discovery Park and a box overlapping its southern half
const park = polygon([
  [47.6545, -122.4265],
  [47.6545, -122.3990],
  [47.6700, -122.3990],
  [47.6700, -122.4265],
]);
const box = polygon([
  [47.6480, -122.4200],
  [47.6480, -122.4050],
  [47.6600, -122.4050],
  [47.6600, -122.4200],
]);
console.log(`park is ${squareKm(park)} km², box is ${squareKm(box)} km²`);

const lighthouse = S2LatLng.fromDegrees(47.6619, -122.4357);
const visitorCenter = S2LatLng.fromDegrees(47.6576, -122.4056);
console.log(`the visitor center is in the park: ${park.containsPoint(visitorCenter.toPoint())}`);
console.log(`the lighthouse is in the park: ${park.containsPoint(lighthouse.toPoint())}`);

// How far outside the park the lighthouse is
const distance = park.getDistance(lighthouse.toPoint());
console.log(`the lighthouse is ${S2Earth.toMeters(distance).toFixed(0)} m outside it`);

// Boolean operations fill in an empty polygon, which fromLoopArray() makes
const union = S2Polygon.fromLoopArray();
union.initToUnion(park, box);
const intersection = S2Polygon.fromLoopArray();
intersection.initToIntersection(park, box);
const difference = S2Polygon.fromLoopArray();
difference.initToDifference(park, box);
console.log(`union ${squareKm(union)} km², intersection ${squareKm(intersection)} km², ` +
    `park without the box ${squareKm(difference)} km²`);

// A circle around a point, approximated with a regular polygon
const circle = S2Polygon.fromLoopArray(
    S2Loop.makeRegularLoop(
        visitorCenter.toPoint(), S1Angle.radians(S2Earth.metersToRadians(500)), 64));
console.log(`a 500 m circle is ${squareKm(circle)} km² (π × 0.5² ≈ 0.79)`);

// Bounds and centroids
const bound = park.getRectBound();
console.log(`park bounds: ${bound.lo().toStringDegrees()} to ${bound.hi().toStringDegrees()}`);
console.log(`park centroid: ${S2LatLng.fromPoint(park.getCentroid().normalize()).toStringDegrees()}`);
