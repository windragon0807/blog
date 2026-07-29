'use client';

import { useEffect, useMemo } from 'react';

import { useLocalStorageState } from '@/hooks/useLocalStorageState';

import {
  EMOTICON_FAVORITES_STORAGE_KEY,
  type EmoticonFavoriteEntry,
  getSourceCollectionIdFromEntries,
  isFavoriteEntry,
  parseFavoriteEntries,
  resolveFavoriteItems,
  toggleFavoriteEntry,
} from '../model/emoticon-favorites';
import type { EmoticonItem, EmoticonManifest, EmoticonSourceCollectionId } from '../types';

const EMPTY_FAVORITES: EmoticonFavoriteEntry[] = [];

export function useEmoticonFavorites(manifest: EmoticonManifest | undefined): {
  entries: EmoticonFavoriteEntry[];
  items: EmoticonItem[];
  isFavorite: (collectionId: EmoticonSourceCollectionId, itemId: string) => boolean;
  toggleFavorite: (collectionId: EmoticonSourceCollectionId, itemId: string) => void;
  getSourceCollectionId: (itemId: string) => EmoticonSourceCollectionId | null;
} {
  const [rawEntries, setRawEntries] = useLocalStorageState<unknown>(
    EMOTICON_FAVORITES_STORAGE_KEY,
    EMPTY_FAVORITES,
  );

  const entries = useMemo(() => {
    return parseFavoriteEntries(rawEntries);
  }, [rawEntries]);

  const { items, prunedEntries } = useMemo(() => {
    return resolveFavoriteItems(entries, manifest);
  }, [entries, manifest]);

  useEffect(() => {
    if (!manifest) {
      return;
    }

    if (
      prunedEntries.length === entries.length &&
      prunedEntries.every(
        (entry, index) =>
          entry.collectionId === entries[index]?.collectionId &&
          entry.itemId === entries[index]?.itemId &&
          entry.addedAt === entries[index]?.addedAt,
      )
    ) {
      return;
    }

    setRawEntries(prunedEntries);
  }, [entries, manifest, prunedEntries, setRawEntries]);

  return {
    entries,
    items,
    isFavorite: (collectionId, itemId) => {
      return isFavoriteEntry(entries, collectionId, itemId);
    },
    toggleFavorite: (collectionId, itemId) => {
      setRawEntries((previous: unknown) => {
        const current = parseFavoriteEntries(previous);
        return toggleFavoriteEntry(current, collectionId, itemId, Date.now());
      });
    },
    getSourceCollectionId: (itemId) => {
      return getSourceCollectionIdFromEntries(entries, itemId);
    },
  };
}
