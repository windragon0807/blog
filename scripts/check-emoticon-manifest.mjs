import assert from 'node:assert/strict'
import {
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  DEFAULT_COLLECTIONS,
  DEFAULT_METADATA_PATHS,
  DEFAULT_OWNER_MAP,
  auditEmoticonManifest,
  buildEmoticonManifest,
  serializeEmoticonManifest,
} from './emoticon-manifest-builder.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = 'public/emoticons/manifest.json'

function normalize(filePath) {
  return filePath.split(path.sep).join('/')
}

function createNodeFileSystem(root) {
  function absolute(filePath) {
    return path.resolve(root, filePath)
  }

  return {
    exists(filePath) {
      try {
        lstatSync(absolute(filePath))
        return true
      } catch (error) {
        if (error?.code === 'ENOENT') return false
        throw error
      }
    },
    lstat(filePath) {
      const stats = lstatSync(absolute(filePath))
      return {
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        isSymbolicLink: stats.isSymbolicLink(),
      }
    },
    readDirectory(filePath) {
      return readdirSync(absolute(filePath))
    },
    readText(filePath) {
      return readFileSync(absolute(filePath), 'utf8')
    },
    realpath(filePath) {
      return normalize(realpathSync(absolute(filePath)))
    },
    resolve(filePath) {
      return normalize(absolute(filePath))
    },
  }
}

function createMemoryFileSystem(initialEntries) {
  const entries = new Map(
    Object.entries(initialEntries).map(([filePath, entry]) => [
      normalize(filePath),
      typeof entry === 'string' ? { type: 'file', content: entry } : structuredClone(entry),
    ])
  )

  function entryAt(filePath) {
    const entry = entries.get(normalize(filePath))
    if (!entry) {
      const error = new Error(`ENOENT: ${filePath}`)
      error.code = 'ENOENT'
      throw error
    }
    return entry
  }

  const fileSystem = {
    exists(filePath) {
      return entries.has(normalize(filePath))
    },
    lstat(filePath) {
      const entry = entryAt(filePath)
      return {
        isDirectory: entry.type === 'directory',
        isFile: entry.type === 'file',
        isSymbolicLink: entry.type === 'symlink',
      }
    },
    readDirectory(filePath) {
      const directory = normalize(filePath).replace(/\/$/, '')
      assert.equal(entryAt(directory).type, 'directory')
      const prefix = `${directory}/`
      return [...entries.keys()]
        .filter((candidate) => candidate.startsWith(prefix))
        .map((candidate) => candidate.slice(prefix.length))
        .filter((candidate) => candidate && !candidate.includes('/'))
    },
    readText(filePath) {
      const entry = entryAt(filePath)
      assert.equal(entry.type, 'file')
      return entry.content
    },
    realpath(filePath) {
      const normalized = normalize(filePath)
      const entry = entryAt(normalized)
      if (entry.type === 'symlink') return normalize(entry.target)
      if (entry.realpath) return normalize(entry.realpath)
      return `/repo/${normalized}`
    },
    resolve(filePath) {
      const normalized = path.posix.normalize(normalize(filePath))
      return normalized === '.' ? '/repo' : `/repo/${normalized}`
    },
  }

  return {
    entries,
    fileSystem,
    clone() {
      return createMemoryFileSystem(Object.fromEntries(entries))
    },
  }
}

