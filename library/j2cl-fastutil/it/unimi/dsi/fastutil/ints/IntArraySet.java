package it.unimi.dsi.fastutil.ints;

import java.util.LinkedHashSet;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntArraySet}, backed by a
 * {@link LinkedHashSet} (preserving insertion order, as fastutil's array set does). Exposes only
 * the surface used by the S2 library.
 */
public class IntArraySet extends LinkedHashSet<Integer> implements IntSet {
  public IntArraySet() {
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
