package it.unimi.dsi.fastutil.objects;

import java.util.Iterator;

/** Internal helpers for wrapping standard iterators as {@link ObjectIterator}s. */
public final class ObjectIterators {
  private ObjectIterators() {}

  public static <K> ObjectIterator<K> wrap(Iterator<K> iterator) {
    return new ObjectIterator<K>() {
      @Override
      public boolean hasNext() {
        return iterator.hasNext();
      }

      @Override
      public K next() {
        return iterator.next();
      }

      @Override
      public void remove() {
        iterator.remove();
      }
    };
  }
}
