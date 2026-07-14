import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildEmoticonManifest,
  serializeEmoticonManifest,
} from './emoticon-manifest-builder.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = path.join(ROOT, 'public', 'emoticons', 'manifest.json')

const fileSystem = {
  exists(filePath) {
    return fs.existsSync(path.join(ROOT, filePath))
  },
  readDirectory(filePath) {
    return fs.readdirSync(path.join(ROOT, filePath))
  },
  readText(filePath) {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf8')
  },
}

const manifest = buildEmoticonManifest({
  fileSystem,
  clock: { now: () => new Date() },
})

fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
fs.writeFileSync(MANIFEST_PATH, serializeEmoticonManifest(manifest))
console.log(
  `Generated ${MANIFEST_PATH} with ${manifest.collections
    .map((collection) => `${collection.name}: ${collection.count}`)
    .join(', ')}`
)
