// Types for the parts of S2 that exports.js and externs.js expose. The names and behavior follow
// the Java library, see https://github.com/google/s2-geometry-library-java.

/** A Java long, which J2CL represents with Closure's goog.math.Long. */
export class Long {
  private constructor();
  static fromBits(lowBits: number, highBits: number): Long;
  static fromInt(value: number): Long;
  static fromNumber(value: number): Long;
  static fromString(str: string, radix?: number): Long;
  equals(other: Long): boolean;
  getHighBits(): number;
  getLowBits(): number;
  toNumber(): number;
  toString(radix?: number): string;
}

/** A java.util.List. */
export interface List<E> {
  add(element: E): boolean;
  getAtIndex(index: number): E;
  size(): number;
}

/** A java.util.ArrayList. */
export class ArrayList<E> implements List<E> {
  private constructor();
  /** Java's `new ArrayList<>()`. */
  static create<E>(): ArrayList<E>;
  add(element: E): boolean;
  getAtIndex(index: number): E;
  size(): number;
}

export interface Cursor {}

export interface Bytes {
  cursor(position: Long, limit: Long): Cursor;
  length(): Long;
}

export const Bytes: {
  /** Wraps bytes, whose values may be signed or unsigned. */
  fromByteArray(bytes: ArrayLike<number>): Bytes;
};

export interface S2Coder<T> {
  decode(data: Bytes, cursor: Cursor): T;
  isLazy(): boolean;
  unsafeDecode(data: Bytes): T;
  unsafeEncode(value: T): number[];
}

export interface S2Region {
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  getCapBound(): S2Cap;
  getRectBound(): S2LatLngRect;
  mayIntersect(cell: S2Cell): boolean;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
}

export class R1Interval {
  constructor(lo: number, hi: number);
  static empty(): R1Interval;
  static fromPointPair(p1: number, p2: number): R1Interval;
  hi(): number;
  lo(): number;
  static fromPoint(p: number): R1Interval;
  addPoint(p: number): R1Interval;
  approxEquals(other: R1Interval): boolean;
  approxEqualsWithMaxError(other: R1Interval, maxError: number): boolean;
  clampPoint(p: number): number;
  contains(other: R1Interval): boolean;
  containsPoint(p: number): boolean;
  equals(other: unknown): boolean;
  expanded(margin: number): R1Interval;
  getCenter(): number;
  getDirectedHausdorffDistance(other: R1Interval): number;
  getLength(): number;
  interiorContains(other: R1Interval): boolean;
  interiorContainsPoint(p: number): boolean;
  interiorIntersects(other: R1Interval): boolean;
  intersection(other: R1Interval): R1Interval;
  intersects(other: R1Interval): boolean;
  isEmpty(): boolean;
  toString(): string;
  union(other: R1Interval): R1Interval;
}

export class S1Angle {
  constructor(radians: number);
  static degrees(degrees: number): S1Angle;
  static e7(e7: number): S1Angle;
  static radians(radians: number): S1Angle;
  degrees(): number;
  radians(): number;
  static readonly INFINITY: S1Angle;
  static readonly ZERO: S1Angle;
  static e5(e5: number): S1Angle;
  static e6(e6: number): S1Angle;
  static max(left: S1Angle, right: S1Angle): S1Angle;
  static min(left: S1Angle, right: S1Angle): S1Angle;
  abs(): S1Angle;
  add(other: S1Angle): S1Angle;
  compareTo(other: S1Angle): number;
  cos(): number;
  distance(radius: number): number;
  div(d: number): S1Angle;
  e5(): number;
  e6(): number;
  e7(): number;
  equals(other: unknown): boolean;
  greaterOrEquals(other: S1Angle): boolean;
  greaterThan(other: S1Angle): boolean;
  isZero(): boolean;
  lessOrEquals(other: S1Angle): boolean;
  lessThan(other: S1Angle): boolean;
  mul(m: number): S1Angle;
  neg(): S1Angle;
  normalize(): S1Angle;
  sin(): number;
  sub(other: S1Angle): S1Angle;
  tan(): number;
  toString(): string;
}