function fixture() {
  const collections = [
    {
      id: 'material',
      name: 'Material',
      sourceDir: 'public/emoticons/material',
      publicBase: '/emoticons/material',
      sourceLabel: 'Material Icon Theme',
    },
    {
      id: 'tossface',
      name: 'Tossface',
      sourceDir: 'public/emoticons/tossface',
      publicBase: '/emoticons/tossface',
      sourceLabel: 'Tossface',
    },
    {
      id: 'ryong',
      name: 'Ryong',
      sourceDir: 'public/emoticons/ryong',
      publicBase: '/emoticons/ryong',
      sourceLabel: 'Ryong',
    },
  ]
  const metadataPaths = {
    tossface: 'scripts/data/tossface-metadata.json',
    ryong: 'scripts/data/ryong-metadata.json',
  }
  const ownerMap = {
    publicRoot: 'public/emoticons',
    directories: [
      {
        owner: 'builder:material',
        path: 'public/emoticons/material',
        extensions: ['.svg'],
      },
      {
        owner: 'builder:tossface',
        path: 'public/emoticons/tossface',
        extensions: ['.svg'],
      },
      {
        owner: 'builder:ryong',
        path: 'public/emoticons/ryong',
        extensions: ['.png', '.svg'],
      },
      {
        owner: 'static:logos',
        path: 'public/emoticons/logos',
        exactFiles: ['material-icon-theme.png', 'toss-symbol.png'],
      },
    ],
    files: [
      { owner: 'checked:manifest', path: MANIFEST_PATH },
      { owner: 'static:material-license', path: 'public/emoticons/material-LICENSE.txt' },
      { owner: 'static:tossface-license', path: 'public/emoticons/tossface-LICENSE.txt' },
      { owner: 'metadata:tossface', path: metadataPaths.tossface },
      { owner: 'metadata:ryong', path: metadataPaths.ryong },
    ],
  }
  const memory = createMemoryFileSystem({
    public: { type: 'directory' },
    'public/emoticons': { type: 'directory' },
    'public/emoticons/material': { type: 'directory' },
    'public/emoticons/material/z.svg': '<svg/>',
    'public/emoticons/tossface': { type: 'directory' },
    'public/emoticons/tossface/A.svg': '<svg/>',
    'public/emoticons/tossface/나.svg': '<svg/>',
    'public/emoticons/tossface/가.svg': '<svg/>',
    'public/emoticons/ryong': { type: 'directory' },
    'public/emoticons/ryong/체크.svg': '<svg/>',
    'public/emoticons/ryong/체크.png': 'png',
    'public/emoticons/logos': { type: 'directory' },
    'public/emoticons/logos/material-icon-theme.png': 'logo',
    'public/emoticons/logos/toss-symbol.png': 'logo',
    'public/emoticons/material-LICENSE.txt': 'license',
    'public/emoticons/tossface-LICENSE.txt': 'license',
    scripts: { type: 'directory' },
    'scripts/data': { type: 'directory' },
    [metadataPaths.tossface]: JSON.stringify([
      { name: 'A', category: 'symbols', order: 2 },
      { name: '가', category: 'symbols', order: 0 },
      { name: '나', category: 'symbols', order: 1 },
    ]),
    [metadataPaths.ryong]: JSON.stringify([
      { filename: '체크.svg', name: '체크', category: 'favorites', order: 0 },
    ]),
  })
  const generatedAt = '2026-07-02T01:25:56.980Z'
  const payload = buildEmoticonManifest({
    fileSystem: memory.fileSystem,
    clock: { now: () => new Date(generatedAt) },
    collections,
    metadataPaths,
  })
  memory.entries.set(MANIFEST_PATH, {
    type: 'file',
    content: serializeEmoticonManifest(payload),
  })
  return { collections, generatedAt, memory, metadataPaths, ownerMap, payload }
}

function auditFixture(value) {
  const manifestText = value.memory.fileSystem.readText(MANIFEST_PATH)
  return auditEmoticonManifest({
    fileSystem: value.memory.fileSystem,
    clock: { now: () => new Date(value.generatedAt) },
    collections: value.collections,
    metadataPaths: value.metadataPaths,
    ownerMap: value.ownerMap,
    manifestText,
  })
}

function assertError(result, code) {
  assert.ok(result.errors.some((error) => error === code || error.startsWith(`${code}:`)), code)
}

function replaceManifest(value, manifest) {
  value.memory.entries.get(MANIFEST_PATH).content = serializeEmoticonManifest(manifest)
}

