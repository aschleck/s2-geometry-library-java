package it.unimi.dsi.fastutil.ints;

import it.unimi.dsi.fastutil.objects.ObjectIterator;
import it.unimi.dsi.fastutil.objects.ObjectIterators;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code Int2IntOpenHashMap}, backed by a
 * {@link HashMap}. Exposes only the surface used by the S2 library.
 */
public class Int2IntOpenHashMap implements Int2IntMap {
  private final HashMap<Integer, Integer> map = new HashMap<>();

  public Int2IntOpenHashMap() {}

  @Override
  public int size() {
    return map.size();
  }

  @Override
  public boolean isEmpty() {
    return map.isEmpty();
  }

  @Override
  public int compute(
      int key, BiFunction<? super Integer, ? super Integer, ? extends Integer> remappingFunction) {
    Integer newValue = remappingFunction.apply(key, map.get(key));
    if (newValue == null) {
      map.remove(key);
      return 0;
    }
    map.put(key, newValue);
    return newValue;
  }

  @Override
  public FastEntrySet int2IntEntrySet() {
    final List<Entry> entries = new ArrayList<>();
    for (Map.Entry<Integer, Integer> e : map.entrySet()) {
      final int key = e.getKey();
      final int value = e.getValue();
      entries.add(
          new Entry() {
            @Override
            public int getIntKey() {
              return key;
            }

            @Override
            public int getIntValue() {
              return value;
            }
          });
    }
    return new FastEntrySet() {
      @Override
      public ObjectIterator<Entry> fastIterator() {
        return ObjectIterators.wrap(entries.iterator());
      }
    };
  }
}