export class S1ChordAngle {
  private constructor();
  static readonly INFINITY: S1ChordAngle;
  static readonly NEGATIVE: S1ChordAngle;
  static readonly RIGHT: S1ChordAngle;
  static readonly STRAIGHT: S1ChordAngle;
  static readonly ZERO: S1ChordAngle;
  static add(a: S1ChordAngle, b: S1ChordAngle): S1ChordAngle;
  static cos(a: S1ChordAngle): number;
  static fromDegrees(degrees: number): S1ChordAngle;
  static fromE5(e5: number): S1ChordAngle;
  static fromE6(e6: number): S1ChordAngle;
  static fromE7(e7: number): S1ChordAngle;
  static fromLength2(length2: number): S1ChordAngle;
  /** Java's `new S1ChordAngle(S2Point, S2Point)`, the angle between two unit length points. */
  static fromPoints(x: S2Point, y: S2Point): S1ChordAngle;
  static fromRadians(radians: number): S1ChordAngle;
  static fromS1Angle(angle: S1Angle): S1ChordAngle;
  static max(a: S1ChordAngle, b: S1ChordAngle): S1ChordAngle;
  static min(a: S1ChordAngle, b: S1ChordAngle): S1ChordAngle;
  static sin(a: S1ChordAngle): number;
  static sin2(a: S1ChordAngle): number;
  static sub(a: S1ChordAngle, b: S1ChordAngle): S1ChordAngle;
  static tan(a: S1ChordAngle): number;
  compareTo(other: S1ChordAngle): number;
  degrees(): number;
  e5(): number;
  e6(): number;
  e7(): number;
  equals(other: unknown): boolean;
  getLength2(): number;
  getS1AngleConstructorMaxError(): number;
  getS2PointConstructorMaxError(): number;
  greaterOrEquals(other: S1ChordAngle): boolean;
  greaterThan(other: S1ChordAngle): boolean;
  isInfinity(): boolean;
  isNegative(): boolean;
  isSpecial(): boolean;
  isStraight(): boolean;
  isValid(): boolean;
  isZero(): boolean;
  lessOrEquals(other: S1ChordAngle): boolean;
  lessThan(other: S1ChordAngle): boolean;
  plusError(error: number): S1ChordAngle;
  predecessor(): S1ChordAngle;
  radians(): number;
  successor(): S1ChordAngle;
  toAngle(): S1Angle;
  toString(): string;
}

export class S1Interval {
  constructor(lo: number, hi: number);
  static empty(): S1Interval;
  static fromPointPair(p1: number, p2: number): S1Interval;
  static full(): S1Interval;
  hi(): number;
  lo(): number;
  static fromPoint(radians: number): S1Interval;
  static positiveDistance(a: number, b: number): number;
  addPoint(p: number): S1Interval;
  approxEquals(other: S1Interval): boolean;
  approxEqualsWithMaxError(other: S1Interval, maxError: number): boolean;
  clampPoint(p: number): number;
  complement(): S1Interval;
  contains(other: S1Interval): boolean;
  containsPoint(p: number): boolean;
  equals(other: unknown): boolean;
  expanded(margin: number): S1Interval;
  fastContains(p: number): boolean;
  get(endpoint: number): number;
  getCenter(): number;
  getComplementCenter(): number;
  getDirectedHausdorffDistance(other: S1Interval): number;
  getLength(): number;
  interiorContains(other: S1Interval): boolean;
  interiorContainsPoint(p: number): boolean;
  interiorIntersects(other: S1Interval): boolean;
  intersection(other: S1Interval): S1Interval;
  intersects(other: S1Interval): boolean;
  isEmpty(): boolean;
  isFull(): boolean;
  isInverted(): boolean;
  isValid(): boolean;
  toString(): string;
  union(other: S1Interval): S1Interval;
}

