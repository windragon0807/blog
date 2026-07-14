import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '../..')
const featureRoot = 'src/features/emoticon-storage'
const implementationPath = `${featureRoot}/emoticon-storage-page.tsx`
const controllerPath = `${featureRoot}/emoticon-storage-controller.tsx`
const layoutContractPath = `${featureRoot}/emoticon-layout-contract.ts`
const routePath = 'src/app/emoticons/page.tsx'
const headerPath = 'src/components/Header.tsx'
const manifestQueryPath = `${featureRoot}/emoticon-manifest-query.ts`
const manifestPrefetchHookPath = 'src/hooks/use-emoticon-manifest-prefetch.ts'
const manifestPath = 'public/emoticons/manifest.json'
const publicRoot = 'public/emoticons'

const expected = {
  manifestBytes: 1_738_801,
  manifestSha256: '6940cc02c1a3006b703c31de81e6bfc651a7e5741e539ed282d4a568e5f93a61',
  publicFileCount: 4_882,
  publicLogicalBytes: 13_064_527,
  publicInventorySha256: 'a59a9b1ef7db4c3fac01c11b065a5dd68e58d23d03259038115ae11e9c1bca7c',
  collectionOrder: ['material', 'tossface', 'ryong'],
  collectionCounts: { material: 1_134, tossface: 3_739, ryong: 2 },
  subcategoryOrder: {
    material: ['all', 'files', 'folders'],
    tossface: [
      'all',
      'smileys-people',
      'animals-nature',
      'food-drink',
      'activity',
      'travel-places',
      'objects',
      'symbols',
      'flags',
    ],
    ryong: ['all', 'favorites'],
  },
  catalogSha256: '789448983bb0333d968da723ce53f2bdc2ef4d5a3fb60f8c717930ee6ca246da',
  missingTossfaceFlags: [
    '깃발 스발바르제도 얀마웬섬',
    '깃발 왈리스 푸투나 제도',
    '깃발 콩고 브라자빌',
    '깃발 콩고 킨샤사',
  ],
  constants: {
    PNG_EXPORT_SIZE: '512',
    GRID_GAP: '10',
    GRID_EDGE_BLEED: '8',
    GRID_ROW_HEIGHT: '62',
    MOBILE_GRID_SECTION_HEADING_HEIGHT: '42',
    DESKTOP_GRID_SECTION_HEADING_HEIGHT: '74',
    MOBILE_CARD_MIN_WIDTH: '54',
    DESKTOP_CARD_MIN_WIDTH: '56',
    SHEET_EXIT_DURATION_MS: '180',
    ACTION_FEEDBACK_DURATION_MS: '1200',
    ACTION_SHEET_MAX_WIDTH: '540',
    GRID_OVERSCAN: '4',
    PREFETCH_ROW_LOOKAHEAD: '12',
    PREFETCH_ROW_LOOKBEHIND: '6',
    PREFETCH_CHUNK_SIZE: '8',
    BACKGROUND_PREFETCH_CHUNK_SIZE: '8',
    EAGER_ROW_BUFFER: '1',
  },
  sharedLayoutStrings: {
    EMOTICON_PAGE_SHELL_CLASS_NAME:
      'fixed inset-0 flex h-[100dvh] min-h-[100svh] flex-col overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[calc(6.5rem+env(safe-area-inset-top))] sm:pb-4 sm:pt-20 [min-height:-webkit-fill-available]',
    EMOTICON_CONTENT_CLASS_NAME:
      'mx-auto w-[min(1180px,calc(100vw-3rem))] sm:w-[min(1180px,calc(100vw-2rem))]',
  },
}

const requiredFutureModules = [
  `${featureRoot}/components/emoticon-action-sheet.tsx`,
  `${featureRoot}/components/emoticon-grid.tsx`,
  `${featureRoot}/components/emoticon-storage-skeleton.tsx`,
  controllerPath,
  layoutContractPath,
  `${featureRoot}/media/emoticon-media.ts`,
  `${featureRoot}/model/collection-config.tsx`,
  `${featureRoot}/model/prepare-collections.ts`,
  `${featureRoot}/model/tossface-taxonomy.ts`,
  `${featureRoot}/prefetch/emoticon-image-prefetch.ts`,
]

function normalize(filePath) {
  return filePath.split(sep).join('/')
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function readRaw(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8')
}

function resolveRuntimeSourcePath(relativePath, fileExists = existsSync) {
  if (
    relativePath === implementationPath &&
    fileExists(join(root, controllerPath))
  ) {
    return controllerPath
  }

  return relativePath
}

function read(relativePath) {
  return readRaw(resolveRuntimeSourcePath(relativePath))
}

function walkFiles(directory) {
  const result = []
  const absoluteRoot = realpathSync(join(root, directory))

  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      const absolutePath = join(current, entry.name)
      const relativePath = normalize(relative(root, absolutePath))
      const stats = lstatSync(absolutePath)
      assert.ok(!stats.isSymbolicLink(), `PUBLIC_SYMLINK: ${relativePath}`)
      const realPath = realpathSync(absolutePath)
      assert.ok(
        realPath === absoluteRoot || realPath.startsWith(`${absoluteRoot}${sep}`),
        `PUBLIC_ESCAPE: ${relativePath}`
      )
      if (entry.isDirectory()) walk(absolutePath)
      else if (entry.isFile()) result.push(relativePath)
    }
  }

  walk(absoluteRoot)
  return result
}

function publicInventory() {
  const entries = walkFiles(publicRoot).map((filePath) => {
    const bytes = readFileSync(join(root, filePath))
    return [filePath, { bytes: bytes.length, sha256: sha256(bytes) }]
  })
  return {
    entries: Object.fromEntries(entries),
    fileCount: entries.length,
    logicalBytes: entries.reduce((total, [, entry]) => total + entry.bytes, 0),
    sha256: sha256(JSON.stringify(Object.fromEntries(entries))),
  }
}

function validateManifest(manifestRaw, inventory) {
  const errors = []
  if (Buffer.byteLength(manifestRaw) !== expected.manifestBytes) errors.push('MANIFEST_BYTES')
  if (sha256(manifestRaw) !== expected.manifestSha256) errors.push('MANIFEST_HASH')

  let manifest
  try {
    manifest = JSON.parse(manifestRaw)
  } catch {
    return [...errors, 'MANIFEST_JSON']
  }

  const order = manifest.collections?.map((collection) => collection.id) ?? []
  if (JSON.stringify(order) !== JSON.stringify(expected.collectionOrder)) {
    errors.push('COLLECTION_ORDER')
  }

  const ids = new Set()
  const sources = new Set()
  let itemCount = 0
  for (const collection of manifest.collections ?? []) {
    const expectedCount = expected.collectionCounts[collection.id]
    if (collection.count !== expectedCount || collection.items?.length !== expectedCount) {
      errors.push(`COLLECTION_COUNT:${collection.id}`)
    }
    for (const item of collection.items ?? []) {
      itemCount += 1
      if (ids.has(item.id)) errors.push(`DUPLICATE_ID:${item.id}`)
      ids.add(item.id)
      for (const source of [item.src, item.pngSrc].filter(Boolean)) {
        if (sources.has(source)) errors.push(`DUPLICATE_SOURCE:${source}`)
        sources.add(source)
        let decoded
        try {
          decoded = decodeURIComponent(source)
        } catch {
          errors.push(`INVALID_SOURCE_ENCODING:${source}`)
          continue
        }
        const sourcePath = `public${decoded}`
        if (!inventory.entries[sourcePath]) errors.push(`MISSING_SOURCE:${source}`)
      }
    }
  }
  if (itemCount !== 4_875) errors.push('ITEM_COUNT')
  if (inventory.fileCount !== expected.publicFileCount) errors.push('PUBLIC_FILE_COUNT')
  if (inventory.logicalBytes !== expected.publicLogicalBytes) errors.push('PUBLIC_LOGICAL_BYTES')
  if (inventory.sha256 !== expected.publicInventorySha256) errors.push('PUBLIC_INVENTORY_HASH')
  return [...new Set(errors)].sort()
}

function itemCategory(collectionId, item) {
  if (collectionId === 'material') {
    return item.filename.startsWith('folder-') ? 'folders' : 'files'
  }
  if (collectionId === 'ryong') return item.category ?? 'favorites'
  if (item.category) return item.category
  if (item.name.includes('깃발')) return 'flags'
  return 'smileys-people'
}

function orderedSectionItems(collection, subcategoryId) {
  const items = collection.items.filter(
    (item) => itemCategory(collection.id, item) === subcategoryId
  )
  if (collection.id !== 'tossface') return items
  if (items.every((item) => typeof item.order === 'number')) {
    return [...items].sort((a, b) => a.order - b.order)
  }
  return [...items].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

function catalogSignature(manifest) {
  const result = {}
  for (const collection of manifest.collections) {
    const sections = expected.subcategoryOrder[collection.id]
      .filter((subcategory) => subcategory !== 'all')
      .map((subcategory) => {
        const items = orderedSectionItems(collection, subcategory)
        return {
          id: subcategory,
          count: items.length,
          first: items[0]?.id,
          last: items.at(-1)?.id,
          orderedIdsSha256: sha256(JSON.stringify(items.map((item) => item.id))),
        }
      })
    result[collection.id] = {
      sections,
      allOrderedIdsSha256: sha256(
        JSON.stringify(
          sections.flatMap((section) =>
            orderedSectionItems(collection, section.id).map((item) => item.id)
          )
        )
      ),
    }
  }
  return result
}

function sourceFilesFromDisk() {
  const files = new Map()
  function walk(directory) {
    for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
      const filePath = `${directory}/${entry.name}`
      if (entry.isDirectory()) walk(filePath)
      else if (/\.(?:ts|tsx)$/.test(entry.name)) files.set(filePath, readRaw(filePath))
    }
  }
  walk(featureRoot)
  return files
}

function repositorySourceFilesFromDisk() {
  const files = sourceFilesFromDisk()
  for (const filePath of [routePath, headerPath, manifestPrefetchHookPath]) {
    files.set(filePath, readRaw(filePath))
  }
  return files
}

function scriptKind(filePath) {
  return filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
}

