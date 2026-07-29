'use client';

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';

type StoreListener = () => void;

type LocalStorageStore = {
  key: string;
  rawValue: string | null;
  value: unknown;
  isInitialized: boolean;
  listeners: Set<StoreListener>;
  removeStorageListener: (() => void) | null;
};

const stores = new Map<string, LocalStorageStore>();

function getStore(key: string): LocalStorageStore {
  const existingStore = stores.get(key);

  if (existingStore) {
    return existingStore;
  }

  const store: LocalStorageStore = {
    key,
    rawValue: null,
    value: undefined,
    isInitialized: false,
    listeners: new Set(),
    removeStorageListener: null,
  };
  stores.set(key, store);
  return store;
}

function parseStoredValue<T>(key: string, rawValue: string | null, initialValue: T): T {
  if (rawValue === null) {
    return initialValue;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch (error) {
    console.warn(`[useLocalStorageState] failed to read "${key}"`, error);
    return initialValue;
  }
}

function readStoreValue<T>(store: LocalStorageStore, initialValue: T): T {
  let rawValue: string | null;

  try {
    rawValue = window.localStorage.getItem(store.key);
  } catch (error) {
    console.warn(`[useLocalStorageState] failed to read "${store.key}"`, error);
    return store.isInitialized ? (store.value as T) : initialValue;
  }

  if (store.isInitialized && rawValue === store.rawValue) {
    return store.value as T;
  }

  store.rawValue = rawValue;
  store.value = parseStoredValue(store.key, rawValue, initialValue);
  store.isInitialized = true;
  return store.value as T;
}

function writeStoreValue<T>(store: LocalStorageStore, value: T) {
  let rawValue: string | null = store.rawValue;

  try {
    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      throw new TypeError('value is not JSON-serializable');
    }

    window.localStorage.setItem(store.key, serializedValue);
    rawValue = serializedValue;
  } catch (error) {
    console.warn(`[useLocalStorageState] failed to write "${store.key}"`, error);
  }

  store.rawValue = rawValue;
  store.value = value;
  store.isInitialized = true;

  for (const listener of store.listeners) {
    listener();
  }
}

function subscribeToStore<T>(store: LocalStorageStore, initialValue: T, listener: StoreListener) {
  store.listeners.add(listener);

  if (!store.removeStorageListener) {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== store.key) {
        return;
      }

      store.rawValue = event.newValue;
      store.value = parseStoredValue(store.key, event.newValue, initialValue);
      store.isInitialized = true;

      for (const storeListener of store.listeners) {
        storeListener();
      }
    };

    window.addEventListener('storage', onStorage);
    store.removeStorageListener = () => {
      window.removeEventListener('storage', onStorage);
    };
  }

  return () => {
    store.listeners.delete(listener);

    if (store.listeners.size === 0) {
      store.removeStorageListener?.();
      store.removeStorageListener = null;
    }
  };
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const store = useMemo(() => getStore(key), [key]);
  const subscribe = useCallback(
    (listener: StoreListener) => subscribeToStore(store, initialValue, listener),
    [initialValue, store],
  );
  const getSnapshot = useCallback(() => readStoreValue(store, initialValue), [initialValue, store]);
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setStoredValue = useCallback<Dispatch<SetStateAction<T>>>(
    (action) => {
      const previous = readStoreValue(store, initialValue);
      const next = typeof action === 'function' ? (action as (prev: T) => T)(previous) : action;
      writeStoreValue(store, next);
    },
    [initialValue, store],
  );

  return [value, setStoredValue];
}