export class S2Cap implements S2Region {
  private constructor();
  static empty(): S2Cap;
  static fromAxisAngle(axis: S2Point, angle: S1Angle): S2Cap;
  static fromAxisArea(axis: S2Point, area: number): S2Cap;
  static fromAxisChord(axis: S2Point, radius: S1ChordAngle): S2Cap;
  static fromAxisHeight(axis: S2Point, height: number): S2Cap;
  static full(): S2Cap;
  addCap(other: S2Cap): S2Cap;
  addPoint(p: S2Point): S2Cap;
  angle(): S1Angle;
  area(): number;
  axis(): S2Point;
  complement(): S2Cap;
  containsCap(other: S2Cap): boolean;
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  expanded(distance: S1Angle): S2Cap;
  getCapBound(): S2Cap;
  getCentroid(): S2Point;
  getRectBound(): S2LatLngRect;
  height(): number;
  interiorContains(p: S2Point): boolean;
  intersectsCap(other: S2Cap): boolean;
  isEmpty(): boolean;
  isFull(): boolean;
  isValid(): boolean;
  mayIntersect(cell: S2Cell): boolean;
  radius(): S1ChordAngle;
  union(other: S2Cap): S2Cap;
  static readonly CODER: S2Coder<S2Cap>;
  equals(other: unknown): boolean;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  interiorIntersects(other: S2Cap): boolean;
  toString(): string;
}

export class S2Cell implements S2Region {
  private constructor();
  static averageAreaAtLevel(level: number): number;
  /** Java's `new S2Cell(S2CellId)`. */
  static fromCellId(id: S2CellId): S2Cell;
  static fromFace(face: number): S2Cell;
  approxArea(): number;
  averageArea(): number;
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  exactArea(): number;
  face(): number;
  getCapBound(): S2Cap;
  getCenter(): S2Point;
  getDistance(other: S2Cell): S1ChordAngle;
  getDistanceToPoint(p: S2Point): S1ChordAngle;
  getMaxDistance(other: S2Cell): S1ChordAngle;
  getRectBound(): S2LatLngRect;
  getVertex(k: number): S2Point;
  id(): S2CellId;
  isLeaf(): boolean;
  level(): number;
  mayIntersect(cell: S2Cell): boolean;
  static fromFacePosLevel(face: number, pos: Long, level: number): S2Cell;
  equals(other: unknown): boolean;
  getBoundaryDistance(p: S2Point): S1ChordAngle;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getDistanceToEdge(a: S2Point, b: S2Point): S1ChordAngle;
  getEdge(k: number): S2Point;
  getMaxDistanceToEdge(a: S2Point, b: S2Point): S1ChordAngle;
  getMaxDistanceToPoint(p: S2Point): S1ChordAngle;
  getSizeIJ(): number;
  isDistanceLessOrEqual(target: S2Cell, distance: S1ChordAngle): boolean;
  orientation(): number;
  toString(): string;
}

