package it.unimi.dsi.fastutil.ints;

import java.util.Set;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntSet}, exposing only the surface
 * used by the S2 library. Extends {@link Set Set&lt;Integer&gt;} so instances can be passed to
 * standard collection APIs (e.g. {@code new HashSet<>(intSet)}).
 */
public interface IntSet extends Set<Integer> {
  boolean add(int key);

  boolean remove(int key);

  @Override
  IntIterator iterator();
}
