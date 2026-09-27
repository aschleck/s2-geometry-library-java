// Polylines: measuring a path, snapping a point onto it, and clipping it to a polygon.

import {S1Angle, S2Earth, S2LatLng, S2Loop, S2Polygon, S2Polyline} from '@aschleck/s2-geometry-java';
import {toArray, toArrayList} from './lists.ts';

function toPoints(coordinates: Array<[number, number]>) {
  return coordinates.map(([lat, lng]) => S2LatLng.fromDegrees(lat, lng).toPoint());
}

function km(line: S2Polyline): string {
  return S2Earth.toKm(line.getArclengthAngle()).toFixed(2);
}

// A trail, as [lat, lng] pairs in degrees. S2Polyline takes a JavaScript array.
const trail = new S2Polyline(toPoints([
  [47.6560, -122.4150],
  [47.6575, -122.4126],
  [47.6590, -122.4100],
  [47.6620, -122.4080],
  [47.6636, -122.4052],
  [47.6650, -122.4020],
  [47.6676, -122.3991],
  [47.6700, -122.3960],
]));
console.log(`the trail is ${km(trail)} km long`);

// The point halfway along it
const midpoint = S2LatLng.fromPoint(trail.interpolate(0.5));
console.log(`halfway is at ${midpoint.toStringDegrees()}`);

// Snapping a GPS fix onto the trail, and how far along the trail it is
const gps = S2LatLng.fromDegrees(47.6637, -122.4050);
const snapped = trail.project(gps.toPoint());
const offTrail = S2Earth.getDistanceBetweenPointsMeters(gps.toPoint(), snapped);
const fraction = trail.uninterpolate(snapped);
console.log(`a GPS fix ${offTrail.toFixed(1)} m off the trail is ${(fraction * 100).toFixed(0)}% ` +
    `of the way along it`);

// Clipping the trail to a boundary, such as to find the part inside a park
const park = S2Polygon.fromLoopArray(S2Loop.fromVertices(toArrayList(toPoints([
  [47.6545, -122.4265],
  [47.6545, -122.3990],
  [47.6680, -122.3990],
  [47.6680, -122.4265],
]))));
console.log(`the trail stays in the park: ${park.containsPolyline(trail)}`);
const inside = toArray(park.intersectWithPolyline(trail));
const outside = toArray(park.subtractFromPolyline(trail));
console.log(`inside the park: ${inside.map(km).join(' + ')} km`);
console.log(`outside the park: ${outside.map(km).join(' + ')} km`);

// Simplifying drops vertices that are within a tolerance of the line
const simplified = trail.subsampleVertices(S1Angle.radians(S2Earth.metersToRadians(50)));
console.log(`simplified to 50 m: ${trail.numVertices()} vertices down to ${simplified.numVertices()}`);