export class S2CellId {
  constructor(id: Long);
  static readonly MAX_LEVEL: number;
  static readonly NUM_FACES: number;
  static begin(level: number): S2CellId;
  static end(level: number): S2CellId;
  static fromFace(face: number): S2CellId;
  static fromFacePosLevel(face: number, pos: Long, level: number): S2CellId;
  static fromLatLng(ll: S2LatLng): S2CellId;
  static fromPoint(p: S2Point): S2CellId;
  static fromToken(token: string): S2CellId;
  static isValidToken(token: string): boolean;
  static none(): S2CellId;
  child(position: number): S2CellId;
  childBegin(): S2CellId;
  childEnd(): S2CellId;
  compareTo(other: S2CellId): number;
  contains(other: S2CellId): boolean;
  equals(other: unknown): boolean;
  face(): number;
  getCommonAncestorLevel(other: S2CellId): number;
  id(): Long;
  intersects(other: S2CellId): boolean;
  isFace(): boolean;
  isLeaf(): boolean;
  isValid(): boolean;
  level(): number;
  next(): S2CellId;
  parent(): S2CellId;
  parentAtLevel(level: number): S2CellId;
  prev(): S2CellId;
  rangeMax(): S2CellId;
  rangeMin(): S2CellId;
  toLatLng(): S2LatLng;
  toLoop(level: number): S2Loop;
  toPoint(): S2Point;
  toString(): string;
  toToken(): string;
  static readonly CODER: S2Coder<S2CellId>;
  static readonly FACE_CELLS: S2CellId[];
  static readonly TOKEN_CODER: S2Coder<S2CellId>;
  static fromFaceIJ(face: number, i: number, j: number): S2CellId;
  static getSizeIJ(level: number): number;
  static getSizeST(level: number): number;
  static isValidOrNoneToken(token: string): boolean;
  static lowestOnBitForLevel(level: number): Long;
  static sentinel(): S2CellId;
  advance(steps: Long): S2CellId;
  advanceWrap(steps: Long): S2CellId;
  childBeginAtLevel(level: number): S2CellId;
  childEndAtLevel(level: number): S2CellId;
  childPosition(): number;
  childPositionAtLevel(level: number): number;
  distanceFromBegin(): Long;
  getAllNeighbors(nbrLevel: number, output: List<S2CellId>): void;
  getEdgeNeighbors(neighbors: S2CellId[]): void;
  getI(): number;
  getJ(): number;
  getOrientation(): number;
  getSizeIJ(): number;
  getSizeST(): number;
  getVertexNeighbors(level: number, output: ArrayList<S2CellId>): void;
  greaterOrEquals(other: S2CellId): boolean;
  greaterThan(other: S2CellId): boolean;
  lessOrEquals(other: S2CellId): boolean;
  lessThan(other: S2CellId): boolean;
  lowestOnBit(): Long;
  maximumTile(limit: S2CellId): S2CellId;
  nextWrap(): S2CellId;
  pos(): Long;
  prevWrap(): S2CellId;
}

export class S2CellUnion implements S2Region {
  constructor();
  static readonly COMPACT_CODER: S2Coder<S2CellUnion>;
  static readonly FAST_CODER: S2Coder<S2CellUnion>;
  static copyFrom(other: S2CellUnion): S2CellUnion;
  approxArea(): number;
  cellId(i: number): S2CellId;
  cellIds(): ArrayList<S2CellId>;
  contains(other: S2CellUnion): boolean;
  containsCell(cell: S2Cell): boolean;
  containsCellId(id: S2CellId): boolean;
  containsPoint(p: S2Point): boolean;
  denormalize(minLevel: number, levelMod: number, output: ArrayList<S2CellId>): void;
  denormalized(minLevel: number): List<S2CellId>;
  exactArea(): number;
  expandAtLevel(level: number): void;
  getCapBound(): S2Cap;
  getDifference(x: S2CellUnion, y: S2CellUnion): void;
  getIntersectionCellUnion(x: S2CellUnion, y: S2CellUnion): void;
  getRectBound(): S2LatLngRect;
  getUnion(x: S2CellUnion, y: S2CellUnion): void;
  initFromBeginEnd(begin: S2CellId, end: S2CellId): void;
  initFromCellId(id: S2CellId): S2CellUnion;
  initFromCellIds(cellIds: ArrayList<S2CellId>): S2CellUnion;
  initRawCellIds(cellIds: ArrayList<S2CellId>): void;
  intersects(other: S2CellUnion): boolean;
  intersectsCellId(id: S2CellId): boolean;
  isEmpty(): boolean;
  mayIntersect(cell: S2Cell): boolean;
  normalize(): boolean;
  size(): number;
  static intersection(x: S2CellUnion, y: S2CellUnion): S2CellUnion;
  static union(x: S2CellUnion, y: S2CellUnion): S2CellUnion;
  static wholeSphere(): S2CellUnion;
  averageBasedArea(): number;
  clear(): void;
  equals(other: unknown): boolean;
  expand(minRadius: S1Angle, maxLevelDiff: number): void;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getIntersection(x: S2CellUnion, id: S2CellId): void;
  initFromId(cellId: Long): S2CellUnion;
  initFromIds(cellIds: List<Long>): S2CellUnion;
  initFromMinMax(minId: S2CellId, maxId: S2CellId): void;
  initRawIds(cellIds: List<Long>): S2CellUnion;
  initRawSwap(cellIds: List<S2CellId>): void;
  initSwap(cellIds: List<S2CellId>): S2CellUnion;
  isNormalized(): boolean;
  isValid(): boolean;
  leafCellsCovered(): Long;
  pack(): void;
  toString(): string;
}

