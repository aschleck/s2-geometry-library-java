/**
 * @fileoverview Chooses what the npm package exposes from the J2CL-compiled library.
 *
 * Every class goes onto $s2exports, which the output wrapper in BUILD.bazel turns into named ES
 * module exports. Static members have to be exported here because ADVANCED compilation collapses
 * them off of their classes. Instance members instead keep their names through externs.js.
 *
 * Wherever possible this exposes the JS API upstream already declares with JsInterop annotations.
 * The few factories below exist only because upstream hides every constructor of their classes
 * from JS, and they call the constructors J2CL generates directly.
 */
goog.module('s2.npm.exports');

const ArrayList = goog.require('java.util.ArrayList');
const Bytes = goog.require('com.google.common.geometry.PrimitiveArrays.Bytes');
const List = goog.requireType('java.util.List');
const Long = goog.require('nativebootstrap.Long');
const R1Interval = goog.require('com.google.common.geometry.R1Interval');
const S1Angle = goog.require('com.google.common.geometry.S1Angle');
const S1ChordAngle = goog.require('com.google.common.geometry.S1ChordAngle');
const S1Interval = goog.require('com.google.common.geometry.S1Interval');
const S2Cap = goog.require('com.google.common.geometry.S2Cap');
const S2Cell = goog.require('com.google.common.geometry.S2Cell');
const S2CellId = goog.require('com.google.common.geometry.S2CellId');
const S2CellUnion = goog.require('com.google.common.geometry.S2CellUnion');
const S2Earth = goog.require('com.google.common.geometry.S2Earth');
const S2LatLng = goog.require('com.google.common.geometry.S2LatLng');
const S2LatLngRect = goog.require('com.google.common.geometry.S2LatLngRect');
const S2Loop = goog.require('com.google.common.geometry.S2Loop');
const S2Point = goog.require('com.google.common.geometry.S2Point');
const S2Polygon = goog.require('com.google.common.geometry.S2Polygon');
const S2Polyline = goog.require('com.google.common.geometry.S2Polyline');
const S2RegionCoverer = goog.require('com.google.common.geometry.S2RegionCoverer');

/**
 * @param {string} name
 * @param {!Object} value
 */
function exportClass(name, value) {
  $s2exports[name] = value;
}

exportClass('ArrayList', ArrayList);
goog.exportProperty(ArrayList, 'create', () => ArrayList.$create__());

exportClass('Bytes', Bytes);
goog.exportProperty(Bytes, 'fromByteArray', Bytes.fromByteArray);

exportClass('Long', Long);
goog.exportProperty(Long, 'fromBits', Long.fromBits);
goog.exportProperty(Long, 'fromInt', Long.fromInt);
goog.exportProperty(Long, 'fromNumber', Long.fromNumber);
goog.exportProperty(Long, 'fromString', Long.fromString);

exportClass('R1Interval', R1Interval);
goog.exportProperty(R1Interval, 'empty', R1Interval.empty);
goog.exportProperty(R1Interval, 'fromPointPair', R1Interval.fromPointPair);
goog.exportProperty(R1Interval, 'fromPoint', R1Interval.fromPoint);

exportClass('S1Angle', S1Angle);
goog.exportProperty(S1Angle, 'degrees', S1Angle.degrees);
goog.exportProperty(S1Angle, 'e7', S1Angle.e7);
goog.exportProperty(S1Angle, 'radians', S1Angle.radians);
goog.exportProperty(S1Angle, 'INFINITY', S1Angle.INFINITY);
goog.exportProperty(S1Angle, 'ZERO', S1Angle.ZERO);
goog.exportProperty(S1Angle, 'e5', S1Angle.e5);
goog.exportProperty(S1Angle, 'e6', S1Angle.e6);
goog.exportProperty(S1Angle, 'max', S1Angle.max);
goog.exportProperty(S1Angle, 'min', S1Angle.min);

