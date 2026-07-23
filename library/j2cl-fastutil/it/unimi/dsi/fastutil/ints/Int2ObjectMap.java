package it.unimi.dsi.fastutil.ints;

import java.util.Collection;
import java.util.Set;
import java.util.function.IntFunction;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code Int2ObjectMap}, exposing only the
 * surface used by the S2 library.
 */
public interface Int2ObjectMap<V> {
  /** An int-keyed map entry. */
  interface Entry<V> {
    int getIntKey();

    V getValue();
  }

  V get(int key);

  V put(int key, V value);

  void clear();

  Collection<V> values();

  V computeIfAbsent(int key, IntFunction<? extends V> mappingFunction);

  Set<Entry<V>> int2ObjectEntrySet();
}
