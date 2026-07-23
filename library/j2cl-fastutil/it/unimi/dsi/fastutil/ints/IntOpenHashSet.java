package it.unimi.dsi.fastutil.ints;

import java.util.HashSet;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntOpenHashSet}, backed by a
 * {@link HashSet}. Exposes only the surface used by the S2 library.
 */
public class IntOpenHashSet extends HashSet<Integer> implements IntSet {
  public IntOpenHashSet() {
    super();
  }

  @Override
  public boolean add(int key) {
    return super.add(key);
  }

  @Override
  public boolean remove(int key) {
    return super.remove((Integer) key);
  }

  @Override
  public IntIterator iterator() {
    return IntIterators.wrap(super.iterator());
  }
}
