import type { EmoticonCollection, EmoticonCollectionId, EmoticonItem } from '../types'
import {
  TOSSFACE_ACTIVITY_ORDER,
  TOSSFACE_FOOD_ORDER,
  getExactOrderIndex,
  getItemSubcategory,
  getTossfaceDisplayRank,
} from './tossface-taxonomy'

export type EmoticonGridSection = {
  id: string
  label: string
  items: EmoticonItem[]
}

export type PreparedEmoticonCollection = {
  collection: EmoticonCollection
  sectionsBySubcategory: Map<string, EmoticonGridSection>
}

export function sortDisplayItems({
  collectionId,
  subcategoryId,
  items,
}: {
  collectionId: EmoticonCollectionId
  subcategoryId: string
  items: EmoticonItem[]
}) {
  if (collectionId !== 'tossface') {
    return items
  }

  const orderedItems = items.every((item) => typeof item.order === 'number')

  if (orderedItems) {
    return [...items].sort((a, b) => {
      return (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER)
    })
  }

  const order =
    subcategoryId === 'food-drink'
      ? TOSSFACE_FOOD_ORDER
      : subcategoryId === 'activity'
        ? TOSSFACE_ACTIVITY_ORDER
        : null

  return [...items].sort((a, b) => {
    if (order) {
      const aIndex = getExactOrderIndex(a.name, order)
      const bIndex = getExactOrderIndex(b.name, order)

      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
          (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
      }
    }

    const rankDiff =
      getTossfaceDisplayRank(subcategoryId, a) -
      getTossfaceDisplayRank(subcategoryId, b)

    if (rankDiff !== 0) {
      return rankDiff
    }

    return a.name.localeCompare(b.name, 'ko')
  })
}

export function prepareEmoticonCollection(
  collection: EmoticonCollection,
  subcategories: readonly { id: string; label: string }[]
): PreparedEmoticonCollection {
  const sectionsBySubcategory = new Map<string, EmoticonGridSection>()
  const visibleSubcategories = subcategories.filter(
    (subcategory) => subcategory.id !== 'all'
  )

  for (const subcategory of visibleSubcategories) {
    sectionsBySubcategory.set(subcategory.id, {
      id: subcategory.id,
      label: subcategory.label,
      items: [],
    })
  }

  for (const item of collection.items) {
    const subcategoryId = getItemSubcategory(collection.id, item)
    const section = sectionsBySubcategory.get(subcategoryId)

    if (section) {
      section.items.push(item)
    }
  }

  for (const section of sectionsBySubcategory.values()) {
    section.items = sortDisplayItems({
      collectionId: collection.id,
      subcategoryId: section.id,
      items: section.items,
    })
  }

  return {
    collection,
    sectionsBySubcategory,
  }
}
