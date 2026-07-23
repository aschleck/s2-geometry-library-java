package it.unimi.dsi.fastutil.longs;

import java.util.HashMap;
import java.util.function.BiFunction;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code Long2IntOpenHashMap}, backed by a
 * {@link HashMap}. Exposes only the surface used by the S2 library.
 */
public class Long2IntOpenHashMap implements Long2IntMap {
  private final HashMap<Long, Integer> map = new HashMap<>();
  private int defaultReturnValue = 0;

  public Long2IntOpenHashMap() {}

  @Override
  public void defaultReturnValue(int rv) {
    this.defaultReturnValue = rv;
  }

  @Override
  public void clear() {
    map.clear();
  }

  @Override
  public boolean isEmpty() {
    return map.isEmpty();
  }

  @Override
  public int compute(
      long key, BiFunction<? super Long, ? super Integer, ? extends Integer> remappingFunction) {
    Integer newValue = remappingFunction.apply(key, map.get(key));
    if (newValue == null) {
      map.remove(key);
      return defaultReturnValue;
    }
    map.put(key, newValue);
    return newValue;
  }
}
