package it.unimi.dsi.fastutil.ints;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code IntComparator}, exposing only the
 * surface used by the S2 library. See {@code //:fastutil-j2cl} in the root BUILD file.
 */
@FunctionalInterface
public interface IntComparator {
  int compare(int a, int b);
}