function importsFor(filePath, source) {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(filePath)
  )
  const imports = []
  for (const statement of sourceFile.statements) {
    if (
      (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      imports.push(statement.moduleSpecifier.text)
    }
  }
  return imports
}

function resolveFeatureImport(owner, specifier) {
  if (specifier.startsWith('@/features/emoticon-storage/')) {
    return `${featureRoot}/${specifier.slice('@/features/emoticon-storage/'.length)}`
  }
  if (!specifier.startsWith('.') || !owner.startsWith(`${featureRoot}/`)) {
    return null
  }
  const base = normalize(resolve(dirname(owner), specifier))
  const rootPrefix = normalize(root)
  const relativeBase = base.startsWith(`${rootPrefix}/`) ? base.slice(rootPrefix.length + 1) : base
  return relativeBase
}

function resolveExistingModule(candidate, files) {
  for (const suffix of ['', '.ts', '.tsx']) {
    const value = `${candidate}${suffix}`
    if (files.has(value)) return value
  }
  for (const suffix of ['/index.ts', '/index.tsx']) {
    const value = `${candidate}${suffix}`
    if (files.has(value)) return value
  }
  return candidate
}

function isMonolith(source) {
  return (
    source.includes('function VirtualizedEmoticonGrid(') &&
    source.includes('function BottomActionSheet(') &&
    source.includes('function scheduleBackgroundEmoticonImageWarmup(')
  )
}

function constantValues(files) {
  const values = new Map()
  for (const source of files.values()) {
    const sourceFile = ts.createSourceFile('contract.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    for (const statement of sourceFile.statements) {
      if (!ts.isVariableStatement(statement)) continue
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue
        if (Object.hasOwn(expected.constants, declaration.name.text)) {
          const value = declaration.initializer.getText(sourceFile)
          if (values.has(declaration.name.text)) values.set(declaration.name.text, 'DUPLICATE')
          else values.set(declaration.name.text, value)
        }
      }
    }
  }
  return values
}

function subcategoryOrders(files) {
  const combined = [...files.values()].join('\n')
  const result = {}
  for (const [collectionId, declarationName] of [
    ['material', 'MATERIAL_SUBCATEGORIES'],
    ['tossface', 'TOSSFACE_SUBCATEGORIES'],
    ['ryong', 'RYONG_SUBCATEGORIES'],
  ]) {
    const match = combined.match(
      new RegExp(`const\\s+${declarationName}(?:[^=]*)=\\s*\\[([\\s\\S]*?)\\](?:\\s*as const)?`)
    )
    if (!match) {
      result[collectionId] = []
      continue
    }
    const ids = [...match[1].matchAll(/id\s*:\s*['"]([^'"]+)['"]/g)].map(
      (item) => item[1]
    )
    result[collectionId] = match[1].includes('ALL_SUBCATEGORY') ? ['all', ...ids] : ids
  }
  return result
}

function boundaryErrors(files) {
  const errors = []
  const facade = files.get(implementationPath)
  if (!facade) return ['MISSING_FACADE']
  const sourceFile = ts.createSourceFile(
    implementationPath,
    facade,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const first = sourceFile.statements[0]
  if (!first || !ts.isExpressionStatement(first) || first.expression.getText(sourceFile) !== "'use client'") {
    errors.push('MISSING_CLIENT_DIRECTIVE')
  }
  if (isMonolith(facade)) return [...errors, 'MONOLITH_NOT_MIGRATED'].sort()

  for (const modulePath of requiredFutureModules) {
    if (!files.has(modulePath)) errors.push(`MISSING_TARGET:${modulePath}`)
  }

  const route = files.get(routePath)
  if (!route) errors.push('MISSING_ROUTE')
  else {
    const featureImports = importsFor(routePath, route).filter((specifier) =>
      specifier.includes('features/emoticon-storage')
    )
    if (
      JSON.stringify(featureImports) !==
      JSON.stringify(['@/features/emoticon-storage/emoticon-storage-page'])
    ) {
      errors.push('ROUTE_IMPORT_BOUNDARY')
    }
  }

  const facadeImports = importsFor(implementationPath, facade)
  if (JSON.stringify(facadeImports) !== JSON.stringify(['./emoticon-storage-controller'])) {
    errors.push('FACADE_IMPORT_BOUNDARY')
  }

  const header = files.get(headerPath)
  if (!header) errors.push('MISSING_HEADER')
  else if (
    importsFor(headerPath, header).some((specifier) =>
      specifier.startsWith('@/features/emoticon-storage/')
    )
  ) {
    errors.push('HEADER_FEATURE_INTERNAL_IMPORT')
  }

  const hasQuery = files.has(manifestQueryPath)
  const hasHook = files.has(manifestPrefetchHookPath)
  if (hasQuery !== hasHook) errors.push('PARTIAL_MANIFEST_QUERY_BOUNDARY')
  if (hasHook) {
    const hookImports = importsFor(
      manifestPrefetchHookPath,
      files.get(manifestPrefetchHookPath)
    )
    if (!hookImports.includes('@/features/emoticon-storage/emoticon-manifest-query')) {
      errors.push('HOOK_QUERY_IMPORT_BOUNDARY')
    }
  }

  const ownerTokens = new Map([
    ['VirtualizedEmoticonGrid', `${featureRoot}/components/emoticon-grid.tsx`],
    ['BottomActionSheet', `${featureRoot}/components/emoticon-action-sheet.tsx`],
    ['prepareEmoticonCollection', `${featureRoot}/model/prepare-collections.ts`],
    ['scheduleBackgroundEmoticonImageWarmup', `${featureRoot}/prefetch/emoticon-image-prefetch.ts`],
    ['fetchSvgText', `${featureRoot}/media/emoticon-media.ts`],
  ])
  for (const [token, owner] of ownerTokens) {
    const owners = [...files].filter(([, source]) => source.includes(`function ${token}(`) || source.includes(`const ${token} =`)).map(([filePath]) => filePath)
    if (owners.length !== 1 || owners[0] !== owner) errors.push(`DUPLICATE_OR_WRONG_OWNER:${token}`)
  }

  const graph = new Map()
  for (const [filePath, source] of files) {
    const resolved = []
    for (const specifier of importsFor(filePath, source)) {
      if (specifier.startsWith('@/features/') && !specifier.startsWith('@/features/emoticon-storage/')) {
        errors.push(`CROSS_FEATURE_IMPORT:${filePath}:${specifier}`)
      }
      const candidate = resolveFeatureImport(filePath, specifier)
      if (!candidate) continue
      const target = resolveExistingModule(candidate, files)
      if (!files.has(target)) errors.push(`MISSING_IMPORT:${filePath}:${specifier}`)
      else resolved.push(target)
      if (
        (filePath.startsWith(`${featureRoot}/components/`) ||
          filePath.startsWith(`${featureRoot}/model/`) ||
          filePath.startsWith(`${featureRoot}/media/`) ||
          filePath.startsWith(`${featureRoot}/prefetch/`)) &&
        (target === implementationPath || target === controllerPath)
      ) {
        errors.push(`LEAF_IMPORTS_OWNER:${filePath}:${target}`)
      }
      if (
        !filePath.startsWith(`${featureRoot}/`) &&
        filePath !== routePath &&
        filePath !== manifestPrefetchHookPath &&
        target.startsWith(`${featureRoot}/`) &&
        target !== implementationPath
      ) {
        errors.push(`EXTERNAL_INTERNAL_IMPORT:${filePath}:${target}`)
      }
    }
    graph.set(filePath, resolved)
  }

  const visiting = new Set()
  const visited = new Set()
  function visit(filePath) {
    if (visiting.has(filePath)) {
      errors.push(`IMPORT_CYCLE:${filePath}`)
      return
    }
    if (visited.has(filePath)) return
    visiting.add(filePath)
    for (const target of graph.get(filePath) ?? []) visit(target)
    visiting.delete(filePath)
    visited.add(filePath)
  }
  for (const filePath of graph.keys()) visit(filePath)

  const constants = constantValues(files)
  for (const [name, value] of Object.entries(expected.constants)) {
    if (constants.get(name) !== value) errors.push(`CONSTANT:${name}`)
  }
  const categoryOrders = subcategoryOrders(files)
  for (const [collectionId, expectedOrder] of Object.entries(expected.subcategoryOrder)) {
    if (JSON.stringify(categoryOrders[collectionId]) !== JSON.stringify(expectedOrder)) {
      errors.push(`SUBCATEGORY_ORDER:${collectionId}`)
    }
  }
  for (const [name, value] of Object.entries(expected.sharedLayoutStrings)) {
    const owners = []
    for (const [filePath, source] of files) {
      const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.Latest,
        true,
        scriptKind(filePath)
      )
      for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) continue
        for (const declaration of statement.declarationList.declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === name &&
            declaration.initializer &&
            ts.isStringLiteralLike(declaration.initializer)
          ) {
            owners.push({ filePath, value: declaration.initializer.text })
          }
        }
      }
    }
    if (
      owners.length !== 1 ||
      owners[0].filePath !== layoutContractPath ||
      owners[0].value !== value
    ) {
      errors.push(`SHARED_LAYOUT_OWNER:${name}`)
    }
  }
  return [...new Set(errors)].sort()
}

