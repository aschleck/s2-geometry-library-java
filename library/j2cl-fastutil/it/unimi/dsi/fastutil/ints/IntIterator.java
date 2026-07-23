package it.unimi.dsi.fastutil.ints;

import java.util.Iterator;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntIterator}, exposing only the
 * surface used by the S2 library.
 */
public interface IntIterator extends Iterator<Integer> {
  int nextInt();
}
