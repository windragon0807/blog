import type { EmoticonGridSection } from './prepare-collections'

export function normalizeEmoticonSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, '').toLowerCase()
}

export function filterEmoticonSections(
  sections: EmoticonGridSection[],
  query: string
): EmoticonGridSection[] {
  const normalizedQuery = normalizeEmoticonSearchQuery(query)

  if (!normalizedQuery) {
    return sections
  }

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        normalizeEmoticonSearchQuery(item.name).includes(normalizedQuery)
      ),
    }))
    .filter((section) => section.items.length > 0)
}
