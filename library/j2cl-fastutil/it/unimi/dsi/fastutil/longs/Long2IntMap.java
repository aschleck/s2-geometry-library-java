package it.unimi.dsi.fastutil.longs;

import java.util.function.BiFunction;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code Long2IntMap}, exposing only the
 * surface used by the S2 library.
 */
public interface Long2IntMap {
  void defaultReturnValue(int rv);

  void clear();

  boolean isEmpty();

  int compute(
      long key, BiFunction<? super Long, ? super Integer, ? extends Integer> remappingFunction);
}