export class S2Earth {
  private constructor();
  static getDistanceBetweenLatLngsKm(a: S2LatLng, b: S2LatLng): number;
  static getDistanceBetweenLatLngsMeters(a: S2LatLng, b: S2LatLng): number;
  static getDistanceBetweenPointsKm(a: S2Point, b: S2Point): number;
  static getDistanceBetweenPointsMeters(a: S2Point, b: S2Point): number;
  static getInitialBearing(a: S2LatLng, b: S2LatLng): S1Angle;
  static getRadiusKm(): number;
  static getRadiusMeters(): number;
  static kmToRadians(km: number): number;
  static metersToRadians(meters: number): number;
  static radiansToKm(radians: number): number;
  static radiansToMeters(radians: number): number;
  static squareMetersToSteradians(squareMeters: number): number;
  static steradiansToSquareMeters(steradians: number): number;
  static toKm(angle: S1Angle): number;
  static toMeters(angle: S1Angle): number;
  static haversine(radians: number): number;
  static squareKmToSteradians(squareKm: number): number;
  static steradiansToSquareKm(steradians: number): number;
}

export class S2LatLng {
  private constructor();
  static readonly CENTER: S2LatLng;
  static fromDegrees(latDegrees: number, lngDegrees: number): S2LatLng;
  static fromE5(latE5: number, lngE5: number): S2LatLng;
  static fromE6(latE6: number, lngE6: number): S2LatLng;
  static fromE7(latE7: number, lngE7: number): S2LatLng;
  static fromPoint(p: S2Point): S2LatLng;
  static fromRadians(latRadians: number, lngRadians: number): S2LatLng;
  add(other: S2LatLng): S2LatLng;
  approxEquals(other: S2LatLng): boolean;
  equals(other: unknown): boolean;
  getDistance(other: S2LatLng): S1Angle;
  isValid(): boolean;
  lat(): S1Angle;
  latDegrees(): number;
  latRadians(): number;
  lng(): S1Angle;
  lngDegrees(): number;
  lngRadians(): number;
  mul(m: number): S2LatLng;
  normalized(): S2LatLng;
  sub(other: S2LatLng): S2LatLng;
  toPoint(): S2Point;
  toString(): string;
  toStringDegrees(): string;
  static readonly CODER: S2Coder<S2LatLng>;
  static isValid(latRadians: number, lngRadians: number): boolean;
  static latitude(p: S2Point): S1Angle;
  static longitude(p: S2Point): S1Angle;
  approxEqualsWithMaxError(other: S2LatLng, maxError: number): boolean;
  getDistanceWithRadius(other: S2LatLng, radius: number): number;
}

