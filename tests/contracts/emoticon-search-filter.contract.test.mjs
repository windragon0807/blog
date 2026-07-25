import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import ts from 'typescript'
import { createRequire } from 'node:module'

const root = resolve(import.meta.dirname, '../..')
const filterPath = join(root, 'src/features/emoticon-storage/model/filter-items.ts')

async function loadFilterModule() {
  const source = readFileSync(filterPath, 'utf8')
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
  wrapper(moduleShim.exports, require, moduleShim, filterPath, dirname(filterPath))
  return moduleShim.exports
}

const sections = [
  {
    id: 'smileys-people',
    label: '표정',
    items: [
      { id: '1', name: '가면', filename: 'a.svg', src: '/a.svg' },
      { id: '2', name: '축구공', filename: 'b.svg', src: '/b.svg' },
    ],
  },
  {
    id: 'files',
    label: '파일',
    items: [
      { id: '3', name: 'ABAP', filename: 'c.svg', src: '/c.svg' },
      { id: '4', name: 'ActionScript', filename: 'd.svg', src: '/d.svg' },
    ],
  },
]

test('normalizeEmoticonSearchQuery trims, removes spaces, lowercases', async () => {
  const { normalizeEmoticonSearchQuery } = await loadFilterModule()
  assert.equal(normalizeEmoticonSearchQuery('  Foo  Bar '), 'foobar')
  assert.equal(normalizeEmoticonSearchQuery('가면'), '가면')
})

test('filterEmoticonSections returns same sections for empty/whitespace query', async () => {
  const { filterEmoticonSections } = await loadFilterModule()
  assert.deepEqual(filterEmoticonSections(sections, ''), sections)
  assert.deepEqual(filterEmoticonSections(sections, '   '), sections)
})

test('filterEmoticonSections matches name case-insensitively and ignores spaces', async () => {
  const { filterEmoticonSections } = await loadFilterModule()
  const result = filterEmoticonSections(sections, 'ab ap')
  assert.deepEqual(
    result.map((section) => ({
      id: section.id,
      names: section.items.map((item) => item.name),
    })),
    [{ id: 'files', names: ['ABAP'] }]
  )
})

test('filterEmoticonSections matches Korean substring and drops empty sections', async () => {
  const { filterEmoticonSections } = await loadFilterModule()
  const result = filterEmoticonSections(sections, '축구')
  assert.equal(result.length, 1)
  assert.equal(result[0].id, 'smileys-people')
  assert.deepEqual(
    result[0].items.map((item) => item.name),
    ['축구공']
  )
})
