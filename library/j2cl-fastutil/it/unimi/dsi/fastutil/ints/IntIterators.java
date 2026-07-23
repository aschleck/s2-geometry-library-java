package it.unimi.dsi.fastutil.ints;

import java.util.Iterator;

/** Internal helpers for wrapping boxed iterators as {@link IntIterator}s. */
final class IntIterators {
  private IntIterators() {}

  static IntIterator wrap(Iterator<Integer> iterator) {
    return new IntIterator() {
      @Override
      public boolean hasNext() {
        return iterator.hasNext();
      }

      @Override
      public Integer next() {
        return iterator.next();
      }

      @Override
      public int nextInt() {
        return iterator.next();
      }

      @Override
      public void remove() {
        iterator.remove();
      }
    };
  }
}