export class S2LatLngRect implements S2Region {
  private constructor();
  static empty(): S2LatLngRect;
  static fromCenterSize(center: S2LatLng, size: S2LatLng): S2LatLngRect;
  /** Java's `new S2LatLngRect(R1Interval, S1Interval)`. */
  static fromIntervals(lat: R1Interval, lng: S1Interval): S2LatLngRect;
  static fromPoint(p: S2LatLng): S2LatLngRect;
  static fromPointPair(p1: S2LatLng, p2: S2LatLng): S2LatLngRect;
  static full(): S2LatLngRect;
  static fullLat(): R1Interval;
  static fullLng(): S1Interval;
  addLatLng(ll: S2LatLng): S2LatLngRect;
  addPoint(p: S2Point): S2LatLngRect;
  approxEquals(other: S2LatLngRect): boolean;
  area(): number;
  contains(other: S2LatLngRect): boolean;
  containsCell(cell: S2Cell): boolean;
  containsLatLng(ll: S2LatLng): boolean;
  containsPoint(p: S2Point): boolean;
  convolveWithCap(angle: S1Angle): S2LatLngRect;
  equals(other: unknown): boolean;
  expanded(margin: S2LatLng): S2LatLngRect;
  expandedByDistance(distance: S1Angle): S2LatLngRect;
  getCapBound(): S2Cap;
  getCenter(): S2LatLng;
  getDistance(other: S2LatLngRect): S1Angle;
  getRectBound(): S2LatLngRect;
  getSize(): S2LatLng;
  getVertex(k: number): S2LatLng;
  hi(): S2LatLng;
  interiorContains(other: S2LatLngRect): boolean;
  intersection(other: S2LatLngRect): S2LatLngRect;
  intersects(other: S2LatLngRect): boolean;
  intersectsCell(cell: S2Cell): boolean;
  isEmpty(): boolean;
  isFull(): boolean;
  isValid(): boolean;
  lat(): R1Interval;
  latHi(): S1Angle;
  latLo(): S1Angle;
  lng(): S1Interval;
  lngHi(): S1Angle;
  lngLo(): S1Angle;
  lo(): S2LatLng;
  mayIntersect(cell: S2Cell): boolean;
  polarClosure(): S2LatLngRect;
  toString(): string;
  toStringDegrees(): string;
  union(other: S2LatLngRect): S2LatLngRect;
  static readonly CODER: S2Coder<S2LatLngRect>;
  static intersectsLatEdge(a: S2Point, b: S2Point, lat: number, lng: S1Interval): boolean;
  static intersectsLngEdge(a: S2Point, b: S2Point, lat: R1Interval, lng: number): boolean;
  static isValidIntervals(lat: R1Interval, lng: S1Interval): boolean;
  static isValidLoHi(lo: S2LatLng, hi: S2LatLng): boolean;
  approxEqualsLatLng(other: S2LatLngRect, maxError: S2LatLng): boolean;
  approxEqualsWithMaxError(other: S2LatLngRect, maxError: number): boolean;
  boundaryIntersects(v0: S2Point, v1: S2Point): boolean;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getCentroid(): S2Point;
  getDirectedHausdorffDistance(other: S2LatLngRect): S1Angle;
  getDistanceLatLng(p: S2LatLng): S1Angle;
  getHausdorffDistance(other: S2LatLngRect): S1Angle;
  interiorContainsLatLng(ll: S2LatLng): boolean;
  interiorContainsPoint(p: S2Point): boolean;
  interiorIntersects(other: S2LatLngRect): boolean;
  isInverted(): boolean;
  isPoint(): boolean;
}

export class S2Loop implements S2Region {
  private constructor();
  static empty(): S2Loop;
  /** Java's `new S2Loop(List<S2Point>)`. */
  static fromVertices(vertices: List<S2Point>): S2Loop;
  static full(): S2Loop;
  static makeRegularLoop(center: S2Point, radius: S1Angle, numVertices: number): S2Loop;
  contains(other: S2Loop): boolean;
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  getArea(): number;
  getCapBound(): S2Cap;
  getCentroid(): S2Point;
  getDistance(p: S2Point): S1Angle;
  getRectBound(): S2LatLngRect;
  intersects(other: S2Loop): boolean;
  invert(): void;
  isEmpty(): boolean;
  isFull(): boolean;
  isHole(): boolean;
  isNormalized(): boolean;
  isValid(): boolean;
  mayIntersect(cell: S2Cell): boolean;
  normalize(): S2Loop;
  numVertices(): number;
  sign(): number;
  vertex(i: number): S2Point;
  vertices(): List<S2Point>;
  static makeRegularVertices(center: S2Point, radius: S1Angle, numVertices: number): List<S2Point>;
  compareBoundary(other: S2Loop): number;
  compareTo(other: S2Loop): number;
  containsNested(other: S2Loop): boolean;
  depth(): number;
  equals(other: unknown): boolean;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getSubregionBound(): S2LatLngRect;
  getTurningAngle(): number;
  isEmptyOrFull(): boolean;
  isOriginInside(): boolean;
  orientedVertex(i: number): S2Point;
  orientedVertices(): List<S2Point>;
  toString(): string;
}

