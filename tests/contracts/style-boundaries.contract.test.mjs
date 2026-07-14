import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, extname, join, posix, relative, sep } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import valueParser from 'postcss-value-parser'

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const globalsPath = 'src/app/globals.css'
const layoutPath = 'src/app/layout.tsx'
const resumeComponentPath = 'src/features/resume/components/ResumeDocument.tsx'
const resumeStylesPath =
  'src/features/resume/components/ResumeDocument.module.css'
const foundationPath = 'src/app/styles/foundation.css'

const externalImports = [
  "@import 'pretendard/dist/web/static/pretendard-dynamic-subset.css';",
  "@import 'overlayscrollbars/styles/overlayscrollbars.css';",
  '@import "tailwindcss";',
  '@import "tw-animate-css";',
]
const localStyles = [
  'foundation.css',
  'component-library.css',
  'emoticon-motion.css',
  'site-chrome.css',
  'surfaces.css',
  'notion-post.css',
  'settings.css',
  'lightbox-feedback.css',
  'reduced-motion.css',
]
const localImports = localStyles.map(
  (fileName) => `@import './styles/${fileName}';`
)
const expectedGlobals = [...externalImports, ...localImports].join('\n') + '\n'
const exactCustomVariant =
  '@custom-variant dark (&:where(html.dark, html.dark *));'
const exactThemeHash =
  'ba96305a64dcd6f9789f4cc04e4f10a0605d8d47d37681e32bbedb1a3f8167bb'
const monolith = {
  bytes: 33_475,
  sha256: '223a7733aa1a1d1db85dba5c10bbdc83322ec564f5133e46f27a274bb99523f7',
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function normalizePath(filePath) {
  return filePath.split(sep).join('/')
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name)
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath]
    })
}

function loadRepository() {
  const files = new Map()

  for (const base of ['src', 'tests/contracts']) {
    for (const filePath of listFiles(join(root, base))) {
      files.set(
        normalizePath(relative(root, filePath)),
        readFileSync(filePath, 'utf8')
      )
    }
  }

  return files
}

function parseCss(css, filePath = '<fixture>') {
  return postcss.parse(css, { from: filePath })
}

function meaningfulValueNodes(nodes) {
  return nodes.filter((node) => node.type !== 'comment' && node.type !== 'space')
}

function parseImportAtRule(atRule) {
  const nodes = meaningfulValueNodes(valueParser(atRule.params).nodes)
  const source = nodes[0]
  let specifier = null

  if (source?.type === 'string') {
    specifier = source.value
  } else if (source?.type === 'function' && source.value.toLowerCase() === 'url') {
    const urlNodes = meaningfulValueNodes(source.nodes ?? [])
    if (
      urlNodes.length === 1 &&
      (urlNodes[0].type === 'string' || urlNodes[0].type === 'word')
    ) {
      specifier = urlNodes[0].value
    }
  }

  return {
    atRule,
    hasLayerModifier: nodes.slice(1).some(
      (node) =>
        (node.type === 'word' && node.value.toLowerCase() === 'layer') ||
        (node.type === 'function' && node.value.toLowerCase() === 'layer')
    ),
    specifier,
  }
}

function parseImports(css, filePath = '<fixture>') {
  const imports = []
  parseCss(css, filePath).walkAtRules('import', (atRule) => {
    imports.push(parseImportAtRule(atRule))
  })
  return imports
}

function findTailwindAtRules(root) {
  const names = new Set([
    'custom-variant',
    'theme',
    'tailwind',
    'plugin',
    'source',
    'utility',
    'variant',
  ])
  const directives = []
  root.walkAtRules((atRule) => {
    if (names.has(atRule.name)) directives.push(atRule.name)
  })
  return directives
}

