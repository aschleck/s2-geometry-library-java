package it.unimi.dsi.fastutil.objects;

import java.util.Iterator;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code ObjectIterator}, exposing only the
 * surface used by the S2 library.
 */
public interface ObjectIterator<K> extends Iterator<K> {}
