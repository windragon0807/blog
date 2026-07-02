import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'emoticons', 'manifest.json')
const TOSSFACE_METADATA_PATH = path.join(
  ROOT,
  'scripts',
  'data',
  'tossface-metadata.json'
)
const RYONG_METADATA_PATH = path.join(
  ROOT,
  'scripts',
  'data',
  'ryong-metadata.json'
)

const COLLECTIONS = [
  {
    id: 'material',
    name: 'Material',
    sourceDir: path.join(PUBLIC_DIR, 'emoticons', 'material'),
    publicBase: '/emoticons/material',
    sourceLabel: 'Material Icon Theme',
  },
  {
    id: 'tossface',
    name: 'Tossface',
    sourceDir: path.join(PUBLIC_DIR, 'emoticons', 'tossface'),
    publicBase: '/emoticons/tossface',
    sourceLabel: 'Tossface',
  },
  {
    id: 'ryong',
    name: 'Ryong',
    sourceDir: path.join(PUBLIC_DIR, 'emoticons', 'ryong'),
    publicBase: '/emoticons/ryong',
    sourceLabel: 'Ryong',
  },
]

function toTitle(filename) {
  return filename
    .replace(/\.svg$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toId(collectionId, filename) {
  return `${collectionId}-${filename
    .replace(/\.svg$/i, '')
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()}`
}

function toPublicPath(base, filename) {
  return `${base}/${encodeURIComponent(filename)}`
}

function readTossfaceMetadata() {
  if (!fs.existsSync(TOSSFACE_METADATA_PATH)) {
    return new Map()
  }

  const metadata = JSON.parse(fs.readFileSync(TOSSFACE_METADATA_PATH, 'utf8'))

  return new Map(
    metadata.map((item) => [
      item.name,
      {
        category: item.category,
        order: item.order,
      },
    ])
  )
}

function readRyongMetadata() {
  if (!fs.existsSync(RYONG_METADATA_PATH)) {
    return new Map()
  }

  const metadata = JSON.parse(fs.readFileSync(RYONG_METADATA_PATH, 'utf8'))

  return new Map(
    metadata.map((item) => [
      item.filename,
      {
        name: item.name,
        category: item.category,
        order: item.order,
      },
    ])
  )
}

const tossfaceMetadataByName = readTossfaceMetadata()
const ryongMetadataByFilename = readRyongMetadata()

function readCollection(collection) {
  if (!fs.existsSync(collection.sourceDir)) {
    throw new Error(`Missing emoticon source directory: ${collection.sourceDir}`)
  }

  const items = fs
    .readdirSync(collection.sourceDir)
    .filter((filename) => filename.toLowerCase().endsWith('.svg'))
    .sort((a, b) => a.localeCompare(b, 'ko'))
    .map((filename) => {
      const name = toTitle(filename)
      const metadata =
        collection.id === 'tossface'
          ? tossfaceMetadataByName.get(name)
          : collection.id === 'ryong'
            ? ryongMetadataByFilename.get(filename)
            : null
      const pngFilename = filename.replace(/\.svg$/i, '.png')
      const pngPath = path.join(collection.sourceDir, pngFilename)

      return {
        id: toId(collection.id, filename),
        name: metadata?.name ?? name,
        filename,
        src: toPublicPath(collection.publicBase, filename),
        ...(fs.existsSync(pngPath)
          ? {
              pngSrc: toPublicPath(collection.publicBase, pngFilename),
            }
          : {}),
        ...(metadata
          ? {
              category: metadata.category,
              order: metadata.order,
            }
          : {}),
      }
    })

  return {
    id: collection.id,
    name: collection.name,
    sourceLabel: collection.sourceLabel,
    count: items.length,
    items,
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  collections: COLLECTIONS.map(readCollection),
}

fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(
  `Generated ${MANIFEST_PATH} with ${manifest.collections
    .map((collection) => `${collection.name}: ${collection.count}`)
    .join(', ')}`
)
