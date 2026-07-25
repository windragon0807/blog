import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '../..')
const modulePath = join(
  root,
  'src/features/emoticon-storage/model/emoticon-favorites.ts'
)

async function loadFavoritesModule() {
  const source = readFileSync(modulePath, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  })
  const require = createRequire(import.meta.url)
  const moduleShim = { exports: {} }
  const wrapper = new Function(
    'exports',
    'require',
    'module',
    '__filename',
    '__dirname',
    outputText
  )
  wrapper(moduleShim.exports, require, moduleShim, modulePath, dirname(modulePath))
  return moduleShim.exports
}

const manifest = {
  generatedAt: 'test',
  collections: [
    {
      id: 'material',
      name: 'Material',
      sourceLabel: 'Material',
      count: 1,
      items: [
        {
          id: 'material-3d',
          name: '3d',
          filename: '3d.svg',
          src: '/emoticons/material/3d.svg',
        },
      ],
    },
    {
      id: 'tossface',
      name: 'Tossface',
      sourceLabel: 'Tossface',
      count: 1,
      items: [
        {
          id: 'tossface-smile',
          name: '미소',
          filename: '미소.svg',
          src: '/emoticons/tossface/미소.svg',
        },
      ],
    },
  ],
}

test('parseFavoriteEntries keeps valid entries and drops garbage', async () => {
  const { parseFavoriteEntries } = await loadFavoritesModule()
  assert.deepEqual(parseFavoriteEntries(null), [])
  assert.deepEqual(
    parseFavoriteEntries([
      { collectionId: 'material', itemId: 'material-3d', addedAt: 10 },
      { collectionId: 'favorites', itemId: 'x', addedAt: 1 },
      { collectionId: 'material', itemId: 1, addedAt: 2 },
      'nope',
    ]),
    [{ collectionId: 'material', itemId: 'material-3d', addedAt: 10 }]
  )
})

test('toggleFavoriteEntry adds newest-first and removes on second toggle', async () => {
  const { toggleFavoriteEntry } = await loadFavoritesModule()
  const once = toggleFavoriteEntry([], 'material', 'material-3d', 100)
  assert.deepEqual(once, [
    { collectionId: 'material', itemId: 'material-3d', addedAt: 100 },
  ])
  const twice = toggleFavoriteEntry(once, 'tossface', 'tossface-smile', 200)
  assert.deepEqual(twice, [
    { collectionId: 'tossface', itemId: 'tossface-smile', addedAt: 200 },
    { collectionId: 'material', itemId: 'material-3d', addedAt: 100 },
  ])
  const removed = toggleFavoriteEntry(twice, 'material', 'material-3d', 300)
  assert.deepEqual(removed, [
    { collectionId: 'tossface', itemId: 'tossface-smile', addedAt: 200 },
  ])
})

test('resolveFavoriteItems sorts newest-first and prunes missing', async () => {
  const { resolveFavoriteItems } = await loadFavoritesModule()
  const entries = [
    { collectionId: 'material', itemId: 'material-3d', addedAt: 100 },
    { collectionId: 'tossface', itemId: 'missing', addedAt: 300 },
    { collectionId: 'tossface', itemId: 'tossface-smile', addedAt: 200 },
  ]
  const { items, prunedEntries } = resolveFavoriteItems(entries, manifest)
  assert.deepEqual(
    items.map((item) => item.id),
    ['tossface-smile', 'material-3d']
  )
  assert.deepEqual(prunedEntries, [
    { collectionId: 'tossface', itemId: 'tossface-smile', addedAt: 200 },
    { collectionId: 'material', itemId: 'material-3d', addedAt: 100 },
  ])
})

test('isFavoriteEntry and getSourceCollectionIdFromEntries', async () => {
  const {
    isFavoriteEntry,
    getSourceCollectionIdFromEntries,
  } = await loadFavoritesModule()
  const entries = [
    { collectionId: 'material', itemId: 'material-3d', addedAt: 100 },
  ]
  assert.equal(isFavoriteEntry(entries, 'material', 'material-3d'), true)
  assert.equal(isFavoriteEntry(entries, 'tossface', 'material-3d'), false)
  assert.equal(
    getSourceCollectionIdFromEntries(entries, 'material-3d'),
    'material'
  )
  assert.equal(getSourceCollectionIdFromEntries(entries, 'nope'), null)
})