exportClass('S1ChordAngle', S1ChordAngle);
goog.exportProperty(S1ChordAngle, 'INFINITY', S1ChordAngle.INFINITY);
goog.exportProperty(S1ChordAngle, 'NEGATIVE', S1ChordAngle.NEGATIVE);
goog.exportProperty(S1ChordAngle, 'RIGHT', S1ChordAngle.RIGHT);
goog.exportProperty(S1ChordAngle, 'STRAIGHT', S1ChordAngle.STRAIGHT);
goog.exportProperty(S1ChordAngle, 'ZERO', S1ChordAngle.ZERO);
goog.exportProperty(S1ChordAngle, 'add', S1ChordAngle.add);
goog.exportProperty(S1ChordAngle, 'cos', S1ChordAngle.cos);
goog.exportProperty(S1ChordAngle, 'fromDegrees', S1ChordAngle.fromDegrees);
goog.exportProperty(S1ChordAngle, 'fromE5', S1ChordAngle.fromE5);
goog.exportProperty(S1ChordAngle, 'fromE6', S1ChordAngle.fromE6);
goog.exportProperty(S1ChordAngle, 'fromE7', S1ChordAngle.fromE7);
goog.exportProperty(S1ChordAngle, 'fromLength2', S1ChordAngle.fromLength2);
goog.exportProperty(S1ChordAngle, 'fromRadians', S1ChordAngle.fromRadians);
goog.exportProperty(S1ChordAngle, 'fromS1Angle', S1ChordAngle.fromS1Angle);
goog.exportProperty(S1ChordAngle, 'max', S1ChordAngle.max);
goog.exportProperty(S1ChordAngle, 'min', S1ChordAngle.min);
goog.exportProperty(S1ChordAngle, 'sin', S1ChordAngle.sin);
goog.exportProperty(S1ChordAngle, 'sin2', S1ChordAngle.sin2);
goog.exportProperty(S1ChordAngle, 'sub', S1ChordAngle.sub);
goog.exportProperty(S1ChordAngle, 'tan', S1ChordAngle.tan);
// Java's S1ChordAngle(S2Point, S2Point)
goog.exportProperty(
    S1ChordAngle,
    'fromPoints',
    (/** !S2Point */ x, /** !S2Point */ y) =>
        S1ChordAngle
            .$create__com_google_common_geometry_S2Point__com_google_common_geometry_S2Point(x, y));

exportClass('S1Interval', S1Interval);
goog.exportProperty(S1Interval, 'empty', S1Interval.empty);
goog.exportProperty(S1Interval, 'fromPointPair', S1Interval.fromPointPair);
goog.exportProperty(S1Interval, 'full', S1Interval.full);
goog.exportProperty(S1Interval, 'fromPoint', S1Interval.fromPoint);
goog.exportProperty(S1Interval, 'positiveDistance', S1Interval.positiveDistance);

exportClass('S2Cap', S2Cap);
goog.exportProperty(S2Cap, 'empty', S2Cap.empty);
goog.exportProperty(S2Cap, 'fromAxisAngle', S2Cap.fromAxisAngle);
goog.exportProperty(S2Cap, 'fromAxisArea', S2Cap.fromAxisArea);
goog.exportProperty(S2Cap, 'fromAxisChord', S2Cap.fromAxisChord);
goog.exportProperty(S2Cap, 'fromAxisHeight', S2Cap.fromAxisHeight);
goog.exportProperty(S2Cap, 'full', S2Cap.full);
goog.exportProperty(S2Cap, 'CODER', S2Cap.CODER);

exportClass('S2Cell', S2Cell);
goog.exportProperty(S2Cell, 'averageAreaAtLevel', S2Cell.averageAreaAtLevel);
goog.exportProperty(S2Cell, 'fromFace', S2Cell.fromFace);
// Java's S2Cell(S2CellId)
goog.exportProperty(
    S2Cell,
    'fromCellId',
    (/** !S2CellId */ id) => S2Cell.$create__com_google_common_geometry_S2CellId(id));
goog.exportProperty(S2Cell, 'fromFacePosLevel', S2Cell.fromFacePosLevel);

exportClass('S2CellId', S2CellId);
goog.exportProperty(S2CellId, 'MAX_LEVEL', S2CellId.MAX_LEVEL);
goog.exportProperty(S2CellId, 'NUM_FACES', S2CellId.NUM_FACES);
goog.exportProperty(S2CellId, 'begin', S2CellId.begin);
goog.exportProperty(S2CellId, 'end', S2CellId.end);
goog.exportProperty(S2CellId, 'fromFace', S2CellId.fromFace);
goog.exportProperty(S2CellId, 'fromFacePosLevel', S2CellId.fromFacePosLevel);
goog.exportProperty(S2CellId, 'fromLatLng', S2CellId.fromLatLng);
goog.exportProperty(S2CellId, 'fromPoint', S2CellId.fromPoint);
goog.exportProperty(S2CellId, 'fromToken', S2CellId.fromToken);
goog.exportProperty(S2CellId, 'isValidToken', S2CellId.isValidToken);
goog.exportProperty(S2CellId, 'none', S2CellId.none);
goog.exportProperty(S2CellId, 'CODER', S2CellId.CODER);
goog.exportProperty(S2CellId, 'FACE_CELLS', S2CellId.FACE_CELLS);
goog.exportProperty(S2CellId, 'TOKEN_CODER', S2CellId.TOKEN_CODER);
goog.exportProperty(S2CellId, 'fromFaceIJ', S2CellId.fromFaceIJ);
goog.exportProperty(S2CellId, 'getSizeIJ', S2CellId.getSizeIJ);
goog.exportProperty(S2CellId, 'getSizeST', S2CellId.getSizeST);
goog.exportProperty(S2CellId, 'isValidOrNoneToken', S2CellId.isValidOrNoneToken);
goog.exportProperty(S2CellId, 'lowestOnBitForLevel', S2CellId.lowestOnBitForLevel);
goog.exportProperty(S2CellId, 'sentinel', S2CellId.sentinel);

