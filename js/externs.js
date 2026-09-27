/**
 * @fileoverview Keeps the names of the instance members the npm package exposes.
 *
 * ADVANCED compilation never renames or removes a property whose name appears in externs, on any
 * type. That matters for methods reached through interfaces, such as the List returned by
 * S2Polygon#getLoops and S2Coder#decode, since their implementations are anonymous classes that
 * exports.js has no way to name.
 *
 * Keep this in sync with index.d.ts. A name shared by several classes is listed only once, under
 * the first of them.
 *
 * @externs
 */

/**
 * Filled in by exports.js and read by the output wrapper in BUILD.bazel.
 * @type {!Object<string, *>}
 */
var $s2exports;

/** @record */
function S2PublicMembers() {}

// java.util.List
S2PublicMembers.prototype.add;
S2PublicMembers.prototype.getAtIndex;
S2PublicMembers.prototype.size;

// nativebootstrap.Long
S2PublicMembers.prototype.equals;
S2PublicMembers.prototype.getHighBits;
S2PublicMembers.prototype.getLowBits;
S2PublicMembers.prototype.toNumber;
S2PublicMembers.prototype.toString;

// PrimitiveArrays.Bytes
S2PublicMembers.prototype.cursor;
S2PublicMembers.prototype.length;

// S2Coder
S2PublicMembers.prototype.decode;
S2PublicMembers.prototype.isLazy;
S2PublicMembers.prototype.unsafeDecode;
S2PublicMembers.prototype.unsafeEncode;

// S2Region, which most of the classes below implement
S2PublicMembers.prototype.containsCell;
S2PublicMembers.prototype.containsPoint;
S2PublicMembers.prototype.getCapBound;
S2PublicMembers.prototype.getCellUnionBound;
S2PublicMembers.prototype.getRectBound;
S2PublicMembers.prototype.mayIntersect;

// R1Interval
S2PublicMembers.prototype.addPoint;
S2PublicMembers.prototype.approxEquals;
S2PublicMembers.prototype.approxEqualsWithMaxError;
S2PublicMembers.prototype.clampPoint;
S2PublicMembers.prototype.contains;
S2PublicMembers.prototype.expanded;
S2PublicMembers.prototype.getCenter;
S2PublicMembers.prototype.getDirectedHausdorffDistance;
S2PublicMembers.prototype.getLength;
S2PublicMembers.prototype.hi;
S2PublicMembers.prototype.interiorContains;
S2PublicMembers.prototype.interiorContainsPoint;
S2PublicMembers.prototype.interiorIntersects;
S2PublicMembers.prototype.intersection;
S2PublicMembers.prototype.intersects;
S2PublicMembers.prototype.isEmpty;
S2PublicMembers.prototype.lo;
S2PublicMembers.prototype.union;

// S1Angle
S2PublicMembers.prototype.abs;
S2PublicMembers.prototype.compareTo;
S2PublicMembers.prototype.cos;
S2PublicMembers.prototype.degrees;
S2PublicMembers.prototype.distance;
S2PublicMembers.prototype.div;
S2PublicMembers.prototype.e5;
S2PublicMembers.prototype.e6;
S2PublicMembers.prototype.e7;
S2PublicMembers.prototype.greaterOrEquals;
S2PublicMembers.prototype.greaterThan;
S2PublicMembers.prototype.isZero;
S2PublicMembers.prototype.lessOrEquals;
S2PublicMembers.prototype.lessThan;
S2PublicMembers.prototype.mul;
S2PublicMembers.prototype.neg;
S2PublicMembers.prototype.normalize;
S2PublicMembers.prototype.radians;
S2PublicMembers.prototype.sin;
S2PublicMembers.prototype.sub;
S2PublicMembers.prototype.tan;

// S1ChordAngle
S2PublicMembers.prototype.getLength2;
S2PublicMembers.prototype.getS1AngleConstructorMaxError;
S2PublicMembers.prototype.getS2PointConstructorMaxError;
S2PublicMembers.prototype.isInfinity;
S2PublicMembers.prototype.isNegative;
S2PublicMembers.prototype.isSpecial;
S2PublicMembers.prototype.isStraight;
S2PublicMembers.prototype.isValid;
S2PublicMembers.prototype.plusError;
S2PublicMembers.prototype.predecessor;
S2PublicMembers.prototype.successor;
S2PublicMembers.prototype.toAngle;

// S1Interval
S2PublicMembers.prototype.complement;
S2PublicMembers.prototype.fastContains;
S2PublicMembers.prototype.get;
S2PublicMembers.prototype.getComplementCenter;
S2PublicMembers.prototype.isFull;
S2PublicMembers.prototype.isInverted;

// S2Cap
S2PublicMembers.prototype.addCap;
S2PublicMembers.prototype.angle;
S2PublicMembers.prototype.area;
S2PublicMembers.prototype.axis;
S2PublicMembers.prototype.containsCap;
S2PublicMembers.prototype.getCentroid;
S2PublicMembers.prototype.height;
S2PublicMembers.prototype.intersectsCap;
S2PublicMembers.prototype.radius;

