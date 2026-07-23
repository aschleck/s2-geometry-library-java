package it.unimi.dsi.fastutil.ints;

import java.util.function.Consumer;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntConsumer}. As in fastutil, it
 * extends both {@link java.util.function.IntConsumer} and {@link Consumer Consumer&lt;Integer&gt;};
 * being a subtype of {@code Consumer<Integer>} makes {@code forEach(IntConsumer)} the more specific
 * overload versus the inherited {@code Iterable.forEach(Consumer)}, avoiding an ambiguity.
 */
@FunctionalInterface
public interface IntConsumer extends java.util.function.IntConsumer, Consumer<Integer> {
  @Override
  void accept(int value);

  @Override
  default void accept(Integer value) {
    accept(value.intValue());
  }
}