exportClass('S2CellUnion', S2CellUnion);
goog.exportProperty(S2CellUnion, 'COMPACT_CODER', S2CellUnion.COMPACT_CODER);
goog.exportProperty(S2CellUnion, 'FAST_CODER', S2CellUnion.FAST_CODER);
goog.exportProperty(S2CellUnion, 'copyFrom', S2CellUnion.copyFrom);
goog.exportProperty(S2CellUnion, 'intersection', S2CellUnion.intersection);
goog.exportProperty(S2CellUnion, 'union', S2CellUnion.union);
goog.exportProperty(S2CellUnion, 'wholeSphere', S2CellUnion.wholeSphere);

exportClass('S2Earth', S2Earth);
goog.exportProperty(
    S2Earth, 'getDistanceBetweenLatLngsKm', S2Earth.getDistanceBetweenLatLngsKm);
goog.exportProperty(
    S2Earth, 'getDistanceBetweenLatLngsMeters', S2Earth.getDistanceBetweenLatLngsMeters);
goog.exportProperty(S2Earth, 'getDistanceBetweenPointsKm', S2Earth.getDistanceBetweenPointsKm);
goog.exportProperty(
    S2Earth, 'getDistanceBetweenPointsMeters', S2Earth.getDistanceBetweenPointsMeters);
goog.exportProperty(S2Earth, 'getInitialBearing', S2Earth.getInitialBearing);
goog.exportProperty(S2Earth, 'getRadiusKm', S2Earth.getRadiusKm);
goog.exportProperty(S2Earth, 'getRadiusMeters', S2Earth.getRadiusMeters);
goog.exportProperty(S2Earth, 'kmToRadians', S2Earth.kmToRadians);
goog.exportProperty(S2Earth, 'metersToRadians', S2Earth.metersToRadians);
goog.exportProperty(S2Earth, 'radiansToKm', S2Earth.radiansToKm);
goog.exportProperty(S2Earth, 'radiansToMeters', S2Earth.radiansToMeters);
goog.exportProperty(S2Earth, 'squareMetersToSteradians', S2Earth.squareMetersToSteradians);
goog.exportProperty(S2Earth, 'steradiansToSquareMeters', S2Earth.steradiansToSquareMeters);
goog.exportProperty(S2Earth, 'toKm', S2Earth.toKm);
goog.exportProperty(S2Earth, 'toMeters', S2Earth.toMeters);
goog.exportProperty(S2Earth, 'haversine', S2Earth.haversine);
goog.exportProperty(S2Earth, 'squareKmToSteradians', S2Earth.squareKmToSteradians);
goog.exportProperty(S2Earth, 'steradiansToSquareKm', S2Earth.steradiansToSquareKm);

exportClass('S2LatLng', S2LatLng);
goog.exportProperty(S2LatLng, 'CENTER', S2LatLng.CENTER);
goog.exportProperty(S2LatLng, 'fromDegrees', S2LatLng.fromDegrees);
goog.exportProperty(S2LatLng, 'fromE5', S2LatLng.fromE5);
goog.exportProperty(S2LatLng, 'fromE6', S2LatLng.fromE6);
goog.exportProperty(S2LatLng, 'fromE7', S2LatLng.fromE7);
goog.exportProperty(S2LatLng, 'fromPoint', S2LatLng.fromPoint);
goog.exportProperty(S2LatLng, 'fromRadians', S2LatLng.fromRadians);
goog.exportProperty(S2LatLng, 'CODER', S2LatLng.CODER);
goog.exportProperty(S2LatLng, 'isValid', S2LatLng.isValid);
goog.exportProperty(S2LatLng, 'latitude', S2LatLng.latitude);
goog.exportProperty(S2LatLng, 'longitude', S2LatLng.longitude);