function cssImportsFromSource(source) {
  return Array.from(
    source.matchAll(/(?:import\s+(?:[^'";]+?\s+from\s+)?|import\s*\()(['"])([^'"]+\.css)\1/g),
    (match) => match[2]
  )
}

function addError(errors, code, detail = '') {
  errors.push(detail ? `${code}: ${detail}` : code)
}

function validateStyleBoundaries(files, { acceptMonolith = false } = {}) {
  const errors = []
  const globals = files.get(globalsPath)
  const layout = files.get(layoutPath)
  const resumeComponent = files.get(resumeComponentPath)

  if (globals === undefined) addError(errors, 'MISSING_GLOBALS')
  if (layout === undefined) addError(errors, 'MISSING_LAYOUT')
  if (resumeComponent === undefined) addError(errors, 'MISSING_RESUME_COMPONENT')
  if (errors.length > 0) return errors

  const layoutCssImports = cssImportsFromSource(layout)
  if (
    layoutCssImports.length !== 1 ||
    layoutCssImports[0] !== './globals.css'
  ) {
    addError(errors, 'LAYOUT_CSS_IMPORTS', layoutCssImports.join(','))
  }

  const resumeCssImports = cssImportsFromSource(resumeComponent)
  if (
    resumeCssImports.length !== 1 ||
    resumeCssImports[0] !== './ResumeDocument.module.css' ||
    !files.has(resumeStylesPath)
  ) {
    addError(errors, 'RESUME_CSS_IMPORT', resumeCssImports.join(','))
  }

  for (const [filePath, source] of files) {
    if (
      !filePath.startsWith('src/') ||
      !/\.[cm]?[jt]sx?$/.test(extname(filePath))
    ) {
      continue
    }
    const imports = cssImportsFromSource(source)
    if (imports.length === 0) continue

    const allowed =
      (filePath === layoutPath && imports.length === 1 && imports[0] === './globals.css') ||
      (filePath === resumeComponentPath &&
        imports.length === 1 &&
        imports[0] === './ResumeDocument.module.css')
    if (!allowed) addError(errors, 'UNAPPROVED_CSS_CONSUMER', filePath)
  }

  const globalsBytes = Buffer.byteLength(globals)
  const globalsHash = sha256(globals)
  const currentImports = parseImports(globals, globalsPath)
  const isExactMonolith =
    globalsBytes === monolith.bytes &&
    globalsHash === monolith.sha256

  if (isExactMonolith) {
    if (!acceptMonolith) addError(errors, 'MONOLITH_NOT_MIGRATED')
    return errors
  }

  if (globals !== expectedGlobals) {
    addError(errors, 'GLOBALS_IMPORT_SEQUENCE')
  }

  const malformedImports = currentImports.filter(({ specifier }) => specifier === null)
  for (const { atRule } of malformedImports) {
    addError(errors, 'MALFORMED_IMPORT', atRule.toString())
  }
  const importSpecifiers = currentImports.map(({ specifier }) => specifier ?? '')
  const expectedSpecifiers = [
    'pretendard/dist/web/static/pretendard-dynamic-subset.css',
    'overlayscrollbars/styles/overlayscrollbars.css',
    'tailwindcss',
    'tw-animate-css',
    ...localStyles.map((fileName) => `./styles/${fileName}`),
  ]
  if (JSON.stringify(importSpecifiers) !== JSON.stringify(expectedSpecifiers)) {
    addError(errors, 'IMPORT_INVENTORY_OR_ORDER')
  }
  if (new Set(importSpecifiers).size !== importSpecifiers.length) {
    addError(errors, 'DUPLICATE_IMPORT')
  }

  const styleRoot = posix.dirname('src/app/styles/_sentinel')
  const graph = new Map([[globalsPath, []]])
  const visitedTargets = new Set()

  function inspectLocalImport(ownerPath, specifier) {
    const target = posix.normalize(posix.join(posix.dirname(ownerPath), specifier))
    const insideStyleRoot =
      target.startsWith(`${styleRoot}/`) && !target.includes('/../')

    if (!insideStyleRoot) {
      addError(errors, 'IMPORT_TRAVERSAL', specifier)
      return null
    }

    graph.get(ownerPath)?.push(target)
    if (ownerPath === globalsPath) {
      if (visitedTargets.has(target)) addError(errors, 'DUPLICATE_TARGET', target)
      visitedTargets.add(target)
    }

    const source = files.get(target)
    if (source === undefined) {
      addError(errors, 'MISSING_STYLE_FILE', target)
      return target
    }
    if (source.trim().length === 0) addError(errors, 'EMPTY_STYLE_FILE', target)

    const nestedImports = parseImports(source, target)
    if (nestedImports.length > 0) {
      addError(errors, 'NESTED_LOCAL_IMPORT', target)
    }
    graph.set(target, [])
    for (const nestedImport of nestedImports) {
      if (nestedImport.specifier === null) {
        addError(errors, 'MALFORMED_IMPORT', nestedImport.atRule.toString())
      } else if (nestedImport.specifier.startsWith('.')) {
        const nestedTarget = posix.normalize(
          posix.join(posix.dirname(target), nestedImport.specifier)
        )
        graph.get(target).push(nestedTarget)
        const nestedInsideStyleRoot =
          nestedTarget.startsWith(`${styleRoot}/`) && !nestedTarget.includes('/../')
        if (!nestedInsideStyleRoot) {
          addError(errors, 'IMPORT_TRAVERSAL', nestedImport.specifier)
        } else if (!files.has(nestedTarget)) {
          addError(errors, 'MISSING_STYLE_FILE', nestedTarget)
        }
      }
    }
    return target
  }

  for (const specifier of importSpecifiers.filter((value) => value.startsWith('.'))) {
    inspectLocalImport(globalsPath, specifier)
  }

  const visiting = new Set()
  const visited = new Set()
  function visit(filePath) {
    if (visiting.has(filePath)) {
      addError(errors, 'STYLE_IMPORT_CYCLE', filePath)
      return
    }
    if (visited.has(filePath)) return
    visiting.add(filePath)
    for (const target of graph.get(filePath) ?? []) visit(target)
    visiting.delete(filePath)
    visited.add(filePath)
  }
  visit(globalsPath)

  if (visitedTargets.size !== localStyles.length) {
    addError(errors, 'VACUOUS_STYLE_GRAPH', String(visitedTargets.size))
  }

  const cssFiles = [globalsPath, ...Array.from(visitedTargets)]
  for (const filePath of cssFiles) {
    const source = files.get(filePath) ?? ''
    const rootNode = parseCss(source, filePath)
    const imports = []
    rootNode.walkAtRules('import', (atRule) => imports.push(parseImportAtRule(atRule)))
    let hasLayerAtRule = false
    rootNode.walkAtRules('layer', () => {
      hasLayerAtRule = true
    })
    if (hasLayerAtRule || imports.some(({ hasLayerModifier }) => hasLayerModifier)) {
      addError(errors, 'FORBIDDEN_CASCADE_LAYER', filePath)
    }

    const tailwindDirectives = findTailwindAtRules(rootNode)
    const expected = filePath === foundationPath ? ['custom-variant', 'theme'] : []
    if (JSON.stringify(tailwindDirectives) !== JSON.stringify(expected)) {
      addError(errors, 'TAILWIND_DIRECTIVE_INVENTORY', filePath)
    }
  }

  const foundation = files.get(foundationPath) ?? ''
  const foundationRoot = parseCss(foundation, foundationPath)
  const customVariants = []
  const themeBlocks = []
  foundationRoot.walkAtRules((atRule) => {
    if (atRule.name === 'custom-variant') customVariants.push(`${atRule.toString()};`)
    if (atRule.name === 'theme' && atRule.params.trim() === 'inline') {
      themeBlocks.push(atRule.toString())
    }
  })
  if (
    customVariants.length !== 1 ||
    customVariants[0] !== exactCustomVariant
  ) {
    addError(errors, 'MODIFIED_CUSTOM_VARIANT')
  }
  if (themeBlocks.length !== 1 || sha256(themeBlocks[0]) !== exactThemeHash) {
    addError(errors, 'MODIFIED_THEME_INLINE')
  }

  return errors
}

function readExactThemeInline(source, filePath) {
  const sourceRoot = parseCss(source, filePath)
  const themeNodes = []
  sourceRoot.walkAtRules((atRule) => {
    if (atRule.name === 'theme' && atRule.params.trim() === 'inline') {
      themeNodes.push(atRule.toString())
    }
  })
  assert.equal(
    themeNodes.length,
    1,
    `Future fixture requires one @theme inline source in ${filePath}`
  )
  assert.equal(
    sha256(themeNodes[0]),
    exactThemeHash,
    `Future fixture theme source hash changed in ${filePath}`
  )
  return themeNodes[0]
}

function reconstructExactInitialMonolith(files) {
  const body = localStyles
    .map((fileName) => {
      const filePath = `src/app/styles/${fileName}`
      const source = files.get(filePath)
      assert.ok(source, `Missing exact style slice for monolith reconstruction: ${filePath}`)
      return source
    })
    .join('')
  const source = `${externalImports.join('\n')}\n${body}`
  assert.equal(
    Buffer.byteLength(source),
    monolith.bytes,
    'Reconstructed initial monolith byte count changed'
  )
  assert.equal(
    sha256(source),
    monolith.sha256,
    'Reconstructed initial monolith hash changed'
  )
  return source
}

function createRepositoryShapeMatrix(current = loadRepository()) {
  const monolithCurrent = new Map(current)
  monolithCurrent.set(globalsPath, reconstructExactInitialMonolith(current))
  const migratedCurrent = new Map(current)
  migratedCurrent.set(globalsPath, expectedGlobals)
  return { migratedCurrent, monolithCurrent }
}

function createMigratedFutureFixture() {
  return createFutureFixture(createRepositoryShapeMatrix().migratedCurrent)
}

function createFutureFixture(current = loadRepository()) {
  let themeSource = current.get(foundationPath)
  let themeSourcePath = foundationPath

  if (themeSource === undefined) {
    const globals = current.get(globalsPath)
    assert.ok(globals, 'Future fixture fallback requires globals.css')
    assert.equal(
      Buffer.byteLength(globals),
      monolith.bytes,
      'Foundation fallback is allowed only for the exact initial monolith'
    )
    assert.equal(
      sha256(globals),
      monolith.sha256,
      'Foundation fallback is allowed only for the exact initial monolith'
    )
    themeSource = globals
    themeSourcePath = globalsPath
  }

  const theme = readExactThemeInline(themeSource, themeSourcePath)

  const files = new Map(current)
  files.set(globalsPath, expectedGlobals)
  for (const fileName of localStyles) {
    files.set(
      `src/app/styles/${fileName}`,
      fileName === 'foundation.css'
        ? `${exactCustomVariant}\n\n${theme}\n`
        : `.phase-05-${fileName.replace('.css', '')} { color: inherit; }\n`
    )
  }
  return files
}

function mutate(files, filePath, transform) {
  const copy = new Map(files)
  copy.set(filePath, transform(copy.get(filePath)))
  return copy
}

function expectError(files, code) {
  const errors = validateStyleBoundaries(files)
  assert.ok(
    errors.some((error) => error === code || error.startsWith(`${code}:`)),
    `Expected ${code}, received:\n${errors.join('\n')}`
  )
}

function protectedFileErrors(baseline, current) {
  const errors = []
  const paths = new Set([...baseline.keys(), ...current.keys()])
  for (const filePath of paths) {
    if (!baseline.has(filePath)) errors.push(`UNAPPROVED_PROTECTED_FILE: ${filePath}`)
    else if (!current.has(filePath)) errors.push(`MISSING_PROTECTED_FILE: ${filePath}`)
    else if (baseline.get(filePath) !== current.get(filePath)) {
      errors.push(`MUTATED_PROTECTED_FILE: ${filePath}`)
    }
  }
  return errors.sort()
}

test('future style boundary fixture is valid', () => {
  for (const [shape, current] of Object.entries(createRepositoryShapeMatrix())) {
    const fixture = createFutureFixture(current)
    assert.equal(fixture.get(globalsPath), expectedGlobals, `${shape} globals`)
    for (const fileName of localStyles) {
      assert.ok(
        fixture.get(`src/app/styles/${fileName}`)?.trim(),
        `${shape} produced an empty ${fileName}`
      )
    }
    assert.deepEqual(validateStyleBoundaries(fixture), [], shape)
  }
})

test('future fixture construction works from monolith and migrated repository shapes', () => {
  const current = loadRepository()
  current.set(globalsPath, expectedGlobals)
  const markerPath = 'src/phase-05-fixture-source-marker.ts'
  current.set(markerPath, 'export const sourceShape = "matrix"\n')
  const { migratedCurrent, monolithCurrent } = createRepositoryShapeMatrix(current)

  monolithCurrent.set(markerPath, 'export const sourceShape = "monolith"\n')
  assert.deepEqual(validateStyleBoundaries(monolithCurrent, { acceptMonolith: true }), [])
  const monolithFixture = createFutureFixture(monolithCurrent)
  assert.equal(monolithFixture.get(markerPath), monolithCurrent.get(markerPath))
  assert.deepEqual(validateStyleBoundaries(monolithFixture), [])

  migratedCurrent.set(markerPath, 'export const sourceShape = "migrated"\n')
  assert.deepEqual(validateStyleBoundaries(migratedCurrent), [])
  const migratedFixture = createFutureFixture(migratedCurrent)
  assert.equal(migratedFixture.get(markerPath), migratedCurrent.get(markerPath))
  assert.deepEqual(validateStyleBoundaries(migratedFixture), [])

  const initialCurrent = new Map(monolithCurrent)
  initialCurrent.delete('src/app/styles/foundation.css')
  const initialFixture = createFutureFixture(initialCurrent)
  assert.equal(initialFixture.get(markerPath), initialCurrent.get(markerPath))
  assert.deepEqual(validateStyleBoundaries(initialFixture), [])

  const missingFoundation = new Map(migratedFixture)
  missingFoundation.delete('src/app/styles/foundation.css')
  expectError(missingFoundation, 'MISSING_STYLE_FILE')

  const mutatedFoundationCurrent = mutate(
    migratedCurrent,
    'src/app/styles/foundation.css',
    (source) => source.replace('--color-background', '--color-page-background')
  )
  assert.throws(
    () => createFutureFixture(mutatedFoundationCurrent),
    /Future fixture theme source hash changed/
  )
})

test('contract catches missing, extra, reordered, and duplicate imports', () => {
  const fixture = createMigratedFutureFixture()
  expectError(
    mutate(fixture, globalsPath, (source) =>
      source.replace(`${localImports[1]}\n`, '')
    ),
    'IMPORT_INVENTORY_OR_ORDER'
  )
  expectError(
    mutate(fixture, globalsPath, (source) =>
      source + "@import './styles/extra.css';\n"
    ),
    'GLOBALS_IMPORT_SEQUENCE'
  )
  expectError(
    mutate(fixture, globalsPath, (source) =>
      source.replace(
        `${localImports[0]}\n${localImports[1]}`,
        `${localImports[1]}\n${localImports[0]}`
      )
    ),
    'IMPORT_INVENTORY_OR_ORDER'
  )
  expectError(
    mutate(fixture, globalsPath, (source) => source + `${localImports[0]}\n`),
    'DUPLICATE_IMPORT'
  )
})

test('contract catches nested imports, traversal, cycles, empty files, and vacuous graphs', () => {
  const fixture = createMigratedFutureFixture()
  expectError(
    mutate(fixture, 'src/app/styles/component-library.css', (source) =>
      `@import './site-chrome.css' screen and (min-width: 1px);\n${source}`
    ),
    'NESTED_LOCAL_IMPORT'
  )
  expectError(
    mutate(fixture, 'src/app/styles/component-library.css', (source) =>
      `@import url(./site-chrome.css) supports(display: grid);\n${source}`
    ),
    'NESTED_LOCAL_IMPORT'
  )
  expectError(
    mutate(fixture, globalsPath, (source) =>
      source.replace(localImports[0], "@import '../outside.css';")
    ),
    'IMPORT_TRAVERSAL'
  )
  const cycle = mutate(
    fixture,
    'src/app/styles/foundation.css',
    (source) => `@import '../globals.css';\n${source}`
  )
  expectError(cycle, 'STYLE_IMPORT_CYCLE')
  expectError(
    mutate(fixture, 'src/app/styles/settings.css', () => '\n'),
    'EMPTY_STYLE_FILE'
  )
  expectError(
    mutate(fixture, 'src/app/styles/component-library.css', (source) =>
      `@import url(./missing.css) supports(display: grid);\n${source}`
    ),
    'MISSING_STYLE_FILE'
  )
  expectError(
    mutate(fixture, 'src/app/styles/component-library.css', (source) =>
      `@import '../../../outside.css' screen and (min-width: 1px);\n${source}`
    ),
    'IMPORT_TRAVERSAL'
  )
  const unquotedCycle = mutate(
    fixture,
    'src/app/styles/foundation.css',
    (source) => `@import url(../globals.css);\n${source}`
  )
  expectError(unquotedCycle, 'STYLE_IMPORT_CYCLE')
  const withoutGraph = new Map(fixture)
  withoutGraph.set(globalsPath, externalImports.join('\n') + '\n')
  expectError(withoutGraph, 'VACUOUS_STYLE_GRAPH')
})

test('contract catches changed or forbidden Tailwind and layer directives', () => {
  const fixture = createMigratedFutureFixture()
  expectError(
    mutate(fixture, 'src/app/styles/foundation.css', (source) =>
      source.replace('html.dark *', 'html[data-theme="dark"] *')
    ),
    'MODIFIED_CUSTOM_VARIANT'
  )
  expectError(
    mutate(fixture, 'src/app/styles/foundation.css', (source) =>
      source.replace('--color-background', '--color-page-background')
    ),
    'MODIFIED_THEME_INLINE'
  )
  expectError(
    mutate(fixture, 'src/app/styles/site-chrome.css', (source) =>
      `@utility phase-05-test { display: block; }\n${source}`
    ),
    'TAILWIND_DIRECTIVE_INVENTORY'
  )
  expectError(
    mutate(fixture, 'src/app/styles/surfaces.css', (source) =>
      `@layer components {\n${source}}\n`
    ),
    'FORBIDDEN_CASCADE_LAYER'
  )
  expectError(
    mutate(fixture, 'src/app/styles/surfaces.css', (source) =>
      `.layered { color: red; }\n@import url("x.css") layer(components);\n${source}`
    ),
    'FORBIDDEN_CASCADE_LAYER'
  )

  const commented = mutate(
    fixture,
    'src/app/styles/surfaces.css',
    (source) =>
      `/* @import './site-chrome.css' screen and (min-width: 1px); */\n/* @import url(./missing.css) supports(display: grid); */\n/* @import url(../../../outside.css) layer(components); */\n/* @layer components {} */\n/* @utility ignored {} */\n${source}`
  )
  assert.deepEqual(validateStyleBoundaries(commented), [])
})

test('contract catches CSS consumer and protected-test mutations', () => {
  const fixture = createMigratedFutureFixture()
  expectError(
    mutate(fixture, layoutPath, (source) =>
      source.replace("import './globals.css'", "import './styles/foundation.css'")
    ),
    'LAYOUT_CSS_IMPORTS'
  )
  expectError(
    mutate(fixture, resumeComponentPath, (source) =>
      source.replace(
        "import styles from './ResumeDocument.module.css'",
        "import styles from './ResumeDocument.css'"
      )
    ),
    'RESUME_CSS_IMPORT'
  )

  const protectedBaseline = new Map([
    ['tests/contracts/import-boundaries.contract.test.mjs', 'abc123'],
  ])
  const protectedCurrent = new Map(protectedBaseline)
  protectedCurrent.set('tests/contracts/import-boundaries.contract.test.mjs', 'mutated')
  assert.deepEqual(protectedFileErrors(protectedBaseline, protectedCurrent), [
    'MUTATED_PROTECTED_FILE: tests/contracts/import-boundaries.contract.test.mjs',
  ])
  assert.deepEqual(protectedFileErrors(protectedBaseline, new Map()), [
    'MISSING_PROTECTED_FILE: tests/contracts/import-boundaries.contract.test.mjs',
  ])
  assert.deepEqual(
    protectedFileErrors(
      protectedBaseline,
      new Map([
        ...protectedBaseline,
        ['tests/contracts/unapproved.contract.test.mjs', 'new'],
      ])
    ),
    ['UNAPPROVED_PROTECTED_FILE: tests/contracts/unapproved.contract.test.mjs']
  )
})

test('repository satisfies the future style boundary contract after migration', () => {
  const errors = validateStyleBoundaries(loadRepository())
  assert.deepEqual(errors, [], errors.join('\n'))
})
