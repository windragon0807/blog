import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const srcRoot = join(root, 'src')
const libRoot = join(srcRoot, 'lib')
const envExamplePath = join(root, '.env.example')
const serverEnvPath = resolve(libRoot, 'server/env.ts')
const sourceExtensions = new Set(['.ts', '.tsx'])
const browserGlobalNames = new Set([
  'Document',
  'DocumentFragment',
  'DOMParser',
  'Element',
  'Event',
  'HTMLElement',
  'Image',
  'IntersectionObserver',
  'KeyboardEvent',
  'MouseEvent',
  'MutationObserver',
  'Navigator',
  'Node',
  'NodeList',
  'PointerEvent',
  'ResizeObserver',
  'Storage',
  'SVGElement',
  'TouchEvent',
  'Window',
  'Worker',
  'alert',
  'caches',
  'cancelAnimationFrame',
  'confirm',
  'document',
  'history',
  'indexedDB',
  'localStorage',
  'location',
  'matchMedia',
  'navigator',
  'prompt',
  'requestAnimationFrame',
  'screen',
  'sessionStorage',
  'window',
])
const legacyServerPaths = ['bookmark.ts', 'notion.ts', 'postContent.ts'].map(
  (fileName) => resolve(libRoot, fileName)
)

function toCanonicalPath(filePath) {
  const absolutePath = resolve(filePath)
  return ts.sys.useCaseSensitiveFileNames
    ? absolutePath
    : absolutePath.toLowerCase()
}

function toRepoPath(filePath) {
  return relative(root, filePath).split(sep).join('/')
}

function getSourceFiles(directory) {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name)

      if (entry.isDirectory()) {
        return getSourceFiles(entryPath)
      }

      if (
        !entry.isFile() ||
        !sourceExtensions.has(extname(entry.name)) ||
        ts.isDeclarationFileName(entry.name)
      ) {
        return []
      }

      return [resolve(entryPath)]
    })
}