function futureFixture() {
  const files = new Map()
  files.set(
    implementationPath,
    "'use client'\n\nexport { EmoticonStoragePage } from './emoticon-storage-controller'\n"
  )
  files.set(
    routePath,
    "import { EmoticonStoragePage } from '@/features/emoticon-storage/emoticon-storage-page'\nexport default function Page() { return null }\n"
  )
  files.set(headerPath, 'export function Header() { return null }\n')
  files.set(
    controllerPath,
    "import { VirtualizedEmoticonGrid } from './components/emoticon-grid'\nimport { BottomActionSheet } from './components/emoticon-action-sheet'\nexport function EmoticonStoragePage() { return null }\n"
  )
  files.set(
    layoutContractPath,
    `export const EMOTICON_PAGE_SHELL_CLASS_NAME = ${JSON.stringify(expected.sharedLayoutStrings.EMOTICON_PAGE_SHELL_CLASS_NAME)}\nexport const EMOTICON_CONTENT_CLASS_NAME = ${JSON.stringify(expected.sharedLayoutStrings.EMOTICON_CONTENT_CLASS_NAME)}\n`
  )
  files.set(
    `${featureRoot}/components/emoticon-grid.tsx`,
    "import { scheduleBackgroundEmoticonImageWarmup } from '../prefetch/emoticon-image-prefetch'\nexport function VirtualizedEmoticonGrid() { return null }\n"
  )
  files.set(
    `${featureRoot}/components/emoticon-action-sheet.tsx`,
    "export function BottomActionSheet() { return null }\n"
  )
  files.set(`${featureRoot}/components/emoticon-storage-skeleton.tsx`, 'export const EmoticonStorageSkeleton = null\n')
  files.set(
    `${featureRoot}/model/collection-config.tsx`,
    `const ALL_SUBCATEGORY = { id: 'all' }\nconst MATERIAL_SUBCATEGORIES = [ALL_SUBCATEGORY, { id: 'files' }, { id: 'folders' }]\nconst TOSSFACE_SUBCATEGORIES = [ALL_SUBCATEGORY, { id: 'smileys-people' }, { id: 'animals-nature' }, { id: 'food-drink' }, { id: 'activity' }, { id: 'travel-places' }, { id: 'objects' }, { id: 'symbols' }, { id: 'flags' }]\nconst RYONG_SUBCATEGORIES = [ALL_SUBCATEGORY, { id: 'favorites' }]\nexport const collectionConfig = []\n`
  )
  files.set(`${featureRoot}/model/tossface-taxonomy.ts`, 'export const tossfaceTaxonomy = []\n')
  files.set(
    `${featureRoot}/model/prepare-collections.ts`,
    'export function prepareEmoticonCollection() { return null }\n'
  )
  files.set(
    `${featureRoot}/media/emoticon-media.ts`,
    `export function fetchSvgText() {}\nconst PNG_EXPORT_SIZE = ${expected.constants.PNG_EXPORT_SIZE}\n`
  )
  files.set(
    `${featureRoot}/prefetch/emoticon-image-prefetch.ts`,
    `export function scheduleBackgroundEmoticonImageWarmup() {}\n${Object.entries(expected.constants)
      .filter(([name]) => name !== 'PNG_EXPORT_SIZE')
      .map(([name, value]) => `const ${name} = ${value}`)
      .join('\n')}\n`
  )
  return files
}

test('manifest and public inventory remain exact and self-consistent', () => {
  const errors = validateManifest(read(manifestPath), publicInventory())
  assert.deepEqual(errors, [])
})

test('catalog taxonomy and all 4,875 display-order signatures remain exact', () => {
  const manifest = JSON.parse(read(manifestPath))
  const missingFlags = manifest.collections
    .find((collection) => collection.id === 'tossface')
    .items.filter((item) => item.category === undefined && item.order === undefined)
    .map((item) => item.name)
    .sort((a, b) => a.localeCompare(b, 'ko'))
  assert.deepEqual(missingFlags, [...expected.missingTossfaceFlags].sort((a, b) => a.localeCompare(b, 'ko')))
  assert.equal(sha256(JSON.stringify(catalogSignature(manifest))), expected.catalogSha256)
})

test('approved runtime geometry, timing, and scheduler constants remain single-owned', () => {
  const values = constantValues(sourceFilesFromDisk())
  assert.deepEqual(Object.fromEntries([...values].sort()), expected.constants)
})

test('future boundary fixture is valid and mutations are rejected', () => {
  const fixture = futureFixture()
  assert.deepEqual(boundaryErrors(fixture), [])

  const missing = new Map(fixture)
  missing.delete(`${featureRoot}/components/emoticon-grid.tsx`)
  assert.ok(boundaryErrors(missing).some((error) => error.startsWith('MISSING_TARGET:')))

  const noDirective = new Map(fixture)
  noDirective.set(implementationPath, "export { EmoticonStoragePage } from './emoticon-storage-controller'\n")
  assert.ok(boundaryErrors(noDirective).includes('MISSING_CLIENT_DIRECTIVE'))

  const cycle = new Map(fixture)
  cycle.set(`${featureRoot}/model/collection-config.tsx`, "import './tossface-taxonomy'\nexport const collectionConfig = []\n")
  cycle.set(`${featureRoot}/model/tossface-taxonomy.ts`, "import './collection-config'\nexport const tossfaceTaxonomy = []\n")
  assert.ok(boundaryErrors(cycle).some((error) => error.startsWith('IMPORT_CYCLE:')))

  const crossFeature = new Map(fixture)
  crossFeature.set(`${featureRoot}/model/tossface-taxonomy.ts`, "import '@/features/other/private'\nexport const tossfaceTaxonomy = []\n")
  assert.ok(boundaryErrors(crossFeature).some((error) => error.startsWith('CROSS_FEATURE_IMPORT:')))

  const routeInternal = new Map(fixture)
  routeInternal.set(
    routePath,
    "import { EmoticonStoragePage } from '@/features/emoticon-storage/emoticon-storage-controller'\nexport default function Page() { return null }\n"
  )
  assert.ok(boundaryErrors(routeInternal).includes('ROUTE_IMPORT_BOUNDARY'))

  const headerInternal = new Map(fixture)
  headerInternal.set(
    headerPath,
    "import '@/features/emoticon-storage/model/prepare-collections'\nexport function Header() { return null }\n"
  )
  assert.ok(boundaryErrors(headerInternal).includes('HEADER_FEATURE_INTERNAL_IMPORT'))

  const facadeInternal = new Map(fixture)
  facadeInternal.set(
    implementationPath,
    "'use client'\nexport { EmoticonStoragePage } from './components/emoticon-grid'\n"
  )
  assert.ok(boundaryErrors(facadeInternal).includes('FACADE_IMPORT_BOUNDARY'))

  const leafOwner = new Map(fixture)
  leafOwner.set(
    `${featureRoot}/components/emoticon-storage-skeleton.tsx`,
    "import '../emoticon-storage-controller'\nexport const EmoticonStorageSkeleton = null\n"
  )
  assert.ok(boundaryErrors(leafOwner).some((error) => error.startsWith('LEAF_IMPORTS_OWNER:')))

  const duplicate = new Map(fixture)
  duplicate.set(`${featureRoot}/model/tossface-taxonomy.ts`, 'export function fetchSvgText() {}\n')
  assert.ok(boundaryErrors(duplicate).includes('DUPLICATE_OR_WRONG_OWNER:fetchSvgText'))

  const constantMutation = new Map(fixture)
  constantMutation.set(
    `${featureRoot}/prefetch/emoticon-image-prefetch.ts`,
    constantMutation.get(`${featureRoot}/prefetch/emoticon-image-prefetch.ts`).replace(
      'const GRID_OVERSCAN = 4',
      'const GRID_OVERSCAN = 5'
    )
  )
  assert.ok(boundaryErrors(constantMutation).includes('CONSTANT:GRID_OVERSCAN'))

  const duplicateLayout = new Map(fixture)
  duplicateLayout.set(
    `${featureRoot}/components/emoticon-storage-skeleton.tsx`,
    `${duplicateLayout.get(`${featureRoot}/components/emoticon-storage-skeleton.tsx`)}const EMOTICON_CONTENT_CLASS_NAME = ${JSON.stringify(expected.sharedLayoutStrings.EMOTICON_CONTENT_CLASS_NAME)}\n`
  )
  assert.ok(
    boundaryErrors(duplicateLayout).includes(
      'SHARED_LAYOUT_OWNER:EMOTICON_CONTENT_CLASS_NAME'
    )
  )

  for (const [label, replacement] of [
    ['missing', "{ id: 'objects' }, { id: 'flags' }"],
    ['extra', "{ id: 'objects' }, { id: 'new-category' }, { id: 'symbols' }"],
    ['reordered', "{ id: 'objects' }, { id: 'flags' }, { id: 'symbols' }"],
  ]) {
    const categoryMutation = new Map(fixture)
    categoryMutation.set(
      `${featureRoot}/model/collection-config.tsx`,
      categoryMutation
        .get(`${featureRoot}/model/collection-config.tsx`)
        .replace("{ id: 'objects' }, { id: 'symbols' }, { id: 'flags' }", replacement)
    )
    assert.ok(
      boundaryErrors(categoryMutation).includes('SUBCATEGORY_ORDER:tossface'),
      `${label} category mutation must fail`
    )
  }
})

test('manifest validator rejects collection, count, source, and inventory mutations', () => {
  const manifestRaw = read(manifestPath)
  const inventory = publicInventory()
  const manifest = JSON.parse(manifestRaw)

  const reordered = structuredClone(manifest)
  reordered.collections.reverse()
  assert.ok(validateManifest(JSON.stringify(reordered), inventory).includes('COLLECTION_ORDER'))

  const missing = structuredClone(manifest)
  missing.collections[0].items.pop()
  assert.ok(validateManifest(JSON.stringify(missing), inventory).some((error) => error.startsWith('COLLECTION_COUNT:')))

  const extra = structuredClone(manifest)
  extra.collections.push({ id: 'extra', name: 'Extra', sourceLabel: 'Extra', count: 0, items: [] })
  assert.ok(validateManifest(JSON.stringify(extra), inventory).includes('COLLECTION_ORDER'))

  const duplicate = structuredClone(manifest)
  duplicate.collections[0].items[1].id = duplicate.collections[0].items[0].id
  assert.ok(validateManifest(JSON.stringify(duplicate), inventory).some((error) => error.startsWith('DUPLICATE_ID:')))

  const missingSource = structuredClone(manifest)
  missingSource.collections[0].items[0].src = '/emoticons/material/missing.svg'
  assert.ok(validateManifest(JSON.stringify(missingSource), inventory).some((error) => error.startsWith('MISSING_SOURCE:')))

  const inventoryMutation = structuredClone(inventory)
  inventoryMutation.sha256 = '0'.repeat(64)
  assert.ok(validateManifest(manifestRaw, inventoryMutation).includes('PUBLIC_INVENTORY_HASH'))
})

test('repository has completed the future emoticon feature boundary', () => {
  assert.deepEqual(boundaryErrors(repositorySourceFilesFromDisk()), [])
})

function parseModule(filePath, source) {
  return ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(filePath)
  )
}