exportClass('S2LatLngRect', S2LatLngRect);
goog.exportProperty(S2LatLngRect, 'empty', S2LatLngRect.empty);
goog.exportProperty(S2LatLngRect, 'fromCenterSize', S2LatLngRect.fromCenterSize);
goog.exportProperty(S2LatLngRect, 'fromPoint', S2LatLngRect.fromPoint);
goog.exportProperty(S2LatLngRect, 'fromPointPair', S2LatLngRect.fromPointPair);
goog.exportProperty(S2LatLngRect, 'full', S2LatLngRect.full);
goog.exportProperty(S2LatLngRect, 'fullLat', S2LatLngRect.fullLat);
goog.exportProperty(S2LatLngRect, 'fullLng', S2LatLngRect.fullLng);
// Java's S2LatLngRect(R1Interval, S1Interval)
goog.exportProperty(
    S2LatLngRect,
    'fromIntervals',
    (/** !R1Interval */ lat, /** !S1Interval */ lng) =>
        S2LatLngRect
            .$create__com_google_common_geometry_R1Interval__com_google_common_geometry_S1Interval(
                lat, lng));
goog.exportProperty(S2LatLngRect, 'CODER', S2LatLngRect.CODER);
goog.exportProperty(S2LatLngRect, 'intersectsLatEdge', S2LatLngRect.intersectsLatEdge);
goog.exportProperty(S2LatLngRect, 'intersectsLngEdge', S2LatLngRect.intersectsLngEdge);
goog.exportProperty(S2LatLngRect, 'isValidIntervals', S2LatLngRect.isValidIntervals);
goog.exportProperty(S2LatLngRect, 'isValidLoHi', S2LatLngRect.isValidLoHi);

exportClass('S2Loop', S2Loop);
goog.exportProperty(S2Loop, 'empty', S2Loop.empty);
goog.exportProperty(S2Loop, 'full', S2Loop.full);
goog.exportProperty(S2Loop, 'makeRegularLoop', S2Loop.makeRegularLoop);
// Java's S2Loop(List<S2Point>)
goog.exportProperty(
    S2Loop,
    'fromVertices',
    (/** List<S2Point> */ vertices) => S2Loop.$create__java_util_List(vertices));
goog.exportProperty(S2Loop, 'makeRegularVertices', S2Loop.makeRegularVertices);

exportClass('S2Point', S2Point);
goog.exportProperty(S2Point, 'CODER', S2Point.CODER);
goog.exportProperty(S2Point, 'X_NEG', S2Point.X_NEG);
goog.exportProperty(S2Point, 'X_POS', S2Point.X_POS);
goog.exportProperty(S2Point, 'Y_NEG', S2Point.Y_NEG);
goog.exportProperty(S2Point, 'Y_POS', S2Point.Y_POS);
goog.exportProperty(S2Point, 'ZERO', S2Point.ZERO);
goog.exportProperty(S2Point, 'Z_NEG', S2Point.Z_NEG);
goog.exportProperty(S2Point, 'Z_POS', S2Point.Z_POS);
goog.exportProperty(S2Point, 'minus', S2Point.minus);
goog.exportProperty(S2Point, 'rotate', S2Point.rotate);
goog.exportProperty(S2Point, 'scalarTripleProduct', S2Point.scalarTripleProduct);

exportClass('S2Polygon', S2Polygon);
goog.exportProperty(S2Polygon, 'COMPACT_CODER', S2Polygon.COMPACT_CODER);
goog.exportProperty(S2Polygon, 'FAST_CODER', S2Polygon.FAST_CODER);
goog.exportProperty(S2Polygon, 'fromLoopArray', S2Polygon.fromLoopArray);
goog.exportProperty(S2Polygon, 'fromCellUnionBorder', S2Polygon.fromCellUnionBorder);
goog.exportProperty(S2Polygon, 'fromLoops', S2Polygon.fromLoops);
goog.exportProperty(S2Polygon, 'getIntersectionOverUnion', S2Polygon.getIntersectionOverUnion);
goog.exportProperty(S2Polygon, 'union', S2Polygon.union);
goog.exportProperty(S2Polygon, 'getOverlapFraction', S2Polygon.getOverlapFraction);

exportClass('S2Polyline', S2Polyline);
goog.exportProperty(S2Polyline, 'COMPACT_CODER', S2Polyline.COMPACT_CODER);
goog.exportProperty(S2Polyline, 'FAST_CODER', S2Polyline.FAST_CODER);
goog.exportProperty(S2Polyline, 'deduplicatePoints', S2Polyline.deduplicatePoints);
goog.exportProperty(S2Polyline, 'fromSnapped', S2Polyline.fromSnapped);

exportClass('S2RegionCoverer', S2RegionCoverer);
goog.exportProperty(S2RegionCoverer, 'builder', S2RegionCoverer.builder);
goog.exportProperty(S2RegionCoverer, 'getSimpleCovering', S2RegionCoverer.getSimpleCovering);
goog.exportProperty(S2RegionCoverer, 'DEFAULT', S2RegionCoverer.DEFAULT);