function runSelfTests() {
  const base = fixture()
  const baseResult = auditFixture(base)
  assert.deepEqual(baseResult.errors, [])
  assert.equal(baseResult.manifestText, serializeEmoticonManifest(base.payload))

  const rawTossfaceOrder = base.memory.fileSystem.readDirectory(
    'public/emoticons/tossface'
  )
  assert.deepEqual(rawTossfaceOrder, ['A.svg', '나.svg', '가.svg'])
  assert.deepEqual([...rawTossfaceOrder].sort(), ['A.svg', '가.svg', '나.svg'])
  const tossItems = base.payload.collections.find((collection) => collection.id === 'tossface').items
  assert.deepEqual(tossItems.map((item) => item.filename), ['가.svg', '나.svg', 'A.svg'])
  assert.notDeepEqual(
    tossItems.map((item) => item.filename),
    [...rawTossfaceOrder].sort()
  )
  assert.equal(tossItems[0].id, 'tossface-가')
  assert.equal(tossItems[0].src, '/emoticons/tossface/%EA%B0%80.svg')
  assert.equal(
    base.payload.collections.find((collection) => collection.id === 'ryong').items[0].pngSrc,
    '/emoticons/ryong/%EC%B2%B4%ED%81%AC.png'
  )

  const missing = fixture()
  missing.memory.entries.delete('public/emoticons/material/z.svg')
  assertError(auditFixture(missing), 'MISSING_REFERENCED_SOURCE')

  const extra = fixture()
  extra.memory.entries.set('public/emoticons/material/extra.svg', {
    type: 'file',
    content: '<svg/>',
  })
  assertError(auditFixture(extra), 'UNREFERENCED_SOURCE')

  const duplicate = fixture()
  const duplicateManifest = structuredClone(duplicate.payload)
  duplicateManifest.collections[0].items.push(duplicateManifest.collections[0].items[0])
  duplicateManifest.collections[0].count += 1
  replaceManifest(duplicate, duplicateManifest)
  assertError(auditFixture(duplicate), 'DUPLICATE_ID')

  const duplicateSource = fixture()
  const duplicateSourceManifest = structuredClone(duplicateSource.payload)
  duplicateSourceManifest.collections[1].items[1].src =
    duplicateSourceManifest.collections[1].items[0].src
  replaceManifest(duplicateSource, duplicateSourceManifest)
  assertError(auditFixture(duplicateSource), 'DUPLICATE_SOURCE')

  const collision = fixture()
  collision.memory.entries.set('public/emoticons/material/a-b.svg', {
    type: 'file',
    content: '<svg/>',
  })
  collision.memory.entries.set('public/emoticons/material/a_b.svg', {
    type: 'file',
    content: '<svg/>',
  })
  assert.throws(
    () =>
      buildEmoticonManifest({
        fileSystem: collision.memory.fileSystem,
        clock: { now: () => new Date(collision.generatedAt) },
        collections: collision.collections,
        metadataPaths: collision.metadataPaths,
      }),
    /GENERATED_ID_COLLISION/
  )

  const traversal = fixture()
  const traversalManifest = structuredClone(traversal.payload)
  traversalManifest.collections[0].items[0].src =
    '/emoticons/material/%2E%2E/tossface/%EA%B0%80.svg'
  replaceManifest(traversal, traversalManifest)
  assertError(auditFixture(traversal), 'SOURCE_TRAVERSAL')

  const rawTraversal = fixture()
  const readDirectory = rawTraversal.memory.fileSystem.readDirectory
  rawTraversal.memory.fileSystem.readDirectory = (filePath) =>
    filePath === 'public/emoticons/material'
      ? ['../escape.svg', ...readDirectory(filePath)]
      : readDirectory(filePath)
  assertError(auditFixture(rawTraversal), 'SOURCE_FILENAME_TRAVERSAL')

  const symlink = fixture()
  symlink.memory.entries.set('public/emoticons/material/z.svg', {
    type: 'symlink',
    target: '/outside/z.svg',
  })
  assertError(auditFixture(symlink), 'SYMLINK')

  const realpathEscape = fixture()
  realpathEscape.memory.entries.get('public/emoticons/material/z.svg').realpath =
    '/outside/z.svg'
  assertError(auditFixture(realpathEscape), 'REALPATH_ESCAPE')

  const owner = fixture()
  owner.ownerMap.directories.push({
    owner: 'builder:overlap',
    path: 'public/emoticons/material',
    extensions: ['.svg'],
  })
  assertError(auditFixture(owner), 'OWNER_OVERLAP')

  const maliciousExistingPath = fixture()
  maliciousExistingPath.collections[0] = {
    ...maliciousExistingPath.collections[0],
    sourceDir: 'public/emoticons/tossface',
    publicBase: '/emoticons/tossface',
  }
  assertError(auditFixture(maliciousExistingPath), 'COLLECTION_OWNER_BINDING')

  const maliciousCoupledPath = fixture()
  maliciousCoupledPath.collections[0] = {
    ...maliciousCoupledPath.collections[0],
    sourceDir: 'public/emoticons/tossface',
    publicBase: '/emoticons/tossface',
  }
  maliciousCoupledPath.ownerMap.directories[0].path = 'public/emoticons/tossface'
  assertError(auditFixture(maliciousCoupledPath), 'COLLECTION_OWNER_BINDING')

  const extensionBinding = fixture()
  extensionBinding.ownerMap.directories[0].extensions = ['.png', '.svg']
  assertError(auditFixture(extensionBinding), 'COLLECTION_OWNER_BINDING')

  const publicBaseBinding = fixture()
  publicBaseBinding.collections[0].publicBase = '/emoticons/tossface'
  assertError(auditFixture(publicBaseBinding), 'COLLECTION_OWNER_BINDING')

  const idBinding = fixture()
  idBinding.collections[0].id = 'material-renamed'
  assertError(auditFixture(idBinding), 'COLLECTION_OWNER_BINDING')

  const metadataBinding = fixture()
  metadataBinding.metadataPaths.tossface = metadataBinding.metadataPaths.ryong
  assertError(auditFixture(metadataBinding), 'METADATA_OWNER_BINDING')

  const maliciousMetadataBinding = fixture()
  maliciousMetadataBinding.metadataPaths.tossface = maliciousMetadataBinding.metadataPaths.ryong
  maliciousMetadataBinding.ownerMap.files.find(
    (descriptor) => descriptor.owner === 'metadata:tossface'
  ).path = maliciousMetadataBinding.metadataPaths.ryong
  assertError(auditFixture(maliciousMetadataBinding), 'METADATA_OWNER_BINDING')

  const extraOwner = fixture()
  extraOwner.ownerMap.directories.push({
    owner: 'builder:extra',
    path: 'scripts/data',
    extensions: ['.json'],
  })
  assertError(auditFixture(extraOwner), 'EXTRA_BUILDER_OWNER_DESCRIPTOR')

  const extraMetadataOwner = fixture()
  extraMetadataOwner.ownerMap.files.push({
    owner: 'metadata:extra',
    path: 'scripts/data/tossface-metadata.json',
  })
  assertError(auditFixture(extraMetadataOwner), 'EXTRA_METADATA_OWNER_DESCRIPTOR')

  const unboundOwner = fixture()
  unboundOwner.ownerMap.directories.push({
    owner: 'static:extra',
    path: 'scripts/data',
    extensions: ['.json'],
  })
  assertError(auditFixture(unboundOwner), 'EXTRA_OWNER_DESCRIPTOR')

  const extraMetadataPath = fixture()
  extraMetadataPath.metadataPaths.extra = 'scripts/data/ryong-metadata.json'
  assertError(auditFixture(extraMetadataPath), 'EXTRA_METADATA_PATH')

  const ownerKind = fixture()
  ownerKind.ownerMap.files[0].path = 'public/emoticons/logos'
  assertError(auditFixture(ownerKind), 'OWNER_KIND_MISMATCH')

  const sourceOwner = fixture()
  sourceOwner.ownerMap.directories[0].owner = 'builder:tossface'
  assertError(auditFixture(sourceOwner), 'SOURCE_OWNER_MISMATCH')

  const unowned = fixture()
  unowned.memory.entries.set('public/emoticons/unowned.txt', {
    type: 'file',
    content: 'extra',
  })
  assertError(auditFixture(unowned), 'UNOWNED_EXTRA')

  const byteDrift = fixture()
  const changedPayload = structuredClone(byteDrift.payload)
  changedPayload.collections[0].items[0].name = 'changed'
  replaceManifest(byteDrift, changedPayload)
  const byteResult = auditFixture(byteDrift)
  assertError(byteResult, 'MANIFEST_PAYLOAD_DRIFT')
  assertError(byteResult, 'MANIFEST_BYTE_DRIFT')

  const formatDrift = fixture()
  formatDrift.memory.entries.get(MANIFEST_PATH).content = JSON.stringify(formatDrift.payload)
  assertError(auditFixture(formatDrift), 'MANIFEST_FORMAT_DRIFT')

  for (const falsyRoot of [null, false, 0, '']) {
    const falsyManifest = fixture()
    falsyManifest.memory.entries.get(MANIFEST_PATH).content = JSON.stringify(falsyRoot)
    const falsyResult = auditFixture(falsyManifest)
    assertError(falsyResult, 'INVALID_MANIFEST_SCHEMA')
    assertError(falsyResult, 'MANIFEST_PAYLOAD_DRIFT')
    assertError(falsyResult, 'MANIFEST_BYTE_DRIFT')
  }

  const extraMetadataField = fixture()
  const extraMetadata = JSON.parse(
    extraMetadataField.memory.entries.get(extraMetadataField.metadataPaths.tossface).content
  )
  extraMetadata[0].extra = true
  extraMetadataField.memory.entries.get(extraMetadataField.metadataPaths.tossface).content =
    JSON.stringify(extraMetadata)
  assertError(auditFixture(extraMetadataField), 'INVALID_METADATA_FIELDS')

  const missingMetadataField = fixture()
  const missingMetadata = JSON.parse(
    missingMetadataField.memory.entries.get(missingMetadataField.metadataPaths.ryong).content
  )
  delete missingMetadata[0].name
  missingMetadataField.memory.entries.get(missingMetadataField.metadataPaths.ryong).content =
    JSON.stringify(missingMetadata)
  assertError(auditFixture(missingMetadataField), 'INVALID_METADATA_FIELDS')

  const invalidCategory = fixture()
  const invalidCategoryMetadata = JSON.parse(
    invalidCategory.memory.entries.get(invalidCategory.metadataPaths.tossface).content
  )
  invalidCategoryMetadata[0].category = { invalid: true }
  invalidCategory.memory.entries.get(invalidCategory.metadataPaths.tossface).content =
    JSON.stringify(invalidCategoryMetadata)
  const invalidCategoryManifest = structuredClone(invalidCategory.payload)
  invalidCategoryManifest.collections[1].items[0].category = { invalid: true }
  replaceManifest(invalidCategory, invalidCategoryManifest)
  const invalidCategoryResult = auditFixture(invalidCategory)
  assertError(invalidCategoryResult, 'INVALID_METADATA_CATEGORY')
  assertError(invalidCategoryResult, 'INVALID_ITEM_CATEGORY')

  const invalidOrder = fixture()
  const invalidOrderMetadata = JSON.parse(
    invalidOrder.memory.entries.get(invalidOrder.metadataPaths.tossface).content
  )
  invalidOrderMetadata[0].order = '0'
  invalidOrder.memory.entries.get(invalidOrder.metadataPaths.tossface).content =
    JSON.stringify(invalidOrderMetadata)
  const invalidOrderManifest = structuredClone(invalidOrder.payload)
  invalidOrderManifest.collections[1].items[0].order = '0'
  replaceManifest(invalidOrder, invalidOrderManifest)
  const invalidOrderResult = auditFixture(invalidOrder)
  assertError(invalidOrderResult, 'INVALID_METADATA_ORDER')
  assertError(invalidOrderResult, 'INVALID_ITEM_ORDER')

  const decimalOrder = fixture()
  const decimalOrderMetadata = JSON.parse(
    decimalOrder.memory.entries.get(decimalOrder.metadataPaths.tossface).content
  )
  decimalOrderMetadata[0].order = 0.5
  decimalOrder.memory.entries.get(decimalOrder.metadataPaths.tossface).content =
    JSON.stringify(decimalOrderMetadata)
  const decimalOrderManifest = structuredClone(decimalOrder.payload)
  decimalOrderManifest.collections[1].items.find((item) => item.name === 'A').order = 0.5
  replaceManifest(decimalOrder, decimalOrderManifest)
  assert.deepEqual(auditFixture(decimalOrder).errors, [])

  const emptyCategory = fixture()
  const emptyCategoryMetadata = JSON.parse(
    emptyCategory.memory.entries.get(emptyCategory.metadataPaths.tossface).content
  )
  emptyCategoryMetadata[0].category = ''
  emptyCategory.memory.entries.get(emptyCategory.metadataPaths.tossface).content =
    JSON.stringify(emptyCategoryMetadata)
  const emptyCategoryManifest = structuredClone(emptyCategory.payload)
  emptyCategoryManifest.collections[1].items[0].category = ''
  replaceManifest(emptyCategory, emptyCategoryManifest)
  const emptyCategoryResult = auditFixture(emptyCategory)
  assertError(emptyCategoryResult, 'INVALID_METADATA_CATEGORY')
  assertError(emptyCategoryResult, 'INVALID_ITEM_CATEGORY')

  const nonFiniteOrder = fixture()
  const nonFiniteOrderMetadata = JSON.parse(
    nonFiniteOrder.memory.entries.get(nonFiniteOrder.metadataPaths.tossface).content
  )
  nonFiniteOrderMetadata[0].order = null
  nonFiniteOrder.memory.entries.get(nonFiniteOrder.metadataPaths.tossface).content =
    JSON.stringify(nonFiniteOrderMetadata)
  const nonFiniteOrderManifest = structuredClone(nonFiniteOrder.payload)
  nonFiniteOrderManifest.collections[1].items[0].order = null
  replaceManifest(nonFiniteOrder, nonFiniteOrderManifest)
  const nonFiniteOrderResult = auditFixture(nonFiniteOrder)
  assertError(nonFiniteOrderResult, 'INVALID_METADATA_ORDER')
  assertError(nonFiniteOrderResult, 'INVALID_ITEM_ORDER')

  const invalidSchema = fixture()
  const invalidSchemaManifest = structuredClone(invalidSchema.payload)
  invalidSchemaManifest.generatedAt = 'not-an-iso-timestamp'
  invalidSchemaManifest.collections[0].id = 42
  invalidSchemaManifest.collections[0].name = { invalid: true }
  invalidSchemaManifest.collections[0].sourceLabel = ''
  invalidSchemaManifest.collections[0].items[0] = {
    ...invalidSchemaManifest.collections[0].items[0],
    id: 42,
    name: { invalid: true },
    filename: '../z.svg',
    src: 'https://example.com/z.svg',
  }
  replaceManifest(invalidSchema, invalidSchemaManifest)
  const invalidSchemaResult = auditFixture(invalidSchema)
  for (const code of [
    'INVALID_GENERATED_AT',
    'INVALID_COLLECTION_ID',
    'INVALID_COLLECTION_NAME',
    'INVALID_COLLECTION_SOURCE_LABEL',
    'INVALID_ITEM_ID',
    'INVALID_ITEM_NAME',
    'INVALID_ITEM_FILENAME',
    'INVALID_SOURCE_PATH',
  ]) {
    assertError(invalidSchemaResult, code)
  }

  const extraManifestFields = fixture()
  const extraFieldsManifest = structuredClone(extraManifestFields.payload)
  extraFieldsManifest.extra = true
  extraFieldsManifest.collections[0].extra = true
  extraFieldsManifest.collections[0].items[0].extra = true
  replaceManifest(extraManifestFields, extraFieldsManifest)
  const extraFieldsResult = auditFixture(extraManifestFields)
  assertError(extraFieldsResult, 'INVALID_MANIFEST_FIELDS')
  assertError(extraFieldsResult, 'INVALID_COLLECTION_FIELDS')
  assertError(extraFieldsResult, 'INVALID_ITEM_FIELDS')

  const nullSource = fixture()
  const nullSourceManifest = structuredClone(nullSource.payload)
  nullSourceManifest.collections[0].items[0].src = null
  replaceManifest(nullSource, nullSourceManifest)
  assertError(auditFixture(nullSource), 'INVALID_ITEM_SOURCE')

  console.log('PASS emoticon manifest deterministic self-mutants: 39/39')
}

function checkRepository() {
  const fileSystem = createNodeFileSystem(ROOT)
  const manifestText = fileSystem.readText(MANIFEST_PATH)
  const parsed = JSON.parse(manifestText)
  const result = auditEmoticonManifest({
    fileSystem,
    clock: { now: () => new Date(parsed.generatedAt) },
    collections: DEFAULT_COLLECTIONS,
    metadataPaths: DEFAULT_METADATA_PATHS,
    ownerMap: DEFAULT_OWNER_MAP,
    manifestText,
  })
  assert.deepEqual(result.errors, [], result.errors.join('\n'))
  console.log(
    `PASS emoticon manifest: ${result.payload.collections
      .map((collection) => `${collection.name} ${collection.count}`)
      .join(', ')}`
  )
}

const mode = process.argv[2]
if (mode === '--self-test') runSelfTests()
else if (mode === undefined) {
  runSelfTests()
  checkRepository()
} else {
  throw new Error('Usage: check-emoticon-manifest.mjs [--self-test]')
}