function namedImportLocal(sourceFile, modulePath, importedName) {
  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== modulePath
    ) {
      continue
    }
    const bindings = statement.importClause?.namedBindings
    if (
      statement.importClause?.isTypeOnly ||
      !bindings ||
      !ts.isNamedImports(bindings)
    ) continue
    for (const element of bindings.elements) {
      if (
        !element.isTypeOnly &&
        (element.propertyName?.text ?? element.name.text) === importedName &&
        element.name.text === importedName
      ) {
        return element.name.text
      }
    }
  }
  return null
}

function runtimeIdentifierCount(sourceFile, localName) {
  let count = 0
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return
    if (ts.isIdentifier(node) && node.text === localName) count += 1
    ts.forEachChild(node, visit)
  }
  ts.forEachChild(sourceFile, visit)
  return count
}

function hasNamedImportUse(filePath, source, modulePath, importedName) {
  const sourceFile = parseModule(filePath, source)
  const localName = namedImportLocal(sourceFile, modulePath, importedName)
  return Boolean(localName && runtimeIdentifierCount(sourceFile, localName) > 0)
}

function hasImportedJsxTagUse(filePath, source, modulePath, importedName) {
  const sourceFile = parseModule(filePath, source)
  const localName = namedImportLocal(sourceFile, modulePath, importedName)
  if (!localName) return false
  let used = false
  function visit(node) {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      node.tagName.text === localName
    ) {
      used = true
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return used
}

function hasImportedLayoutJsxUse(filePath, source, modulePath, importedName) {
  const sourceFile = parseModule(filePath, source)
  const localName = namedImportLocal(sourceFile, modulePath, importedName)
  if (!localName) return false
  let used = false
  function expressionContainsDirectBinding(node) {
    if (ts.isIdentifier(node) && node.text === localName) return true
    let found = false
    ts.forEachChild(node, (child) => {
      if (expressionContainsDirectBinding(child)) found = true
    })
    return found
  }
  function visit(node) {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(sourceFile) === 'className' &&
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression &&
      expressionContainsDirectBinding(node.initializer.expression)
    ) {
      used = true
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return used
}

function exactFacadeErrors(source) {
  const errors = []
  const sourceFile = parseModule(implementationPath, source)
  const first = sourceFile.statements[0]
  if (
    !first ||
    !ts.isExpressionStatement(first) ||
    !ts.isStringLiteral(first.expression) ||
    first.expression.text !== 'use client'
  ) {
    errors.push('STRICT_FACADE_CLIENT_DIRECTIVE')
  }
  const runtimeStatements = sourceFile.statements.filter(
    (statement) => statement !== first
  )
  if (runtimeStatements.length !== 1) errors.push('STRICT_FACADE_EXTRA_STATEMENT')
  const declaration = runtimeStatements[0]
  if (
    !declaration ||
    !ts.isExportDeclaration(declaration) ||
    declaration.isTypeOnly ||
    !declaration.moduleSpecifier ||
    !ts.isStringLiteral(declaration.moduleSpecifier) ||
    declaration.moduleSpecifier.text !== './emoticon-storage-controller' ||
    !declaration.exportClause ||
    !ts.isNamedExports(declaration.exportClause) ||
    declaration.exportClause.elements.length !== 1
  ) {
    errors.push('STRICT_FACADE_NAMED_REEXPORT')
  } else {
    const element = declaration.exportClause.elements[0]
    if (
      element.name.text !== 'EmoticonStoragePage' ||
      (element.propertyName && element.propertyName.text !== 'EmoticonStoragePage')
    ) {
      errors.push('STRICT_FACADE_EXPORT_NAME')
    }
  }
  return errors
}

function routeErrors(source) {
  const errors = []
  if (
    !hasImportedJsxTagUse(
      routePath,
      source,
      '@/features/emoticon-storage/emoticon-storage-page',
      'EmoticonStoragePage'
    )
  ) {
    errors.push('STRICT_ROUTE_NAMED_IMPORT_USE')
  }
  return errors
}

function exportedStringOwner(files, name, expectedValue) {
  const owners = []
  for (const [filePath, source] of files) {
    const sourceFile = parseModule(filePath, source)
    for (const statement of sourceFile.statements) {
      if (!ts.isVariableStatement(statement)) continue
      const exported = statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
      )
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === name &&
          declaration.initializer &&
          ts.isStringLiteralLike(declaration.initializer)
        ) {
          owners.push({
            filePath,
            exported,
            value: declaration.initializer.text,
          })
        }
      }
    }
  }
  return (
    owners.length === 1 &&
    owners[0].filePath === layoutContractPath &&
    owners[0].exported === true &&
    owners[0].value === expectedValue
  )
}

function findEmoticonIntentHandler(source) {
  const sourceFile = parseModule(headerPath, source)
  const hookLocal = namedImportLocal(
    sourceFile,
    '@/hooks/use-emoticon-manifest-prefetch',
    'useEmoticonManifestPrefetch'
  )
  if (!hookLocal) return null
  let handler = null
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression) &&
      node.initializer.expression.text === hookLocal
    ) {
      handler = node.name.text
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return handler
}