function parseSource(filePath) {
  return ts.createSourceFile(
    filePath,
    readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
}

function getLiteralModuleLoad(node) {
  if (!ts.isCallExpression(node)) {
    return null
  }

  const loader =
    node.expression.kind === ts.SyntaxKind.ImportKeyword
      ? 'import'
      : ts.isIdentifier(node.expression) && node.expression.text === 'require'
        ? 'require'
        : null
  const firstArgument = node.arguments[0]

  if (
    loader === null ||
    firstArgument === undefined ||
    !ts.isStringLiteralLike(firstArgument) ||
    !(
      (loader === 'import' &&
        (node.arguments.length === 1 || node.arguments.length === 2)) ||
      (loader === 'require' && node.arguments.length === 1)
    )
  ) {
    return null
  }

  return { loader, specifier: firstArgument.text }
}

function getModuleSpecifiers(sourceFile) {
  const specifiers = []

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text)
    } else {
      const moduleLoad = getLiteralModuleLoad(node)

      if (moduleLoad !== null) {
        specifiers.push(moduleLoad.specifier)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return specifiers
}

function getDirectRuntimeImports(sourceFile) {
  return sourceFile.statements
    .filter(
      (statement) =>
        ts.isImportDeclaration(statement) &&
        statement.importClause === undefined &&
        ts.isStringLiteralLike(statement.moduleSpecifier)
    )
    .map((statement) => statement.moduleSpecifier.text)
}

function namedAccess(node, propertyName) {
  if (ts.isPropertyAccessExpression(node)) {
    return node.name.text === propertyName
  }

  return (
    ts.isElementAccessExpression(node) &&
    node.argumentExpression !== undefined &&
    ts.isStringLiteralLike(node.argumentExpression) &&
    node.argumentExpression.text === propertyName
  )
}

function isGlobalThisReference(node) {
  if (node === undefined) {
    return false
  }

  while (
    ts.isParenthesizedExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isNonNullExpression(node) ||
    ts.isSatisfiesExpression(node)
  ) {
    node = node.expression
  }

  return ts.isIdentifier(node) && node.text === 'globalThis'
}

function isGlobalThisProperty(node, propertyName) {
  return (
    (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
    isGlobalThisReference(node.expression) &&
    namedAccess(node, propertyName)
  )
}

function isProcessReference(node) {
  while (
    ts.isParenthesizedExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isNonNullExpression(node) ||
    ts.isSatisfiesExpression(node)
  ) {
    node = node.expression
  }

  return (
    (ts.isIdentifier(node) && node.text === 'process') ||
    isGlobalThisProperty(node, 'process')
  )
}

function isProcessEnvAccess(node) {
  return (
    (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
    namedAccess(node, 'env') &&
    isProcessReference(node.expression)
  )
}

function getBindingPropertyName(bindingElement) {
  if (bindingElement.dotDotDotToken) {
    return null
  }

  if (bindingElement.propertyName) {
    return ts.isIdentifier(bindingElement.propertyName) ||
      ts.isStringLiteralLike(bindingElement.propertyName)
      ? bindingElement.propertyName.text
      : null
  }

  return ts.isIdentifier(bindingElement.name) ? bindingElement.name.text : null
}

function getEnvKeysFromAccess(node) {
  const parent = node.parent

  if (
    (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent)) &&
    parent.expression === node
  ) {
    if (ts.isPropertyAccessExpression(parent)) {
      return [parent.name.text]
    }

    return parent.argumentExpression &&
      ts.isStringLiteralLike(parent.argumentExpression)
      ? [parent.argumentExpression.text]
      : [null]
  }

  if (
    ts.isVariableDeclaration(parent) &&
    parent.initializer === node &&
    ts.isObjectBindingPattern(parent.name)
  ) {
    return parent.name.elements.map(getBindingPropertyName)
  }

  return [null]
}

function findRawEnvAccesses(sourceFiles) {
  const accesses = []

  for (const filePath of sourceFiles) {
    const sourceFile = parseSource(filePath)

    function visit(node) {
      if (isProcessEnvAccess(node)) {
        accesses.push({
          filePath,
          keys: getEnvKeysFromAccess(node),
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        })
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
  }

  return accesses
}

function processReferenceIsAliased(node) {
  let expression = node

  while (
    expression.parent &&
    (ts.isParenthesizedExpression(expression.parent) ||
      ts.isAsExpression(expression.parent) ||
      ts.isTypeAssertionExpression(expression.parent) ||
      ts.isNonNullExpression(expression.parent) ||
      ts.isSatisfiesExpression(expression.parent)) &&
    expression.parent.expression === expression
  ) {
    expression = expression.parent
  }

  const parent = expression.parent

  return (
    ((ts.isVariableDeclaration(parent) || ts.isParameter(parent)) &&
      parent.initializer === expression) ||
    (ts.isBinaryExpression(parent) &&
      parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      parent.right === expression)
  )
}

function findProcessEscapesInSource(sourceFile, filePath) {
  const escapes = []

  function importIsTypeOnly(node) {
    const { importClause } = node

    if (!importClause) {
      return false
    }

    return (
      importClause.isTypeOnly ||
      (!importClause.name &&
        importClause.namedBindings !== undefined &&
        ts.isNamedImports(importClause.namedBindings) &&
        importClause.namedBindings.elements.length > 0 &&
        importClause.namedBindings.elements.every((element) => element.isTypeOnly))
    )
  }

  function exportIsTypeOnly(node) {
    return (
      node.isTypeOnly ||
      (node.exportClause !== undefined &&
        ts.isNamedExports(node.exportClause) &&
        node.exportClause.elements.length > 0 &&
        node.exportClause.elements.every((element) => element.isTypeOnly))
    )
  }

  function addEscape(node, kind) {
    escapes.push({
      filePath,
      kind,
      line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
    })
  }

  function visit(node) {
    const moduleLoad = getLiteralModuleLoad(node)

    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier) &&
      ['node:process', 'process'].includes(node.moduleSpecifier.text) &&
      !(
        (ts.isImportDeclaration(node) && importIsTypeOnly(node)) ||
        (ts.isExportDeclaration(node) && exportIsTypeOnly(node))
      )
    ) {
      addEscape(node, `module:${node.moduleSpecifier.text}`)
    } else if (
      moduleLoad !== null &&
      ['node:process', 'process'].includes(moduleLoad.specifier)
    ) {
      addEscape(node, `module:${moduleLoad.specifier}`)
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression &&
      ts.isStringLiteralLike(node.moduleReference.expression) &&
      ['node:process', 'process'].includes(node.moduleReference.expression.text) &&
      !node.isTypeOnly
    ) {
      addEscape(node, `module:${node.moduleReference.expression.text}`)
    }

    if (isProcessReference(node) && processReferenceIsAliased(node)) {
      addEscape(node, 'process-alias')
    }

    if (
      ts.isVariableDeclaration(node) &&
      isGlobalThisReference(node.initializer) &&
      ts.isObjectBindingPattern(node.name) &&
      node.name.elements.some(
        (element) => getBindingPropertyName(element) === 'process'
      )
    ) {
      addEscape(node, 'process-alias')
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return [
    ...new Map(
      escapes.map((escape) => [
        `${toCanonicalPath(escape.filePath)}:${escape.line}:${escape.kind}`,
        escape,
      ])
    ).values(),
  ]
}

function findProcessEscapes(sourceFiles) {
  return sourceFiles.flatMap((filePath) =>
    findProcessEscapesInSource(parseSource(filePath), filePath)
  )
}

function parseEnvExample() {
  const entries = new Map()

  for (const line of readFileSync(envExamplePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)

    if (match) {
      entries.set(match[1], match[2].trim())
    }
  }

  return entries
}

function getCompilerProgram(virtualSources = new Map()) {
  const tsconfigPath = join(root, 'tsconfig.json')
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  assert.equal(
    config.error,
    undefined,
    config.error ? ts.flattenDiagnosticMessageText(config.error.messageText, '\n') : ''
  )
  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    root,
    undefined,
    tsconfigPath
  )
  assert.deepEqual(
    parsed.errors,
    [],
    parsed.errors
      .map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n'))
      .join('\n')
  )
  const sourceTextByPath = new Map(
    [...virtualSources].map(([filePath, sourceText]) => [
      toCanonicalPath(filePath),
      sourceText,
    ])
  )
  const compilerHost = ts.createCompilerHost(parsed.options)
  const getSourceFile = compilerHost.getSourceFile.bind(compilerHost)

  compilerHost.getSourceFile = (fileName, languageVersion, ...rest) => {
    const sourceText = sourceTextByPath.get(toCanonicalPath(fileName))

    return sourceText === undefined
      ? getSourceFile(fileName, languageVersion, ...rest)
      : ts.createSourceFile(
          fileName,
          sourceText,
          languageVersion,
          true,
          fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
        )
  }

  return ts.createProgram({
    host: compilerHost,
    options: parsed.options,
    rootNames: [...parsed.fileNames, ...virtualSources.keys()],
  })
}

function isBrowserDomName(name) {
  return (
    browserGlobalNames.has(name) ||
    /^(?:HTML|SVG)[A-Z][A-Za-z0-9]*Element$/.test(name)
  )
}

function getStaticAccessName(node) {
  if (ts.isPropertyAccessExpression(node)) {
    return node.name.text
  }

  return node.argumentExpression && ts.isStringLiteralLike(node.argumentExpression)
    ? node.argumentExpression.text
    : null
}

function findExplicitGlobalThisReferences(sourceFile, filePath, checker) {
  const references = []

  function addReference(node, globalName, symbol) {
    if (!isBrowserGlobalReference(globalName, symbol)) {
      return
    }

    references.push({
      filePath,
      globalName,
      line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
    })
  }

  function visit(node) {
    if (
      (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
      isGlobalThisReference(node.expression)
    ) {
      const globalName = getStaticAccessName(node)

      if (globalName !== null) {
        const symbol = ts.isPropertyAccessExpression(node)
          ? checker.getSymbolAtLocation(node.name)
          : checker.getPropertyOfType(checker.getTypeAtLocation(node.expression), globalName)

        addReference(node, globalName, symbol)
      }
    } else if (
      ts.isVariableDeclaration(node) &&
      isGlobalThisReference(node.initializer) &&
      ts.isObjectBindingPattern(node.name)
    ) {
      const globalThisType = checker.getTypeAtLocation(node.initializer)

      for (const element of node.name.elements) {
        const globalName = getBindingPropertyName(element)

        if (globalName !== null) {
          addReference(
            element,
            globalName,
            checker.getPropertyOfType(globalThisType, globalName)
          )
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return references
}

function declarationComesFromBrowserDom(declaration) {
  return /^lib\.(?:dom|webworker)(?:\.[^.]+)*\.d\.ts$/i.test(
    basename(declaration.getSourceFile().fileName)
  )
}

function symbolComesFromBrowserDom(symbol) {
  return (symbol?.getDeclarations() ?? []).some(declarationComesFromBrowserDom)
}

function symbolComesOnlyFromBrowserDom(symbol) {
  const declarations = symbol?.getDeclarations() ?? []

  return declarations.length > 0 && declarations.every(declarationComesFromBrowserDom)
}

function isBrowserGlobalReference(globalName, symbol) {
  return (
    symbolComesFromBrowserDom(symbol) &&
    (isBrowserDomName(globalName) || symbolComesOnlyFromBrowserDom(symbol))
  )
}

function getReferencedGlobalSymbol(node, checker) {
  const symbol = checker.getSymbolAtLocation(node)
  const globalSymbol = checker.resolveName(
    node.text,
    undefined,
    ts.SymbolFlags.Value | ts.SymbolFlags.Type,
    false
  )

  return symbol === globalSymbol ? symbol : undefined
}

function findBrowserGlobalReferences(domainFiles, program = getCompilerProgram()) {
  if (domainFiles.length === 0) {
    return []
  }

  const checker = program.getTypeChecker()
  const references = []

  for (const filePath of domainFiles) {
    const sourceFile = program.getSourceFile(filePath)
    assert.ok(sourceFile, `TypeScript program did not include ${toRepoPath(filePath)}`)

    function visit(node) {
      if (ts.isIdentifier(node)) {
        const symbol = getReferencedGlobalSymbol(node, checker)

        if (isBrowserGlobalReference(node.text, symbol)) {
          references.push({
            filePath,
            globalName: node.text,
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
          })
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    references.push(...findExplicitGlobalThisReferences(sourceFile, filePath, checker))
  }

  return [
    ...new Map(
      references.map((reference) => [
        `${toCanonicalPath(reference.filePath)}:${reference.line}:${reference.globalName}`,
        reference,
      ])
    ).values(),
  ]
}

function formatFiles(files) {
  return files.map((filePath) => `- ${toRepoPath(filePath)}`).join('\n')
}

function formatLocations(items, label) {
  return items
    .map((item) => `- ${toRepoPath(item.filePath)}:${item.line} (${item[label]})`)
    .join('\n')
}

const sourceFiles = getSourceFiles(srcRoot)
const runtimeFolders = ['client', 'server', 'domain'].map((runtime) => {
  const directory = join(libRoot, runtime)
  return { directory, runtime, sourceFiles: getSourceFiles(directory) }
})
const clientFiles = runtimeFolders.find(({ runtime }) => runtime === 'client').sourceFiles
const serverFiles = runtimeFolders.find(({ runtime }) => runtime === 'server').sourceFiles
const domainFiles = runtimeFolders.find(({ runtime }) => runtime === 'domain').sourceFiles
const legacyServerFilesMissingMarkers = legacyServerPaths.filter(
  (filePath) => !getDirectRuntimeImports(parseSource(filePath)).includes('server-only')
)
const rawEnvAccesses = findRawEnvAccesses(sourceFiles)
const processEscapesOutsideEnvModule = findProcessEscapes(sourceFiles).filter(
  ({ filePath }) => toCanonicalPath(filePath) !== toCanonicalPath(serverEnvPath)
)
const envExample = parseEnvExample()
const envKeys = new Set(rawEnvAccesses.flatMap(({ keys }) => keys.filter(Boolean)))
const dynamicEnvAccesses = rawEnvAccesses.filter(({ keys }) => keys.includes(null))
const undocumentedEnvKeys = [...envKeys]
  .filter((key) => key !== 'NODE_ENV' && !envExample.has(key))
  .sort()
const rawEnvAccessesOutsideEnvModule = rawEnvAccesses.filter(
  ({ filePath }) => toCanonicalPath(filePath) !== toCanonicalPath(serverEnvPath)
)
const domainFrameworkImports = domainFiles.flatMap((filePath) =>
  getModuleSpecifiers(parseSource(filePath))
    .filter(
      (specifier) =>
        specifier === 'next' ||
        specifier.startsWith('next/') ||
        specifier === 'react' ||
        specifier.startsWith('react/') ||
        specifier === 'react-dom' ||
        specifier.startsWith('react-dom/')
    )
    .map((specifier) => ({ filePath, specifier }))
)
const domainBrowserGlobals = findBrowserGlobalReferences(domainFiles)

test('client, server, and domain runtime folders contain source modules', () => {
  const missingFolders = runtimeFolders.filter(
    ({ directory, sourceFiles: files }) => !existsSync(directory) || files.length === 0
  )

  assert.deepEqual(
    missingFolders.map(({ runtime }) => runtime),
    [],
    `Runtime boundaries must be non-vacuous:\n${missingFolders
      .map(({ runtime }) => `- src/lib/${runtime} needs at least one TS/TSX source module`)
      .join('\n')}`
  )
})

test('client and server source modules import their runtime marker directly', () => {
  const missingClientMarkers = clientFiles.filter(
    (filePath) => !getDirectRuntimeImports(parseSource(filePath)).includes('client-only')
  )
  const missingServerMarkers = serverFiles.filter(
    (filePath) => !getDirectRuntimeImports(parseSource(filePath)).includes('server-only')
  )

  assert.deepEqual(
    missingClientMarkers,
    [],
    `Client modules missing a direct client-only import:\n${formatFiles(
      missingClientMarkers
    )}`
  )
  assert.deepEqual(
    missingServerMarkers,
    [],
    `Server modules missing a direct server-only import:\n${formatFiles(
      missingServerMarkers
    )}`
  )
})

test('legacy server modules import server-only directly', () => {
  assert.deepEqual(
    legacyServerFilesMissingMarkers,
    [],
    `Legacy server modules missing a direct server-only import:\n${formatFiles(
      legacyServerFilesMissingMarkers
    )}`
  )
})

test('domain source modules do not depend on React, Next.js, or browser globals', () => {
  assert.deepEqual(
    domainFrameworkImports,
    [],
    `Domain modules import React or Next.js:\n${domainFrameworkImports
      .map(({ filePath, specifier }) => `- ${toRepoPath(filePath)} -> ${specifier}`)
      .join('\n')}`
  )
  assert.deepEqual(
    domainBrowserGlobals,
    [],
    `Domain modules reference browser globals:\n${formatLocations(
      domainBrowserGlobals,
      'globalName'
    )}`
  )
})

test('raw environment access is centralized in the server env module', () => {
  assert.ok(
    rawEnvAccesses.length > 0,
    'Environment contract must inspect at least one process.env access in src'
  )
  assert.ok(
    envKeys.size > 0,
    'Environment contract must discover at least one static process.env key'
  )
  assert.deepEqual(
    dynamicEnvAccesses,
    [],
    `Dynamic process.env access cannot be documented statically:\n${formatLocations(
      dynamicEnvAccesses,
      'keys'
    )}`
  )
  assert.deepEqual(
    processEscapesOutsideEnvModule,
    [],
    `Process imports and aliases are only allowed in src/lib/server/env.ts:\n${formatLocations(
      processEscapesOutsideEnvModule,
      'kind'
    )}`
  )
  assert.deepEqual(
    rawEnvAccessesOutsideEnvModule,
    [],
    `Raw process.env access is only allowed in src/lib/server/env.ts:\n${rawEnvAccessesOutsideEnvModule
      .map(({ filePath, keys, line }) =>
        `- ${toRepoPath(filePath)}:${line} (${keys.filter(Boolean).join(', ') || 'dynamic'})`
      )
      .join('\n')}`
  )
})

test('runtime escape detectors are non-vacuous', () => {
  const envEscapeFixture = ts.createSourceFile(
    'env-escape-fixture.ts',
    [
      "import { env } from 'node:process'",
      "import type { ProcessEnv } from 'node:process'",
      'const processAlias = process',
      'const { env: directProcessEnv } = (process)',
      'const { env: processEnv } = globalThis.process',
      'const globalProcessAlias = globalThis.process',
      'const { process: destructuredProcess } = globalThis',
      "void import('node:process')",
      "void import('node:process', { with: { type: 'json' } })",
    ].join('\n'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  assert.deepEqual(
    findProcessEscapesInSource(envEscapeFixture, 'env-escape-fixture.ts').map(
      ({ kind }) => kind
    ),
    [
      'module:node:process',
      'process-alias',
      'process-alias',
      'process-alias',
      'process-alias',
      'process-alias',
      'module:node:process',
      'module:node:process',
    ]
  )

  assert.equal(isBrowserDomName('Window'), true)
  assert.equal(isBrowserDomName('HTMLButtonElement'), true)
  assert.equal(isBrowserDomName('Worker'), true)
  assert.equal(isBrowserDomName('DomainModel'), false)

  const checker = getCompilerProgram().getTypeChecker()
  assert.equal(
    symbolComesFromBrowserDom(
      checker.resolveName('Window', undefined, ts.SymbolFlags.Type, false)
    ),
    true,
    'Window must resolve to the TypeScript DOM library for semantic detection'
  )

  const fixturePath = resolve(root, 'browser-global-fixture.ts')
  const fixtureSource = [
    'void customElements',
    'void getComputedStyle(document.body)',
    'addEventListener("fixture", () => {})',
    'void new FileReader()',
    'void new XMLHttpRequest()',
    'const browserWindow = undefined as Window | undefined',
    'void new Worker("fixture-worker.js")',
    'void document',
    'void globalThis.customElements',
    'void globalThis["getComputedStyle"]',
    'const { addEventListener: onFixture, FileReader: FixtureReader, XMLHttpRequest: FixtureRequest } = globalThis',
    'void fetch("https://example.com")',
    'void new URL("https://example.com")',
    'void globalThis.fetch',
    'const { URL: SharedUrl } = globalThis',
    'function useLocalShadows(customElements, FileReader) { customElements.define(); return new FileReader() }',
    'function useLocalGlobalThis(globalThis) { return globalThis.customElements }',
    'import { Worker as NodeWorker } from "node:worker_threads"',
  ].join('\n')
  const fixtureProgram = getCompilerProgram(new Map([[fixturePath, fixtureSource]]))
  const references = findBrowserGlobalReferences([fixturePath], fixtureProgram)
    .map(({ globalName, line }) => `${line}:${globalName}`)
    .sort()

  assert.deepEqual(references, [
    '10:getComputedStyle',
    '11:FileReader',
    '11:XMLHttpRequest',
    '11:addEventListener',
    '1:customElements',
    '2:document',
    '2:getComputedStyle',
    '3:addEventListener',
    '4:FileReader',
    '5:XMLHttpRequest',
    '6:Window',
    '7:Worker',
    '8:document',
    '9:customElements',
  ])
})

test('static environment keys are documented in .env.example', () => {
  assert.ok(
    envKeys.size > 0,
    'Environment documentation contract must inspect at least one static key'
  )
  assert.deepEqual(
    undocumentedEnvKeys,
    [],
    `Environment keys missing from .env.example:\n${undocumentedEnvKeys
      .map((key) => `- ${key}`)
      .join('\n')}`
  )
})

test('portfolio database configuration stays optional', () => {
  assert.equal(
    envExample.has('NOTION_PORTFOLIO_DATABASE_ID'),
    true,
    '.env.example must include optional NOTION_PORTFOLIO_DATABASE_ID='
  )
  assert.equal(
    envExample.get('NOTION_PORTFOLIO_DATABASE_ID'),
    '',
    'NOTION_PORTFOLIO_DATABASE_ID must remain optional in .env.example'
  )
})
