package it.unimi.dsi.fastutil.objects;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.TreeSet;

/**
 * Minimal J2CL-compatible reimplementation of fastutil's {@code ObjectAVLTreeSet}, backed by a
 * {@link TreeSet}. Exposes only the surface used by the S2 library.
 *
 * <p>The comparator supplied at construction determines both ordering and element identity, matching
 * fastutil's sorted-set semantics.
 */
public class ObjectAVLTreeSet<K> {
  private final TreeSet<K> set;
  private final Comparator<? super K> comparator;

  public ObjectAVLTreeSet(Comparator<? super K> comparator) {
    this.comparator = comparator;
    this.set = new TreeSet<>(comparator);
  }

  public int size() {
    return set.size();
  }

  public boolean isEmpty() {
    return set.isEmpty();
  }

  public boolean add(K element) {
    return set.add(element);
  }

  public boolean remove(K element) {
    return set.remove(element);
  }

  public void clear() {
    set.clear();
  }

  public boolean contains(K element) {
    return set.contains(element);
  }

  public K first() {
    return set.first();
  }

  public K last() {
    return set.last();
  }

  public ObjectBidirectionalIterator<K> iterator() {
    return new BidiIterator(new ArrayList<>(set), 0);
  }

  /**
   * Returns a bidirectional iterator positioned immediately after {@code fromElement}: {@code
   * next()} returns the least element strictly greater than {@code fromElement}, and {@code
   * previous()} returns the greatest element less than or equal to {@code fromElement}. This
   * mirrors fastutil's {@code iterator(K)} contract that the S2 iterator relies on.
   */
  public ObjectBidirectionalIterator<K> iterator(K fromElement) {
    List<K> snapshot = new ArrayList<>(set);
    int cursor = 0;
    while (cursor < snapshot.size() && comparator.compare(snapshot.get(cursor), fromElement) <= 0) {
      cursor++;
    }
    return new BidiIterator(snapshot, cursor);
  }

  private class BidiIterator implements ObjectBidirectionalIterator<K> {
    private final List<K> elements;
    private int cursor;

    BidiIterator(List<K> elements, int cursor) {
      this.elements = elements;
      this.cursor = cursor;
    }

    @Override
    public boolean hasNext() {
      return cursor < elements.size();
    }

    @Override
    public K next() {
      return elements.get(cursor++);
    }

    @Override
    public boolean hasPrevious() {
      return cursor > 0;
    }

    @Override
    public K previous() {
      return elements.get(--cursor);
    }
  }
}
