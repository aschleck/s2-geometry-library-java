// The library speaks Java collections, so these convert them to and from JavaScript arrays.

import {ArrayList} from '@aschleck/s2-geometry-java';
import type {List} from '@aschleck/s2-geometry-java';

export function toArrayList<E>(values: Iterable<E>): ArrayList<E> {
  const list = ArrayList.create<E>();
  for (const value of values) {
    list.add(value);
  }
  return list;
}

export function toArray<E>(list: List<E>): E[] {
  const values = [];
  for (let i = 0; i < list.size(); ++i) {
    values.push(list.getAtIndex(i));
  }
  return values;
}