export class S2Point implements S2Region {
  constructor(x: number, y: number, z: number);
  add(p: S2Point): S2Point;
  angle(p: S2Point): number;
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  crossProd(p: S2Point): S2Point;
  div(scale: number): S2Point;
  dotProd(p: S2Point): number;
  equalsPoint(p: S2Point): boolean;
  getCapBound(): S2Cap;
  getDistance(p: S2Point): number;
  getRectBound(): S2LatLngRect;
  getX(): number;
  getY(): number;
  getZ(): number;
  mayIntersect(cell: S2Cell): boolean;
  mul(scale: number): S2Point;
  neg(): S2Point;
  norm(): number;
  norm2(): number;
  normalize(): S2Point;
  ortho(): S2Point;
  sub(p: S2Point): S2Point;
  toDegreesString(): string;
  static readonly CODER: S2Coder<S2Point>;
  static readonly X_NEG: S2Point;
  static readonly X_POS: S2Point;
  static readonly Y_NEG: S2Point;
  static readonly Y_POS: S2Point;
  static readonly ZERO: S2Point;
  static readonly Z_NEG: S2Point;
  static readonly Z_POS: S2Point;
  static minus(p1: S2Point, p2: S2Point): S2Point;
  static rotate(point: S2Point, axis: S2Point, radians: number): S2Point;
  static scalarTripleProduct(a: S2Point, b: S2Point, c: S2Point): number;
  compareTo(other: S2Point): number;
  crossProdNorm(p: S2Point): number;
  equals(other: unknown): boolean;
  fabs(): S2Point;
  get(axis: number): number;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getDistance2(p: S2Point): number;
  isValid(): boolean;
  largestAbsComponent(): number;
  lessThan(p: S2Point): boolean;
  rotate(axis: S2Point, radians: number): S2Point;
  toString(): string;
}

export class S2Polygon implements S2Region {
  private constructor();
  static readonly COMPACT_CODER: S2Coder<S2Polygon>;
  static readonly FAST_CODER: S2Coder<S2Polygon>;
  static fromCellUnionBorder(cells: S2CellUnion): S2Polygon;
  /** Called with no loops, this is Java's `new S2Polygon()`. */
  static fromLoopArray(...loops: S2Loop[]): S2Polygon;
  static fromLoops(loops: List<S2Loop>): S2Polygon;
  static getIntersectionOverUnion(a: S2Polygon, b: S2Polygon): number;
  static union(polygons: List<S2Polygon>): S2Polygon;
  approxEquals(other: S2Polygon, tolerance: S1Angle): boolean;
  contains(other: S2Polygon): boolean;
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  getArea(): number;
  getCapBound(): S2Cap;
  getCentroid(): S2Point;
  getDistance(p: S2Point): S1Angle;
  getDistanceToBoundary(p: S2Point): S1Angle;
  getLoops(): List<S2Loop>;
  getRectBound(): S2LatLngRect;
  initToComplement(a: S2Polygon): void;
  initToDifference(a: S2Polygon, b: S2Polygon): boolean;
  initToIntersection(a: S2Polygon, b: S2Polygon): void;
  initToIntersectionSloppy(a: S2Polygon, b: S2Polygon, vertexMergeRadius: S1Angle): void;
  initToSimplified(a: S2Polygon, tolerance: S1Angle, snapToCellCenters: boolean): void;
  initToSymmetricDifference(a: S2Polygon, b: S2Polygon): boolean;
  initToUnion(a: S2Polygon, b: S2Polygon): void;
  initToUnionSloppy(a: S2Polygon, b: S2Polygon, vertexMergeRadius: S1Angle): void;
  intersects(other: S2Polygon): boolean;
  isEmpty(): boolean;
  isFull(): boolean;
  isValid(): boolean;
  loop(k: number): S2Loop;
  mayIntersect(cell: S2Cell): boolean;
  numLoops(): number;
  numVertices(): number;
  project(p: S2Point): S2Point;
  static getOverlapFraction(a: S2Polygon, b: S2Polygon): number;
  approxContains(other: S2Polygon, vertexMergeRadius: S1Angle): boolean;
  approxSubtractFromPolyline(line: S2Polyline, snapRadius: S1Angle): List<S2Polyline>;
  boundaryApproxEquals(other: S2Polygon, maxErrorRadians: number): boolean;
  containsPolyline(line: S2Polyline): boolean;
  disjoint(line: S2Polyline): boolean;
  equals(other: unknown): boolean;
  equalsPolygon(other: S2Polygon): boolean;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getLastDescendant(k: number): number;
  getParent(k: number): number;
  getSnapLevel(): number;
  init(loops: List<S2Loop>): void;
  initNested(loops: List<S2Loop>): void;
  initOneLoop(loop: S2Loop): void;
  initOriented(loops: List<S2Loop>): void;
  initToSimplifiedInCell(
      a: S2Polygon, cell: S2Cell, snapRadius: S1Angle, boundaryTolerance: S1Angle): void;
  initToSnapped(polygon: S2Polygon, snapLevel: number): void;
  initToUnionMergeRadius(a: S2Polygon, b: S2Polygon, vertexMergeRadius: S1Angle): void;
  intersectWithPolyline(line: S2Polyline): List<S2Polyline>;
  intersectsPolyline(line: S2Polyline): boolean;
  isNormalized(): boolean;
  projectToBoundary(p: S2Point): S2Point;
  simplify(maxVertices: number): S2Polygon;
  subtractFromPolyline(line: S2Polyline): List<S2Polyline>;
  toString(): string;
}

