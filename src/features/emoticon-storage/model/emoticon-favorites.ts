import type { EmoticonItem, EmoticonManifest, EmoticonSourceCollectionId } from '../types';

export const EMOTICON_FAVORITES_STORAGE_KEY = 'emoticon-favorites';

export type EmoticonFavoriteEntry = {
  collectionId: EmoticonSourceCollectionId;
  itemId: string;
  addedAt: number;
};

const SOURCE_COLLECTION_IDS = new Set<EmoticonSourceCollectionId>([
  'material',
  'tossface',
  'ryong',
]);

function isSourceCollectionId(value: unknown): value is EmoticonSourceCollectionId {
  return (
    typeof value === 'string' && SOURCE_COLLECTION_IDS.has(value as EmoticonSourceCollectionId)
  );
}

export function parseFavoriteEntries(value: unknown): EmoticonFavoriteEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: EmoticonFavoriteEntry[] = [];

  for (const candidate of value) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }

    const collectionId = (candidate as { collectionId?: unknown }).collectionId;
    const itemId = (candidate as { itemId?: unknown }).itemId;
    const addedAt = (candidate as { addedAt?: unknown }).addedAt;

    if (
      !isSourceCollectionId(collectionId) ||
      typeof itemId !== 'string' ||
      itemId.length === 0 ||
      typeof addedAt !== 'number' ||
      !Number.isFinite(addedAt)
    ) {
      continue;
    }

    entries.push({ collectionId, itemId, addedAt });
  }

  return entries;
}

export function isFavoriteEntry(
  entries: readonly EmoticonFavoriteEntry[],
  collectionId: EmoticonSourceCollectionId,
  itemId: string,
) {
  return entries.some((entry) => entry.collectionId === collectionId && entry.itemId === itemId);
}

export function getSourceCollectionIdFromEntries(
  entries: readonly EmoticonFavoriteEntry[],
  itemId: string,
): EmoticonSourceCollectionId | null {
  return entries.find((entry) => entry.itemId === itemId)?.collectionId ?? null;
}

export function toggleFavoriteEntry(
  entries: readonly EmoticonFavoriteEntry[],
  collectionId: EmoticonSourceCollectionId,
  itemId: string,
  now: number,
): EmoticonFavoriteEntry[] {
  if (isFavoriteEntry(entries, collectionId, itemId)) {
    return entries.filter(
      (entry) => !(entry.collectionId === collectionId && entry.itemId === itemId),
    );
  }

  return [{ collectionId, itemId, addedAt: now }, ...entries];
}

export function resolveFavoriteItems(
  entries: readonly EmoticonFavoriteEntry[],
  manifest: EmoticonManifest | undefined,
): {
  items: EmoticonItem[];
  prunedEntries: EmoticonFavoriteEntry[];
} {
  if (!manifest) {
    return { items: [], prunedEntries: [...entries] };
  }

  const itemByKey = new Map<string, EmoticonItem>();

  for (const collection of manifest.collections) {
    if (collection.id === 'favorites') {
      continue;
    }

    for (const item of collection.items) {
      itemByKey.set(`${collection.id}:${item.id}`, item);
    }
  }

  const sorted = [...entries].sort((a, b) => b.addedAt - a.addedAt);
  const items: EmoticonItem[] = [];
  const prunedEntries: EmoticonFavoriteEntry[] = [];

  for (const entry of sorted) {
    const item = itemByKey.get(`${entry.collectionId}:${entry.itemId}`);

    if (!item) {
      continue;
    }

    items.push(item);
    prunedEntries.push(entry);
  }

  return { items, prunedEntries };
}