// S2Cell
S2PublicMembers.prototype.approxArea;
S2PublicMembers.prototype.averageArea;
S2PublicMembers.prototype.exactArea;
S2PublicMembers.prototype.face;
S2PublicMembers.prototype.getBoundaryDistance;
S2PublicMembers.prototype.getDistance;
S2PublicMembers.prototype.getDistanceToEdge;
S2PublicMembers.prototype.getDistanceToPoint;
S2PublicMembers.prototype.getEdge;
S2PublicMembers.prototype.getMaxDistance;
S2PublicMembers.prototype.getMaxDistanceToEdge;
S2PublicMembers.prototype.getMaxDistanceToPoint;
S2PublicMembers.prototype.getSizeIJ;
S2PublicMembers.prototype.getVertex;
S2PublicMembers.prototype.id;
S2PublicMembers.prototype.isDistanceLessOrEqual;
S2PublicMembers.prototype.isLeaf;
S2PublicMembers.prototype.level;
S2PublicMembers.prototype.orientation;

// S2CellId
S2PublicMembers.prototype.advance;
S2PublicMembers.prototype.advanceWrap;
S2PublicMembers.prototype.child;
S2PublicMembers.prototype.childBegin;
S2PublicMembers.prototype.childBeginAtLevel;
S2PublicMembers.prototype.childEnd;
S2PublicMembers.prototype.childEndAtLevel;
S2PublicMembers.prototype.childPosition;
S2PublicMembers.prototype.childPositionAtLevel;
S2PublicMembers.prototype.distanceFromBegin;
S2PublicMembers.prototype.getAllNeighbors;
S2PublicMembers.prototype.getCommonAncestorLevel;
S2PublicMembers.prototype.getEdgeNeighbors;
S2PublicMembers.prototype.getI;
S2PublicMembers.prototype.getJ;
S2PublicMembers.prototype.getOrientation;
S2PublicMembers.prototype.getSizeST;
S2PublicMembers.prototype.getVertexNeighbors;
S2PublicMembers.prototype.isFace;
S2PublicMembers.prototype.lowestOnBit;
S2PublicMembers.prototype.maximumTile;
S2PublicMembers.prototype.next;
S2PublicMembers.prototype.nextWrap;
S2PublicMembers.prototype.parent;
S2PublicMembers.prototype.parentAtLevel;
S2PublicMembers.prototype.pos;
S2PublicMembers.prototype.prev;
S2PublicMembers.prototype.prevWrap;
S2PublicMembers.prototype.rangeMax;
S2PublicMembers.prototype.rangeMin;
S2PublicMembers.prototype.toLatLng;
S2PublicMembers.prototype.toLoop;
S2PublicMembers.prototype.toPoint;
S2PublicMembers.prototype.toToken;

// S2CellUnion
S2PublicMembers.prototype.averageBasedArea;
S2PublicMembers.prototype.cellId;
S2PublicMembers.prototype.cellIds;
S2PublicMembers.prototype.clear;
S2PublicMembers.prototype.containsCellId;
S2PublicMembers.prototype.denormalize;
S2PublicMembers.prototype.denormalized;
S2PublicMembers.prototype.expand;
S2PublicMembers.prototype.expandAtLevel;
S2PublicMembers.prototype.getDifference;
S2PublicMembers.prototype.getIntersection;
S2PublicMembers.prototype.getIntersectionCellUnion;
S2PublicMembers.prototype.getUnion;
S2PublicMembers.prototype.initFromBeginEnd;
S2PublicMembers.prototype.initFromCellId;
S2PublicMembers.prototype.initFromCellIds;
S2PublicMembers.prototype.initFromId;
S2PublicMembers.prototype.initFromIds;
S2PublicMembers.prototype.initFromMinMax;
S2PublicMembers.prototype.initRawCellIds;
S2PublicMembers.prototype.initRawIds;
S2PublicMembers.prototype.initRawSwap;
S2PublicMembers.prototype.initSwap;
S2PublicMembers.prototype.intersectsCellId;
S2PublicMembers.prototype.isNormalized;
S2PublicMembers.prototype.leafCellsCovered;
S2PublicMembers.prototype.pack;

// S2LatLng
S2PublicMembers.prototype.getDistanceWithRadius;
S2PublicMembers.prototype.lat;
S2PublicMembers.prototype.latDegrees;
S2PublicMembers.prototype.latRadians;
S2PublicMembers.prototype.lng;
S2PublicMembers.prototype.lngDegrees;
S2PublicMembers.prototype.lngRadians;
S2PublicMembers.prototype.normalized;
S2PublicMembers.prototype.toStringDegrees;

// S2LatLngRect
S2PublicMembers.prototype.addLatLng;
S2PublicMembers.prototype.approxEqualsLatLng;
S2PublicMembers.prototype.boundaryIntersects;
S2PublicMembers.prototype.containsLatLng;
S2PublicMembers.prototype.convolveWithCap;
S2PublicMembers.prototype.expandedByDistance;
S2PublicMembers.prototype.getDistanceLatLng;
S2PublicMembers.prototype.getHausdorffDistance;
S2PublicMembers.prototype.getSize;
S2PublicMembers.prototype.interiorContainsLatLng;
S2PublicMembers.prototype.intersectsCell;
S2PublicMembers.prototype.isPoint;
S2PublicMembers.prototype.latHi;
S2PublicMembers.prototype.latLo;
S2PublicMembers.prototype.lngHi;
S2PublicMembers.prototype.lngLo;
S2PublicMembers.prototype.polarClosure;