export class S2Polyline implements S2Region {
  constructor(vertices: S2Point[]);
  containsCell(cell: S2Cell): boolean;
  containsPoint(p: S2Point): boolean;
  getArclengthAngle(): S1Angle;
  getCapBound(): S2Cap;
  getNearestEdgeIndex(p: S2Point): number;
  getRectBound(): S2LatLngRect;
  interpolate(fraction: number): S2Point;
  intersects(other: S2Polyline): boolean;
  isValid(): boolean;
  mayIntersect(cell: S2Cell): boolean;
  numVertices(): number;
  project(p: S2Point): S2Point;
  reversed(): S2Polyline;
  subsampleVertices(tolerance: S1Angle): S2Polyline;
  uninterpolate(p: S2Point): number;
  vertex(k: number): S2Point;
  vertices(): List<S2Point>;
  static readonly COMPACT_CODER: S2Coder<S2Polyline>;
  static readonly FAST_CODER: S2Coder<S2Polyline>;
  static deduplicatePoints(points: List<S2Point>): void;
  static fromSnapped(line: S2Polyline, snapLevel: number): S2Polyline;
  equals(other: unknown): boolean;
  getCellUnionBound(results: ArrayList<S2CellId>): void;
  getCentroid(): S2Point;
  getSnapLevel(): number;
  isEmpty(): boolean;
  isFull(): boolean;
  projectToEdge(p: S2Point, index: number): S2Point;
  toString(): string;
}

export interface S2RegionCovererBuilder {
  build(): S2RegionCoverer;
  setLevelMod(levelMod: number): S2RegionCovererBuilder;
  setMaxCells(maxCells: number): S2RegionCovererBuilder;
  setMaxLevel(maxLevel: number): S2RegionCovererBuilder;
  setMinLevel(minLevel: number): S2RegionCovererBuilder;
}

export class S2RegionCoverer {
  private constructor();
  static builder(): S2RegionCovererBuilder;
  static getSimpleCovering(
      region: S2Region, start: S2Point, level: number, output: ArrayList<S2CellId>): void;
  getCovering(region: S2Region): S2CellUnion;
  getCoveringCellUnion(region: S2Region, covering: S2CellUnion): void;
  getCoveringList(region: S2Region, covering: ArrayList<S2CellId>): void;
  getInteriorCovering(region: S2Region): S2CellUnion;
  getInteriorCoveringCellUnion(region: S2Region, covering: S2CellUnion): void;
  getInteriorCoveringList(region: S2Region, covering: ArrayList<S2CellId>): void;
  levelMod(): number;
  maxCells(): number;
  maxLevel(): number;
  minLevel(): number;
  static readonly DEFAULT: S2RegionCoverer;
  equals(other: unknown): boolean;
  getFastCovering(cap: S2Cap, results: ArrayList<S2CellId>): void;
  normalizeCovering(covering: ArrayList<S2CellId>): void;
}
