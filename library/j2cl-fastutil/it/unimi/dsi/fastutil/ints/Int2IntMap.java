package it.unimi.dsi.fastutil.ints;

import it.unimi.dsi.fastutil.objects.ObjectIterator;
import java.util.function.BiFunction;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code Int2IntMap}, exposing only the
 * surface used by the S2 library.
 */
public interface Int2IntMap {
  /** An int-keyed, int-valued map entry. */
  interface Entry {
    int getIntKey();

    int getIntValue();
  }

  /** An entry set that supports {@link #fastIterator()}. */
  interface FastEntrySet {
    ObjectIterator<Entry> fastIterator();
  }

  int size();

  boolean isEmpty();

  int compute(
      int key, BiFunction<? super Integer, ? super Integer, ? extends Integer> remappingFunction);

  FastEntrySet int2IntEntrySet();
}
