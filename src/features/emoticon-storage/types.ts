export type EmoticonCollectionId = 'material' | 'tossface' | 'ryong'

export type EmoticonItem = {
  id: string
  name: string
  filename: string
  src: string
  pngSrc?: string
  category?: string
  order?: number
}

export type EmoticonCollection = {
  id: EmoticonCollectionId
  name: string
  sourceLabel: string
  count: number
  items: EmoticonItem[]
}

export type EmoticonManifest = {
  generatedAt: string
  collections: EmoticonCollection[]
}