// S2Loop
S2PublicMembers.prototype.compareBoundary;
S2PublicMembers.prototype.containsNested;
S2PublicMembers.prototype.depth;
S2PublicMembers.prototype.getArea;
S2PublicMembers.prototype.getSubregionBound;
S2PublicMembers.prototype.getTurningAngle;
S2PublicMembers.prototype.invert;
S2PublicMembers.prototype.isEmptyOrFull;
S2PublicMembers.prototype.isHole;
S2PublicMembers.prototype.isOriginInside;
S2PublicMembers.prototype.numVertices;
S2PublicMembers.prototype.orientedVertex;
S2PublicMembers.prototype.orientedVertices;
S2PublicMembers.prototype.sign;
S2PublicMembers.prototype.vertex;
S2PublicMembers.prototype.vertices;

// S2Point
S2PublicMembers.prototype.crossProd;
S2PublicMembers.prototype.crossProdNorm;
S2PublicMembers.prototype.dotProd;
S2PublicMembers.prototype.equalsPoint;
S2PublicMembers.prototype.fabs;
S2PublicMembers.prototype.getDistance2;
S2PublicMembers.prototype.getX;
S2PublicMembers.prototype.getY;
S2PublicMembers.prototype.getZ;
S2PublicMembers.prototype.largestAbsComponent;
S2PublicMembers.prototype.norm;
S2PublicMembers.prototype.norm2;
S2PublicMembers.prototype.ortho;
S2PublicMembers.prototype.rotate;
S2PublicMembers.prototype.toDegreesString;

// S2Polygon
S2PublicMembers.prototype.approxContains;
S2PublicMembers.prototype.approxSubtractFromPolyline;
S2PublicMembers.prototype.boundaryApproxEquals;
S2PublicMembers.prototype.containsPolyline;
S2PublicMembers.prototype.disjoint;
S2PublicMembers.prototype.equalsPolygon;
S2PublicMembers.prototype.getDistanceToBoundary;
S2PublicMembers.prototype.getLastDescendant;
S2PublicMembers.prototype.getLoops;
S2PublicMembers.prototype.getParent;
S2PublicMembers.prototype.getSnapLevel;
S2PublicMembers.prototype.init;
S2PublicMembers.prototype.initNested;
S2PublicMembers.prototype.initOneLoop;
S2PublicMembers.prototype.initOriented;
S2PublicMembers.prototype.initToComplement;
S2PublicMembers.prototype.initToDifference;
S2PublicMembers.prototype.initToIntersection;
S2PublicMembers.prototype.initToIntersectionSloppy;
S2PublicMembers.prototype.initToSimplified;
S2PublicMembers.prototype.initToSimplifiedInCell;
S2PublicMembers.prototype.initToSnapped;
S2PublicMembers.prototype.initToSymmetricDifference;
S2PublicMembers.prototype.initToUnion;
S2PublicMembers.prototype.initToUnionMergeRadius;
S2PublicMembers.prototype.initToUnionSloppy;
S2PublicMembers.prototype.intersectWithPolyline;
S2PublicMembers.prototype.intersectsPolyline;
S2PublicMembers.prototype.loop;
S2PublicMembers.prototype.numLoops;
S2PublicMembers.prototype.project;
S2PublicMembers.prototype.projectToBoundary;
S2PublicMembers.prototype.simplify;
S2PublicMembers.prototype.subtractFromPolyline;

// S2Polyline
S2PublicMembers.prototype.getArclengthAngle;
S2PublicMembers.prototype.getNearestEdgeIndex;
S2PublicMembers.prototype.interpolate;
S2PublicMembers.prototype.projectToEdge;
S2PublicMembers.prototype.reversed;
S2PublicMembers.prototype.subsampleVertices;
S2PublicMembers.prototype.uninterpolate;

// S2RegionCoverer
S2PublicMembers.prototype.getCovering;
S2PublicMembers.prototype.getCoveringCellUnion;
S2PublicMembers.prototype.getCoveringList;
S2PublicMembers.prototype.getFastCovering;
S2PublicMembers.prototype.getInteriorCovering;
S2PublicMembers.prototype.getInteriorCoveringCellUnion;
S2PublicMembers.prototype.getInteriorCoveringList;
S2PublicMembers.prototype.levelMod;
S2PublicMembers.prototype.maxCells;
S2PublicMembers.prototype.maxLevel;
S2PublicMembers.prototype.minLevel;
S2PublicMembers.prototype.normalizeCovering;

// S2RegionCoverer.Builder
S2PublicMembers.prototype.build;
S2PublicMembers.prototype.setLevelMod;
S2PublicMembers.prototype.setMaxCells;
S2PublicMembers.prototype.setMaxLevel;
S2PublicMembers.prototype.setMinLevel;
