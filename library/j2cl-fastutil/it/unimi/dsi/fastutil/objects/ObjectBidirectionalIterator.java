package it.unimi.dsi.fastutil.objects;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code ObjectBidirectionalIterator},
 * exposing only the surface used by the S2 library.
 */
public interface ObjectBidirectionalIterator<K> extends ObjectIterator<K> {
  K previous();

  boolean hasPrevious();
}
