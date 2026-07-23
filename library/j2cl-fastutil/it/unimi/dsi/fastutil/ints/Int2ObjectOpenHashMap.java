package it.unimi.dsi.fastutil.ints;

import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.IntFunction;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code Int2ObjectOpenHashMap}, backed by a
 * {@link HashMap}. Exposes only the surface used by the S2 library.
 */
public class Int2ObjectOpenHashMap<V> implements Int2ObjectMap<V> {
  private final HashMap<Integer, V> map;

  public Int2ObjectOpenHashMap() {
    map = new HashMap<>();
  }

  public Int2ObjectOpenHashMap(int expected) {
    map = new HashMap<>();
  }

  @Override
  public V get(int key) {
    return map.get(key);
  }

  @Override
  public V put(int key, V value) {
    return map.put(key, value);
  }

  @Override
  public void clear() {
    map.clear();
  }

  @Override
  public Collection<V> values() {
    return map.values();
  }

  @Override
  public V computeIfAbsent(int key, IntFunction<? extends V> mappingFunction) {
    V value = map.get(key);
    if (value == null) {
      value = mappingFunction.apply(key);
      map.put(key, value);
    }
    return value;
  }

  @Override
  public Set<Int2ObjectMap.Entry<V>> int2ObjectEntrySet() {
    LinkedHashSet<Int2ObjectMap.Entry<V>> entries = new LinkedHashSet<>();
    for (Map.Entry<Integer, V> e : map.entrySet()) {
      final int key = e.getKey();
      final V value = e.getValue();
      entries.add(
          new Int2ObjectMap.Entry<V>() {
            @Override
            public int getIntKey() {
              return key;
            }

            @Override
            public V getValue() {
              return value;
            }
          });
    }
    return entries;
  }
}
