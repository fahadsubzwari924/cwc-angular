import { computed, Signal } from '@angular/core';

/**
 * Creates a computed signal that filters items based on a predicate.
 * Recomputes when source or filter signal changes.
 */
export function createFilteredSignal<T>(
  source: Signal<T[]>,
  filterFn: (item: T) => boolean
): Signal<T[]> {
  return computed(() => source().filter(filterFn));
}

/**
 * Creates a computed signal that returns sorted copy of items.
 * Recomputes when source or sortKey/sortOrder changes.
 */
export function createSortedSignal<T>(
  source: Signal<T[]>,
  sortKey: Signal<string>,
  sortOrder: Signal<'asc' | 'desc'>
): Signal<T[]> {
  return computed(() => {
    const items = [...source()];
    const key = sortKey();
    const order = sortOrder();
    if (!key) return items;
    items.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[key] as number | string;
      const bVal = (b as Record<string, unknown>)[key] as number | string;
      if (aVal === bVal) return 0;
      const cmp = aVal < bVal ? -1 : 1;
      return order === 'asc' ? cmp : -cmp;
    });
    return items;
  });
}

/**
 * Converts an object signal to an array of [key, value] for iteration (replaces keyvalue pipe).
 * Recomputes when source object reference or keys change.
 */
export function createKeyValueArraySignal<T extends Record<string, unknown>>(
  source: Signal<T | null | undefined>
): Signal<Array<{ key: string; value: unknown }>> {
  return computed(() => {
    const obj = source();
    if (obj == null) return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  });
}
