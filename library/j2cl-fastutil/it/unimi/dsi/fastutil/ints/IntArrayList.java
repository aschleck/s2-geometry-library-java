package it.unimi.dsi.fastutil.ints;

import java.util.Arrays;
import java.util.Iterator;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntArrayList}, backed by a growable
 * {@code int[]}. Exposes only the surface used by the S2 library.
 */
public class IntArrayList implements Iterable<Integer> {
  private int[] a;
  private int size;

  public IntArrayList() {
    a = new int[16];
  }

  public IntArrayList(int capacity) {
    a = new int[Math.max(capacity, 1)];
  }

  public IntArrayList(IntArrayList other) {
    a = Arrays.copyOf(other.a, Math.max(other.size, 1));
    size = other.size;
  }

  public void ensureCapacity(int min) {
    if (min > a.length) {
      a = Arrays.copyOf(a, Math.max(min, a.length + (a.length >> 1) + 1));
    }
  }

  public int getInt(int index) {
    return a[index];
  }

  public int set(int index, int value) {
    int old = a[index];
    a[index] = value;
    return old;
  }

  public boolean add(int value) {
    ensureCapacity(size + 1);
    a[size++] = value;
    return true;
  }

  public boolean addAll(IntArrayList other) {
    if (other.size == 0) {
      return false;
    }
    ensureCapacity(size + other.size);
    System.arraycopy(other.a, 0, a, size, other.size);
    size += other.size;
    return true;
  }

  public boolean addAll(int index, IntArrayList other) {
    if (other.size == 0) {
      return false;
    }
    ensureCapacity(size + other.size);
    System.arraycopy(a, index, a, index + other.size, size - index);
    System.arraycopy(other.a, 0, a, index, other.size);
    size += other.size;
    return true;
  }

  public int size() {
    return size;
  }

  /** Sets the size, truncating or growing (zero-filling) as needed. */
  public void size(int newSize) {
    if (newSize > a.length) {
      ensureCapacity(newSize);
    }
    if (newSize > size) {
      Arrays.fill(a, size, newSize, 0);
    }
    size = newSize;
  }

  /** Removes and returns the last element (stack pop). */
  public int popInt() {
    return a[--size];
  }

  public boolean isEmpty() {
    return size == 0;
  }

  public void clear() {
    size = 0;
  }

  /** Returns a copy of the elements in {@code [from, to)}. */
  public IntArrayList subList(int from, int to) {
    IntArrayList sub = new IntArrayList(Math.max(to - from, 1));
    System.arraycopy(a, from, sub.a, 0, to - from);
    sub.size = to - from;
    return sub;
  }

  public int[] toIntArray() {
    return Arrays.copyOf(a, size);
  }

  public void trim() {
    if (a.length > size) {
      a = Arrays.copyOf(a, Math.max(size, 1));
    }
  }

  public IntIterator intIterator() {
    return new IntIterator() {
      private int cursor = 0;

      @Override
      public boolean hasNext() {
        return cursor < size;
      }

      @Override
      public Integer next() {
        return a[cursor++];
      }

      @Override
      public int nextInt() {
        return a[cursor++];
      }
    };
  }

  @Override
  public Iterator<Integer> iterator() {
    return intIterator();
  }

  public void sort(IntComparator comparator) {
    Integer[] boxed = new Integer[size];
    for (int i = 0; i < size; i++) {
      boxed[i] = a[i];
    }
    // A stable sort; S2's comparators supply deterministic tie-breakers.
    Arrays.sort(boxed, (x, y) -> comparator.compare(x, y));
    for (int i = 0; i < size; i++) {
      a[i] = boxed[i];
    }
  }

  public void forEach(IntConsumer action) {
    for (int i = 0; i < size; i++) {
      action.accept(a[i]);
    }
  }
}