function hasExactEmoticonIntentHandlers(source, handler) {
  const sourceFile = parseModule(headerPath, source)
  let matched = false
  function attributeMap(attributes) {
    return Object.fromEntries(
      attributes.properties
        .filter(ts.isJsxAttribute)
        .map((attribute) => {
          const initializer = attribute.initializer
          if (!initializer) return [attribute.name.getText(sourceFile), null]
          if (ts.isStringLiteral(initializer)) {
            return [attribute.name.getText(sourceFile), initializer.text]
          }
          if (
            ts.isJsxExpression(initializer) &&
            initializer.expression &&
            ts.isIdentifier(initializer.expression)
          ) {
            return [attribute.name.getText(sourceFile), initializer.expression.text]
          }
          return [attribute.name.getText(sourceFile), initializer.getText(sourceFile)]
        })
    )
  }
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const attributes = attributeMap(node.attributes)
      if (
        attributes.href === '/emoticons' &&
        attributes.onFocus === handler &&
        attributes.onMouseEnter === handler &&
        attributes.onTouchStart === handler
      ) {
        matched = true
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return matched
}

function strictFinalBoundaryErrors(files) {
  const errors = [...boundaryErrors(files)]
  const facade = files.get(implementationPath) ?? ''
  errors.push(...exactFacadeErrors(facade))
  errors.push(...routeErrors(files.get(routePath) ?? ''))

  for (const [name, value] of Object.entries(expected.sharedLayoutStrings)) {
    if (!exportedStringOwner(files, name, value)) {
      errors.push(`STRICT_LAYOUT_OWNER:${name}`)
    }
    const consumers = [
      [controllerPath, './emoticon-layout-contract'],
      [
        `${featureRoot}/components/emoticon-storage-skeleton.tsx`,
        '../emoticon-layout-contract',
      ],
      ...(name === 'EMOTICON_CONTENT_CLASS_NAME'
        ? [
            [
              `${featureRoot}/components/emoticon-grid.tsx`,
              '../emoticon-layout-contract',
            ],
          ]
        : []),
    ]
    for (const [consumer, modulePath] of consumers) {
      if (
        !hasImportedLayoutJsxUse(
          consumer,
          files.get(consumer) ?? '',
          modulePath,
          name
        )
      ) {
        errors.push(`STRICT_LAYOUT_CONSUMER:${consumer}:${name}`)
      }
    }
    for (const [filePath, source] of files) {
      if (filePath !== layoutContractPath && source.includes(JSON.stringify(value))) {
        errors.push(`STRICT_LAYOUT_LITERAL_DUPLICATE:${filePath}:${name}`)
      }
    }
  }

  const header = files.get(headerPath) ?? ''
  const intentHandler = findEmoticonIntentHandler(header)
  if (!intentHandler) errors.push('STRICT_HEADER_HOOK_CALL')
  else if (!hasExactEmoticonIntentHandlers(header, intentHandler)) {
    errors.push('STRICT_HEADER_INTENT_HANDLERS')
  }
  const hook = files.get(manifestPrefetchHookPath) ?? ''
  if (
    !hasNamedImportUse(
      manifestPrefetchHookPath,
      hook,
      '@/features/emoticon-storage/emoticon-manifest-query',
      'prefetchEmoticonManifest'
    )
  ) {
    errors.push('STRICT_HOOK_QUERY_USE')
  }
  return [...new Set(errors)].sort()
}

function strictFutureFixture() {
  const files = futureFixture()
  files.set(
    implementationPath,
    "'use client'\n\nexport { EmoticonStoragePage } from './emoticon-storage-controller'\n"
  )
  files.set(
    routePath,
    "import { EmoticonStoragePage } from '@/features/emoticon-storage/emoticon-storage-page'\nexport default function Page() { return <EmoticonStoragePage /> }\n"
  )
  files.set(
    layoutContractPath,
    `export const EMOTICON_PAGE_SHELL_CLASS_NAME = ${JSON.stringify(expected.sharedLayoutStrings.EMOTICON_PAGE_SHELL_CLASS_NAME)}\nexport const EMOTICON_CONTENT_CLASS_NAME = ${JSON.stringify(expected.sharedLayoutStrings.EMOTICON_CONTENT_CLASS_NAME)}\n`
  )
  files.set(
    controllerPath,
    "import { VirtualizedEmoticonGrid } from './components/emoticon-grid'\nimport { BottomActionSheet } from './components/emoticon-action-sheet'\nimport { EMOTICON_PAGE_SHELL_CLASS_NAME, EMOTICON_CONTENT_CLASS_NAME } from './emoticon-layout-contract'\nexport function EmoticonStoragePage() { return <main className={EMOTICON_PAGE_SHELL_CLASS_NAME}><div className={EMOTICON_CONTENT_CLASS_NAME}><VirtualizedEmoticonGrid /><BottomActionSheet /></div></main> }\n"
  )
  files.set(
    `${featureRoot}/components/emoticon-grid.tsx`,
    "import { scheduleBackgroundEmoticonImageWarmup } from '../prefetch/emoticon-image-prefetch'\nimport { EMOTICON_CONTENT_CLASS_NAME } from '../emoticon-layout-contract'\nexport function VirtualizedEmoticonGrid() { scheduleBackgroundEmoticonImageWarmup(); return <section className={EMOTICON_CONTENT_CLASS_NAME} /> }\n"
  )
  files.set(
    `${featureRoot}/components/emoticon-storage-skeleton.tsx`,
    "import { EMOTICON_PAGE_SHELL_CLASS_NAME, EMOTICON_CONTENT_CLASS_NAME } from '../emoticon-layout-contract'\nexport function EmoticonStorageSkeleton() { return <div className={EMOTICON_PAGE_SHELL_CLASS_NAME}><div className={EMOTICON_CONTENT_CLASS_NAME} /></div> }\n"
  )
  files.set(
    manifestQueryPath,
    'export function prefetchEmoticonManifest() {}\n'
  )
  files.set(
    manifestPrefetchHookPath,
    "import { prefetchEmoticonManifest } from '@/features/emoticon-storage/emoticon-manifest-query'\nexport function useEmoticonManifestPrefetch() { return () => prefetchEmoticonManifest() }\n"
  )
  files.set(
    headerPath,
    "import { useEmoticonManifestPrefetch } from '@/hooks/use-emoticon-manifest-prefetch'\nexport function Header() { const prefetchEmoticons = useEmoticonManifestPrefetch(); return <a href=\"/emoticons\" onFocus={prefetchEmoticons} onMouseEnter={prefetchEmoticons} onTouchStart={prefetchEmoticons}>Emoticons</a> }\n"
  )
  return files
}

test('strict final facade, route, layout, and Header boundaries reject non-consuming mutants', () => {
  const fixture = strictFutureFixture()
  assert.deepEqual(strictFinalBoundaryErrors(fixture), [])

  const defaultFacade = new Map(fixture)
  defaultFacade.set(
    implementationPath,
    "'use client'\nexport { default } from './emoticon-storage-controller'\n"
  )
  assert.ok(strictFinalBoundaryErrors(defaultFacade).includes('STRICT_FACADE_EXPORT_NAME'))

  const extraFacade = new Map(fixture)
  extraFacade.set(
    implementationPath,
    `${fixture.get(implementationPath)}export const extra = true\n`
  )
  assert.ok(
    strictFinalBoundaryErrors(extraFacade).includes('STRICT_FACADE_EXTRA_STATEMENT')
  )

  const unusedRoute = new Map(fixture)
  unusedRoute.set(
    routePath,
    "import { EmoticonStoragePage } from '@/features/emoticon-storage/emoticon-storage-page'\nexport default function Page() { return null }\n"
  )
  assert.ok(
    strictFinalBoundaryErrors(unusedRoute).includes('STRICT_ROUTE_NAMED_IMPORT_USE')
  )

  const voidRoute = new Map(fixture)
  voidRoute.set(
    routePath,
    "import { EmoticonStoragePage } from '@/features/emoticon-storage/emoticon-storage-page'\nexport default function Page() { void EmoticonStoragePage; return null }\n"
  )
  assert.ok(
    strictFinalBoundaryErrors(voidRoute).includes('STRICT_ROUTE_NAMED_IMPORT_USE')
  )

  const unusedLayout = new Map(fixture)
  unusedLayout.set(
    `${featureRoot}/components/emoticon-grid.tsx`,
    "import { scheduleBackgroundEmoticonImageWarmup } from '../prefetch/emoticon-image-prefetch'\nimport { EMOTICON_CONTENT_CLASS_NAME } from '../emoticon-layout-contract'\nexport function VirtualizedEmoticonGrid() { scheduleBackgroundEmoticonImageWarmup(); return null }\n"
  )
  assert.ok(
    strictFinalBoundaryErrors(unusedLayout).some((error) =>
      error.startsWith('STRICT_LAYOUT_CONSUMER:src/features/emoticon-storage/components/emoticon-grid.tsx')
    )
  )

  const aliasedDeadLayout = new Map(fixture)
  aliasedDeadLayout.set(
    `${featureRoot}/components/emoticon-grid.tsx`,
    "import { scheduleBackgroundEmoticonImageWarmup } from '../prefetch/emoticon-image-prefetch'\nimport { EMOTICON_CONTENT_CLASS_NAME as contentClass } from '../emoticon-layout-contract'\nexport function VirtualizedEmoticonGrid() { scheduleBackgroundEmoticonImageWarmup(); void contentClass; return <section /> }\n"
  )
  assert.ok(
    strictFinalBoundaryErrors(aliasedDeadLayout).some((error) =>
      error.startsWith('STRICT_LAYOUT_CONSUMER:src/features/emoticon-storage/components/emoticon-grid.tsx')
    )
  )

  const duplicateLiteral = new Map(fixture)
  duplicateLiteral.set(
    `${featureRoot}/components/emoticon-action-sheet.tsx`,
    `const duplicate = ${JSON.stringify(expected.sharedLayoutStrings.EMOTICON_CONTENT_CLASS_NAME)}\nexport function BottomActionSheet() { return duplicate }\n`
  )
  assert.ok(
    strictFinalBoundaryErrors(duplicateLiteral).some((error) =>
      error.startsWith('STRICT_LAYOUT_LITERAL_DUPLICATE:')
    )
  )

  const missingHeaderEvent = new Map(fixture)
  missingHeaderEvent.set(
    headerPath,
    fixture
      .get(headerPath)
      .replace(' onTouchStart={prefetchEmoticons}', '')
  )
  assert.ok(
    strictFinalBoundaryErrors(missingHeaderEvent).includes(
      'STRICT_HEADER_INTENT_HANDLERS'
    )
  )

  const splitHeaderHandler = new Map(fixture)
  splitHeaderHandler.set(
    headerPath,
    fixture
      .get(headerPath)
      .replace('onMouseEnter={prefetchEmoticons}', 'onMouseEnter={() => {}}')
  )
  assert.ok(
    strictFinalBoundaryErrors(splitHeaderHandler).includes(
      'STRICT_HEADER_INTENT_HANDLERS'
    )
  )

  const unusedQuery = new Map(fixture)
  unusedQuery.set(
    manifestPrefetchHookPath,
    "import { prefetchEmoticonManifest } from '@/features/emoticon-storage/emoticon-manifest-query'\nexport function useEmoticonManifestPrefetch() { return () => undefined }\n"
  )
  assert.ok(
    strictFinalBoundaryErrors(unusedQuery).includes('STRICT_HOOK_QUERY_USE')
  )
})

test('runtime source reader follows the strict facade to the controller owner', () => {
  const facadeSource = readRaw(implementationPath)
  const existingControllerProbes = []
  const missingControllerProbes = []
  let unrelatedProbeCount = 0

  assert.deepEqual(exactFacadeErrors(facadeSource), [])
  assert.equal(
    resolveRuntimeSourcePath(implementationPath, (absolutePath) => {
      existingControllerProbes.push(absolutePath)
      return true
    }),
    controllerPath
  )
  assert.deepEqual(existingControllerProbes, [join(root, controllerPath)])
  assert.equal(
    resolveRuntimeSourcePath(implementationPath, (absolutePath) => {
      missingControllerProbes.push(absolutePath)
      return false
    }),
    implementationPath
  )
  assert.deepEqual(missingControllerProbes, [join(root, controllerPath)])
  assert.equal(
    resolveRuntimeSourcePath(manifestPath, () => {
      unrelatedProbeCount += 1
      return true
    }),
    manifestPath
  )
  assert.equal(unrelatedProbeCount, 0)
  assert.equal(read(implementationPath), readRaw(controllerPath))
})

test('manifest query and intent prefetch preserve the approved request state table', async () => {
  const querySource = read(manifestQueryPath)
  const hookSource = read(manifestPrefetchHookPath)
  const controllerSource = read(controllerPath)
  const headerSource = read(headerPath)

  const policyErrors = ({ query, hook, controller, header }) => {
    const errors = []
    const requiredQueryPatterns = [
      /\['emoticons', 'manifest'\] as const/,
      /fetch\('\/emoticons\/manifest\.json', \{[\s\S]*?signal,[\s\S]*?priority,[\s\S]*?credentials: 'same-origin',[\s\S]*?Accept: 'application\/json'/,
      /await Promise\.resolve\(\)[\s\S]*?signal\?\.throwIfAborted\(\)[\s\S]*?fetch\('\/emoticons\/manifest\.json'/,
      /staleTime: Infinity/,
      /gcTime: EMOTICON_MANIFEST_GC_TIME_MS/,
      /const EMOTICON_MANIFEST_GC_TIME_MS = 2 \* 60 \* 60 \* 1000/,
      /retry: false/,
      /retryOnMount: true/,
      /refetchOnWindowFocus: false/,
      /refetchOnReconnect: false/,
      /refetchOnMount: \(query\) => query\.state\.status === 'error'/,
      /getEmoticonManifestQueryOptions\(\{ priority: 'low' \}\)/,
    ]
    requiredQueryPatterns.forEach((pattern, index) => {
      if (!pattern.test(query)) errors.push(`QUERY_POLICY:${index}`)
    })
    const requiredHookPatterns = [
      /router\.prefetch\('\/emoticons'\)[\s\S]*?getQueryState\(EMOTICON_MANIFEST_QUERY_KEY\)/,
      /queryState\?\.data !== undefined/,
      /queryState\?\.status === 'pending'/,
      /queryState\?\.fetchStatus === 'fetching'/,
      /queryState\?\.status === 'error'/,
      /prefetchEmoticonManifest\(queryClient\)\.catch\(\(\) => undefined\)/,
    ]
    requiredHookPatterns.forEach((pattern, index) => {
      if (!pattern.test(hook)) errors.push(`HOOK_POLICY:${index}`)
    })
    if (!/useQuery\([\s\S]*?getEmoticonManifestQueryOptions\(\)/.test(controller)) {
      errors.push('CONTROLLER_QUERY')
    }
    if (controller.includes("fetch('/emoticons/manifest.json'")) {
      errors.push('CONTROLLER_DIRECT_FETCH')
    }
    const handler = findEmoticonIntentHandler(header)
    if (!handler || !hasExactEmoticonIntentHandlers(header, handler)) {
      errors.push('HEADER_INTENT')
    }
    if ([query, hook, controller, header].some((source) =>
      /rel=["']prefetch["']|<link[^>]+prefetch/i.test(source)
    )) {
      errors.push('GLOBAL_PREFETCH')
    }
    return errors
  }

  const actual = {
    query: querySource,
    hook: hookSource,
    controller: controllerSource,
    header: headerSource,
  }
  assert.deepEqual(policyErrors(actual), [])

  for (const [label, file, from, to] of [
    ['error-guard', 'hook', "queryState?.status === 'error'", "queryState?.status === 'success'"],
    ['pending-guard', 'hook', "queryState?.status === 'pending'", "queryState?.status === 'success'"],
    ['fetching-guard', 'hook', "queryState?.fetchStatus === 'fetching'", "queryState?.fetchStatus === 'idle'"],
    ['low-priority', 'query', "{ priority: 'low' }", "{ priority: 'auto' }"],
    ['error-remount', 'query', "query.state.status === 'error'", 'true'],
    ['gc-window', 'query', '2 * 60 * 60 * 1000', '60 * 60 * 1000'],
    ['strict-remount-abort', 'query', 'signal?.throwIfAborted()', 'void signal'],
    ['split-header', 'header', 'onMouseEnter={prefetchEmoticons}', 'onMouseEnter={() => {}}'],
  ]) {
    const mutant = { ...actual, [file]: actual[file].replace(from, to) }
    assert.notDeepEqual(policyErrors(mutant), [], `MUTANT_SURVIVED:${label}`)
  }

  const require = createRequire(import.meta.url)
  const reactQueryEntry = require.resolve('@tanstack/react-query')
  const reactQueryUrl = pathToFileURL(
    join(dirname(reactQueryEntry), 'index.js')
  ).href
  const originalDescriptors = new Map(
    ['fetch', 'window', '__manifestHarnessClient', '__manifestHarnessRouter'].map(
      (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]
    )
  )
  const originalNodeEnv = process.env.NODE_ENV
  const nativeTimeoutProvider = {
    setTimeout: (callback, delay) => setTimeout(callback, delay),
    clearTimeout: (handle) => clearTimeout(handle),
    setInterval: (callback, delay) => setInterval(callback, delay),
    clearInterval: (handle) => clearInterval(handle),
  }

  const define = (key, value) => {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    })
  }
  const flush = async () => {
    await Promise.resolve()
    await Promise.resolve()
    await new Promise((resolveFlush) => setImmediate(resolveFlush))
  }
  const transpile = (source) =>
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
  const moduleUrl = (source, label) =>
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${label}-${sha256(source)}`

  let nextTimerId = 1
  const timers = new Map()
  const fakeTimeoutProvider = {
    setTimeout(callback, delay) {
      const handle = nextTimerId++
      timers.set(handle, { callback, delay })
      return handle
    },
    clearTimeout(handle) {
      timers.delete(handle)
    },
    setInterval(callback, delay) {
      const handle = nextTimerId++
      timers.set(handle, { callback, delay, interval: true })
      return handle
    },
    clearInterval(handle) {
      timers.delete(handle)
    },
  }
  const timerDelays = () =>
    [...timers.values()].map((timer) => timer.delay).sort((left, right) => left - right)
  const fireTimers = (delay) => {
    const matches = [...timers.entries()].filter(([, timer]) => timer.delay === delay)
    for (const [handle, timer] of matches) {
      timers.delete(handle)
      timer.callback()
    }
    return matches.length
  }

  const requests = []
  define('fetch', (url, init = {}) => {
    let resolveRequest
    let rejectRequest
    let settled = false
    const promise = new Promise((resolveRequestPromise, rejectRequestPromise) => {
      resolveRequest = resolveRequestPromise
      rejectRequest = rejectRequestPromise
    })
    const request = {
      url,
      signal: init.signal,
      priority: init.priority ?? null,
      credentials: init.credentials ?? null,
      accept: init.headers?.Accept ?? null,
      resolve(data = { collections: [] }) {
        if (settled) return
        settled = true
        resolveRequest({
          ok: true,
          json: async () => data,
        })
      },
      reject(error = new Error('manifest failure')) {
        if (settled) return
        settled = true
        rejectRequest(error)
      },
    }
    requests.push(request)
    const abort = () => {
      request.reject(new DOMException('Aborted', 'AbortError'))
    }
    if (init.signal?.aborted) abort()
    else init.signal?.addEventListener('abort', abort, { once: true })
    return promise
  })

  const importRuntime = async (queryCandidate, hookCandidate, label) => {
    const queryModuleSource = transpile(queryCandidate)
      .replace("import 'client-only';", '')
      .replace("from '@tanstack/react-query'", `from '${reactQueryUrl}'`)
    const queryModuleUrl = moduleUrl(queryModuleSource, `${label}-query`)
    const queryApi = await import(queryModuleUrl)
    const hookModuleSource = transpile(hookCandidate)
      .replace(
        "import { useCallback } from 'react';",
        'const useCallback = (callback) => callback;'
      )
      .replace(
        "import { useRouter } from 'next/navigation';",
        'const useRouter = () => globalThis.__manifestHarnessRouter;'
      )
      .replace(
        "import { useQueryClient } from '@tanstack/react-query';",
        'const useQueryClient = () => globalThis.__manifestHarnessClient;'
      )
      .replace(
        /from '@\/features\/emoticon-storage\/emoticon-manifest-query';/,
        `from '${queryModuleUrl}';`
      )
    const hookApi = await import(moduleUrl(hookModuleSource, `${label}-hook`))
    return { hookApi, queryApi }
  }

  define('window', {})
  process.env.NODE_ENV = 'production'
  const reactQuery = await import(reactQueryUrl)
  const { QueryClient, QueryObserver, timeoutManager } = reactQuery
  timeoutManager.setTimeoutProvider(fakeTimeoutProvider)

  const resetHarness = () => {
    requests.length = 0
    timers.clear()
  }
  const createClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: { retry: 1 },
      },
    })
  const observe = (client, queryApi) => {
    const observer = new QueryObserver(
      client,
      queryApi.getEmoticonManifestQueryOptions()
    )
    return { observer, unsubscribe: observer.subscribe(() => undefined) }
  }
  const intent = (client, hookApi) => {
    const routes = []
    define('__manifestHarnessClient', client)
    define('__manifestHarnessRouter', {
      prefetch(route) {
        routes.push(route)
      },
    })
    return {
      callback: hookApi.useEmoticonManifestPrefetch(),
      routes,
    }
  }
  const requestSignature = () =>
    requests.map((request) => ({
      url: request.url,
      priority: request.priority,
      credentials: request.credentials,
      accept: request.accept,
    }))
  const cleanupClient = (client, ...subscriptions) => {
    subscriptions.forEach((subscription) => subscription?.unsubscribe())
    client.clear()
    timers.clear()
  }

  const signatureFor = async (queryCandidate, hookCandidate, label) => {
    const { queryApi, hookApi } = await importRuntime(
      queryCandidate,
      hookCandidate,
      label
    )
    const signature = {}

    resetHarness()
    {
      const client = createClient()
      const subscription = observe(client, queryApi)
      await flush()
      signature.coldDirect = requestSignature()
      requests[0]?.resolve()
      await flush()
      signature.coldStatus = client.getQueryState(
        queryApi.EMOTICON_MANIFEST_QUERY_KEY
      )?.status
      cleanupClient(client, subscription)
    }

    resetHarness()
    {
      const client = createClient()
      const userIntent = intent(client, hookApi)
      userIntent.callback()
      userIntent.callback()
      await flush()
      const strictSubscription = observe(client, queryApi)
      strictSubscription.unsubscribe()
      await flush()
      const subscription = observe(client, queryApi)
      await flush()
      signature.pendingIntent = {
        requests: requestSignature(),
        routes: userIntent.routes,
      }
      requests[0]?.resolve()
      await flush()
      cleanupClient(client, subscription)
    }

    resetHarness()
    {
      const client = createClient()
      const userIntent = intent(client, hookApi)
      userIntent.callback()
      await flush()
      requests[0]?.resolve()
      await flush()
      const before = client.getQueryState(
        queryApi.EMOTICON_MANIFEST_QUERY_KEY
      )?.dataUpdatedAt
      userIntent.callback()
      const subscription = observe(client, queryApi)
      await flush()
      signature.fulfilledIntent = {
        requests: requestSignature(),
        updatedAtStable:
          before ===
          client.getQueryState(queryApi.EMOTICON_MANIFEST_QUERY_KEY)?.dataUpdatedAt,
        routes: userIntent.routes,
      }
      cleanupClient(client, subscription)
    }

    resetHarness()
    {
      const client = createClient()
      const userIntent = intent(client, hookApi)
      userIntent.callback()
      await flush()
      requests[0]?.reject()
      await flush()
      fireTimers(1000)
      await flush()
      const afterFailure = requests.length
      userIntent.callback()
      await flush()
      const afterRepeatedErrorIntent = requests.length
      const strictSubscription = observe(client, queryApi)
      strictSubscription.unsubscribe()
      await flush()
      const afterStrictAbort = requests.length
      const remountSubscription = observe(client, queryApi)
      await flush()
      signature.failedIntent = {
        afterFailure,
        afterRepeatedErrorIntent,
        afterStrictAbort,
        requests: requestSignature(),
        routes: userIntent.routes,
      }
      requests.at(-1)?.resolve()
      await flush()
      cleanupClient(client, remountSubscription)
    }

    resetHarness()
    {
      const client = createClient()
      const userIntent = intent(client, hookApi)
      userIntent.callback()
      await flush()
      const joinedSubscription = observe(client, queryApi)
      await flush()
      requests[0]?.reject()
      await flush()
      fireTimers(1000)
      await flush()
      const beforeRemount = {
        requests: requests.length,
        status: client.getQueryState(queryApi.EMOTICON_MANIFEST_QUERY_KEY)?.status,
      }
      joinedSubscription.unsubscribe()
      const remountSubscription = observe(client, queryApi)
      await flush()
      signature.joinedFailure = {
        beforeRemount,
        requestsAfterRemount: requests.length,
        priorities: requests.map((request) => request.priority),
      }
      requests.at(-1)?.resolve()
      await flush()
      cleanupClient(client, remountSubscription)
    }

    resetHarness()
    {
      const client = createClient()
      const unhandled = []
      const onUnhandled = (reason) => unhandled.push(String(reason))
      process.on('unhandledRejection', onUnhandled)
      const subscription = observe(client, queryApi)
      await flush()
      await client.cancelQueries({
        queryKey: queryApi.EMOTICON_MANIFEST_QUERY_KEY,
        exact: true,
      })
      await flush()
      const state = client.getQueryState(queryApi.EMOTICON_MANIFEST_QUERY_KEY)
      signature.cancellation = {
        requests: requests.length,
        status: state?.status,
        fetchStatus: state?.fetchStatus,
        error: state?.error ?? null,
        unhandled,
      }
      process.off('unhandledRejection', onUnhandled)
      cleanupClient(client, subscription)
    }

    resetHarness()
    {
      const client = createClient()
      const userIntent = intent(client, hookApi)
      userIntent.callback()
      await flush()
      requests[0]?.resolve()
      await flush()
      const gcDelays = timerDelays()
      const exactGcTimers = fireTimers(2 * 60 * 60 * 1000)
      await flush()
      const stateAfterGc = client.getQueryState(
        queryApi.EMOTICON_MANIFEST_QUERY_KEY
      )
      userIntent.callback()
      await flush()
      signature.garbageCollection = {
        gcDelays,
        exactGcTimers,
        removed: stateAfterGc === undefined,
        requests: requestSignature(),
      }
      requests.at(-1)?.resolve()
      await flush()
      cleanupClient(client)
    }

    return signature
  }

  const expectedSignature = {
    coldDirect: [
      {
        url: '/emoticons/manifest.json',
        priority: 'auto',
        credentials: 'same-origin',
        accept: 'application/json',
      },
    ],
    coldStatus: 'success',
    pendingIntent: {
      requests: [
        {
          url: '/emoticons/manifest.json',
          priority: 'low',
          credentials: 'same-origin',
          accept: 'application/json',
        },
      ],
      routes: ['/emoticons', '/emoticons'],
    },
    fulfilledIntent: {
      requests: [
        {
          url: '/emoticons/manifest.json',
          priority: 'low',
          credentials: 'same-origin',
          accept: 'application/json',
        },
      ],
      updatedAtStable: true,
      routes: ['/emoticons', '/emoticons'],
    },
    failedIntent: {
      afterFailure: 1,
      afterRepeatedErrorIntent: 1,
      afterStrictAbort: 1,
      requests: [
        {
          url: '/emoticons/manifest.json',
          priority: 'low',
          credentials: 'same-origin',
          accept: 'application/json',
        },
        {
          url: '/emoticons/manifest.json',
          priority: 'auto',
          credentials: 'same-origin',
          accept: 'application/json',
        },
      ],
      routes: ['/emoticons', '/emoticons'],
    },
    joinedFailure: {
      beforeRemount: { requests: 1, status: 'error' },
      requestsAfterRemount: 2,
      priorities: ['low', 'auto'],
    },
    cancellation: {
      requests: 1,
      status: 'pending',
      fetchStatus: 'idle',
      error: null,
      unhandled: [],
    },
    garbageCollection: {
      gcDelays: [2 * 60 * 60 * 1000],
      exactGcTimers: 1,
      removed: true,
      requests: [
        {
          url: '/emoticons/manifest.json',
          priority: 'low',
          credentials: 'same-origin',
          accept: 'application/json',
        },
        {
          url: '/emoticons/manifest.json',
          priority: 'low',
          credentials: 'same-origin',
          accept: 'application/json',
        },
      ],
    },
  }

  try {
    assert.deepEqual(
      await signatureFor(querySource, hookSource, 'current'),
      expectedSignature
    )

    const mutants = [
      [
        'direct default priority',
        querySource.replace("priority = 'auto'", "priority = 'low'"),
        hookSource,
      ],
      [
        'intent priority forwarding',
        querySource.replace('priority: options.priority', "priority: 'auto'"),
        hookSource,
      ],
      [
        'retry policy',
        querySource.replace('retry: false', 'retry: false || 1'),
        hookSource,
      ],
      [
        'success remount policy',
        querySource.replace(
          "query.state.status === 'error'",
          "query.state.status === 'error' ? true : 'always'"
        ),
        hookSource,
      ],
      [
        'strict remount abort',
        querySource.replace(
          'signal?.throwIfAborted()',
          'try { signal?.throwIfAborted() } catch {}'
        ),
        hookSource,
      ],
      [
        'exact GC window',
        querySource.replace(
          '2 * 60 * 60 * 1000',
          '2 * 60 * 60 * 1000 + 1'
        ),
        hookSource,
      ],
      [
        'pending intent observer lifetime',
        querySource.replace(
          /  const options = getEmoticonManifestQueryOptions\(\{ priority: 'low' \}\)\n  const prefetchPromise = queryClient\.prefetchQuery\(options\)\n  const observer = new QueryObserver\(queryClient, options\)\n  const unsubscribe = observer\.subscribe\(\(\) => undefined\)\n\n  return prefetchPromise\.finally\(unsubscribe\)/,
          "  return queryClient.prefetchQuery(\n    getEmoticonManifestQueryOptions({ priority: 'low' })\n  )"
        ),
        hookSource,
      ],
      [
        'error intent guard',
        querySource,
        hookSource.replace("queryState?.status === 'error'", 'false'),
      ],
      [
        'unconditional prefetch before guard',
        querySource,
        hookSource.replace(
          'const queryState = queryClient.getQueryState',
          'void prefetchEmoticonManifest(queryClient);\n\n    const queryState = queryClient.getQueryState'
        ),
      ],
    ]

    for (const [name, queryCandidate, hookCandidate] of mutants) {
      assert.ok(
        queryCandidate !== querySource || hookCandidate !== hookSource,
        `${name} mutation target must exist`
      )
      assert.notDeepEqual(
        await signatureFor(queryCandidate, hookCandidate, `mutant-${name}`),
        expectedSignature,
        `${name} mutation must fail the executable manifest state contract`
      )
    }
  } finally {
    timeoutManager.setTimeoutProvider(nativeTimeoutProvider)
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = originalNodeEnv
    for (const [key, descriptor] of originalDescriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  }
})

test('prefetch scheduler fake clock preserves lifecycle, fallback, and cancellation invariants', async () => {
  const prefetchPath = `${featureRoot}/prefetch/emoticon-image-prefetch.ts`
  const source = read(prefetchPath)

  async function signatureFor(candidate, label) {
    const output = ts.transpileModule(candidate, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(output).toString('base64')}#${label}`
    const originalDescriptors = new Map(
      ['window', 'setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame']
        .map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
    )
    const images = []
    let nextHandle = 1
    const clock = {
      timers: new Map(),
      idles: new Map(),
      rafs: new Map(),
      tasks: [],
      cancelledTimers: [],
      cancelledIdles: [],
      cancelledRafs: [],
      reset() {
        this.timers.clear()
        this.idles.clear()
        this.rafs.clear()
        this.tasks.length = 0
        this.cancelledTimers.length = 0
        this.cancelledIdles.length = 0
        this.cancelledRafs.length = 0
      },
      runFirst(queue) {
        const entry = queue.entries().next().value
        if (!entry) return false
        const [handle, value] = entry
        queue.delete(handle)
        ;(typeof value === 'function' ? value : value.callback)()
        return true
      },
    }
    class FakeImage {
      constructor() {
        this.decoding = ''
        this.fetchPriority = ''
        this.onload = null
        this.onerror = null
        this._src = ''
        this.decodePromise = new Promise((resolve, reject) => {
          this.resolveDecode = resolve
          this.rejectDecode = reject
        })
        this.decodePromise.catch(() => undefined)
        images.push(this)
      }
      set src(value) {
        this._src = value
      }
      get src() {
        return this._src
      }
      decode() {
        return this.decodePromise
      }
    }
    const windowStub = {
      Image: FakeImage,
      requestIdleCallback(callback, options) {
        const handle = nextHandle++
        clock.idles.set(handle, { callback, options })
        return handle
      },
      cancelIdleCallback(handle) {
        clock.cancelledIdles.push(handle)
        clock.idles.delete(handle)
      },
      scheduler: {
        postTask(callback, options) {
          clock.tasks.push({ callback, options })
          return Promise.resolve()
        },
      },
    }
    const define = (key, value) => {
      Object.defineProperty(globalThis, key, {
        configurable: true,
        writable: true,
        value,
      })
    }
    define('window', windowStub)
    define('setTimeout', (callback, delay) => {
      const handle = nextHandle++
      clock.timers.set(handle, { callback, delay })
      return handle
    })
    define('clearTimeout', (handle) => {
      clock.cancelledTimers.push(handle)
      clock.timers.delete(handle)
    })
    define('requestAnimationFrame', (callback) => {
      const handle = nextHandle++
      clock.rafs.set(handle, callback)
      return handle
    })
    define('cancelAnimationFrame', (handle) => {
      clock.cancelledRafs.push(handle)
      clock.rafs.delete(handle)
    })

    const flush = async () => {
      for (let index = 0; index < 8; index += 1) await Promise.resolve()
    }
    const startsSince = (index) => images.slice(index).map((image) => image.src)

    try {
      const api = await import(moduleUrl)

      clock.reset()
      const nearStart = images.length
      const nearSources = Array.from({ length: 10 }, (_, index) => `/near-${index}.svg`)
      api.scheduleEmoticonImagePrefetch([...nearSources, nearSources[0]])
      const nearSync = startsSince(nearStart)
      const nearIdleTimeout = [...clock.idles.values()][0]?.options?.timeout ?? null
      clock.runFirst(clock.idles)
      const nearComplete = startsSince(nearStart)

      clock.reset()
      api.scheduleEmoticonImagePrefetch(['/load-first.svg'])
      const loadFirstImage = images.at(-1)
      const imageDecoding = loadFirstImage?.decoding ?? null
      const imageFetchPriority = loadFirstImage?.fetchPriority ?? null
      loadFirstImage?.onload?.()
      await flush()
      const loadFirstBeforeDecode = api.hasSettledEmoticonImage('/load-first.svg')
      loadFirstImage?.resolveDecode?.()
      await flush()
      const loadFirstAfterBoth = api.hasSettledEmoticonImage('/load-first.svg')

      api.scheduleEmoticonImagePrefetch(['/decode-first.svg'])
      const decodeFirstImage = images.at(-1)
      decodeFirstImage?.resolveDecode?.()
      await flush()
      const decodeFirstBeforeLoad = api.hasSettledEmoticonImage('/decode-first.svg')
      decodeFirstImage?.onload?.()
      await flush()
      const decodeFirstAfterBoth = api.hasSettledEmoticonImage('/decode-first.svg')

      clock.reset()
      const pendingStart = images.length
      api.scheduleEmoticonImagePrefetch(['/error-settled.svg'])
      api.scheduleEmoticonImagePrefetch(['/error-settled.svg'])
      const errorImage = images.at(-1)
      const pendingStarts = images.length - pendingStart
      errorImage?.onerror?.()
      errorImage?.rejectDecode?.(new Error('decode'))
      await flush()
      const errorSettled = api.hasSettledEmoticonImage('/error-settled.svg')
      api.scheduleEmoticonImagePrefetch(['/error-settled.svg'])
      const settledStarts = images.length - pendingStart

      clock.reset()
      windowStub.requestIdleCallback = (callback, options) => {
        const handle = nextHandle++
        clock.idles.set(handle, { callback, options })
        return handle
      }
      windowStub.cancelIdleCallback = (handle) => {
        clock.cancelledIdles.push(handle)
        clock.idles.delete(handle)
      }
      const cancelStart = images.length
      const cancelNear = api.scheduleEmoticonImagePrefetch(
        Array.from({ length: 9 }, (_, index) => `/cancel-${index}.svg`)
      )
      const lateIdle = [...clock.idles.values()][0]?.callback
      const cancelSync = images.length - cancelStart
      cancelNear()
      lateIdle?.()
      const cancelAfterLate = images.length - cancelStart
      const cancelledIdleCount = clock.cancelledIdles.length

      clock.reset()
      windowStub.scheduler = {
        postTask(callback, options) {
          clock.tasks.push({ callback, options })
          return Promise.resolve()
        },
      }
      const backgroundStart = images.length
      const cancelBackground = api.scheduleBackgroundEmoticonImageWarmup(
        Array.from({ length: 10 }, (_, index) => `/background-${index}.svg`)
      )
      const backgroundBeforeRaf = images.length - backgroundStart
      clock.runFirst(clock.rafs)
      const backgroundAfterFirstRaf = images.length - backgroundStart
      const tasksAfterFirstRaf = clock.tasks.length
      clock.runFirst(clock.rafs)
      const tasksAfterSecondRaf = clock.tasks.length
      const firstTask = clock.tasks[0]
      firstTask?.callback()
      const backgroundFirstChunk = images.length - backgroundStart
      const nextTask = clock.tasks[1]
      cancelBackground()
      const nextTaskAborted = nextTask?.options.signal.aborted ?? false
      nextTask?.callback()
      const backgroundAfterLate = images.length - backgroundStart

      clock.reset()
      windowStub.scheduler = {
        postTask(callback, options) {
          clock.tasks.push({ callback, options })
          return Promise.resolve()
        },
      }
      const cancelledRafStart = images.length
      const cancelBeforeRaf = api.scheduleBackgroundEmoticonImageWarmup([
        '/cancelled-raf.svg',
      ])
      const staleFirstRaf = [...clock.rafs.values()][0]
      cancelBeforeRaf()
      const cancelledRafCount = clock.cancelledRafs.length
      staleFirstRaf?.()
      clock.runFirst(clock.rafs)
      const cancelledRafStarts = images.length - cancelledRafStart
      const cancelledRafTasks = clock.tasks.length

      clock.reset()
      windowStub.scheduler = undefined
      windowStub.requestIdleCallback = undefined
      windowStub.cancelIdleCallback = undefined
      const cancelNearTimer = api.scheduleEmoticonImagePrefetch(
        Array.from({ length: 9 }, (_, index) => `/near-timer-${index}.svg`)
      )
      const nearTimerDelay = [...clock.timers.values()][0]?.delay ?? null
      cancelNearTimer()
      const cancelledTimerCount = clock.cancelledTimers.length

      clock.reset()
      windowStub.requestIdleCallback = (callback, options) => {
        const handle = nextHandle++
        clock.idles.set(handle, { callback, options })
        return handle
      }
      windowStub.cancelIdleCallback = (handle) => clock.idles.delete(handle)
      api.scheduleBackgroundEmoticonImageWarmup(['/background-idle.svg'])
      clock.runFirst(clock.rafs)
      clock.runFirst(clock.rafs)
      const backgroundIdleTimeout = [...clock.idles.values()][0]?.options?.timeout ?? null

      clock.reset()
      windowStub.requestIdleCallback = undefined
      windowStub.cancelIdleCallback = undefined
      api.scheduleBackgroundEmoticonImageWarmup(['/background-timer.svg'])
      clock.runFirst(clock.rafs)
      clock.runFirst(clock.rafs)
      const backgroundTimerDelay = [...clock.timers.values()][0]?.delay ?? null

      delete globalThis.window
      const ssrCleanup = api.scheduleEmoticonImagePrefetch(['/ssr.svg'])
      define('window', windowStub)

      return {
        exports: Object.keys(api).sort(),
        nearSync,
        nearComplete,
        nearIdleTimeout,
        imageDecoding,
        imageFetchPriority,
        loadFirstBeforeDecode,
        loadFirstAfterBoth,
        decodeFirstBeforeLoad,
        decodeFirstAfterBoth,
        pendingStarts,
        errorSettled,
        settledStarts,
        cancelSync,
        cancelAfterLate,
        cancelledIdles: cancelledIdleCount,
        backgroundBeforeRaf,
        backgroundAfterFirstRaf,
        tasksAfterFirstRaf,
        tasksAfterSecondRaf,
        backgroundPriority: firstTask?.options.priority ?? null,
        backgroundFirstChunk,
        nextTaskAborted,
        backgroundAfterLate,
        cancelledRafCount,
        cancelledRafStarts,
        cancelledRafTasks,
        nearTimerDelay,
        cancelledTimerCount,
        backgroundIdleTimeout,
        backgroundTimerDelay,
        ssrCleanup: typeof ssrCleanup,
      }
    } finally {
      for (const [key, descriptor] of originalDescriptors) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor)
        else delete globalThis[key]
      }
    }
  }

  const expectedSignature = {
    exports: [
      'BACKGROUND_PREFETCH_CHUNK_SIZE',
      'PREFETCH_ROW_LOOKAHEAD',
      'PREFETCH_ROW_LOOKBEHIND',
      'hasSettledEmoticonImage',
      'markEmoticonImageSettled',
      'scheduleBackgroundEmoticonImageWarmup',
      'scheduleEmoticonImagePrefetch',
    ],
    nearSync: Array.from({ length: 8 }, (_, index) => `/near-${index}.svg`),
    nearComplete: Array.from({ length: 10 }, (_, index) => `/near-${index}.svg`),
    nearIdleTimeout: 700,
    imageDecoding: 'async',
    imageFetchPriority: 'low',
    loadFirstBeforeDecode: false,
    loadFirstAfterBoth: true,
    decodeFirstBeforeLoad: false,
    decodeFirstAfterBoth: true,
    pendingStarts: 1,
    errorSettled: true,
    settledStarts: 1,
    cancelSync: 8,
    cancelAfterLate: 8,
    cancelledIdles: 1,
    backgroundBeforeRaf: 0,
    backgroundAfterFirstRaf: 0,
    tasksAfterFirstRaf: 0,
    tasksAfterSecondRaf: 1,
    backgroundPriority: 'background',
    backgroundFirstChunk: 8,
    nextTaskAborted: true,
    backgroundAfterLate: 8,
    cancelledRafCount: 1,
    cancelledRafStarts: 0,
    cancelledRafTasks: 0,
    nearTimerDelay: 80,
    cancelledTimerCount: 1,
    backgroundIdleTimeout: 1200,
    backgroundTimerDelay: 120,
    ssrCleanup: 'function',
  }

  assert.deepEqual(await signatureFor(source, 'current'), expectedSignature)

  const mutants = [
    ['near chunk', 'const PREFETCH_CHUNK_SIZE = 8', 'const PREFETCH_CHUNK_SIZE = 7'],
    ["image decoding", "  image.decoding = 'async'", "  image.decoding = 'auto'"],
    [
      'image fetch priority',
      "    image.fetchPriority = 'low'",
      "    image.fetchPriority = 'high'",
    ],
    [
      'load and decode gate',
      '? image.decode().catch(() => undefined)',
      '? loadPromise',
    ],
    [
      'pending dedupe',
      'pendingEmoticonImagePrefetches.has(src)',
      'false',
    ],
    [
      'error settled',
      '    image.onerror = () => resolve()\n',
      '    image.onerror = () => undefined\n',
    ],
    ['near idle timeout', '{ timeout: 700 }', '{ timeout: 701 }'],
    ['near cancellation', '    if (isCancelled) {', '    if (false) {'],
    ['timer cancellation', '      clearTimeout(timeoutHandle)', '      void timeoutHandle'],
    [
      'animation frame cancellation',
      '      cancelAnimationFrame(animationFrameHandle)',
      '      void animationFrameHandle',
    ],
    [
      'double animation frame',
      "  animationFrameHandle = requestAnimationFrame(() => {\n    animationFrameHandle = requestAnimationFrame(scheduleChunk)\n  })",
      '  animationFrameHandle = requestAnimationFrame(scheduleChunk)',
    ],
    ['background idle timeout', '{ timeout: 1200 }', '{ timeout: 1201 }'],
    ['background timer fallback', 'setTimeout(runChunk, 120)', 'setTimeout(runChunk, 121)'],
  ]

  for (const [name, before, after] of mutants) {
    assert.ok(source.includes(before), `${name} mutation target must exist`)
    const mutant = source.split(before).join(after)
    assert.notDeepEqual(
      await signatureFor(mutant, `mutant-${name}`),
      expectedSignature,
      `${name} mutation must fail the durable scheduler contract`
    )
  }
})
