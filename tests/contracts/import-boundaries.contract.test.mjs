import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const srcRoot = join(root, 'src')
const tsconfigPath = join(root, 'tsconfig.json')
const sourceCodeExtensions = new Set([
  '.cjs',
  '.js',
  '.jsx',
  '.mjs',
  '.ts',
  '.tsx',
])
const nonCodeImportExtensions = new Set([
  '.avif',
  '.bmp',
  '.css',
  '.eot',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.json',
  '.less',
  '.mp3',
  '.mp4',
  '.ogg',
  '.otf',
  '.pdf',
  '.png',
  '.sass',
  '.scss',
  '.svg',
  '.ttf',
  '.wav',
  '.webm',
  '.webp',
  '.woff',
  '.woff2',
])

function isSourceCodeFileName(fileName) {
  return (
    sourceCodeExtensions.has(extname(fileName).toLowerCase()) &&
    !ts.isDeclarationFileName(fileName)
  )
}

function getSourceScriptKind(fileName) {
  return ts.getScriptKindFromFileName(fileName)
}

function getSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name)

      if (entry.isDirectory()) {
        return getSourceFiles(entryPath)
      }

      if (
        !entry.isFile() ||
        !isSourceCodeFileName(entry.name)
      ) {
        return []
      }

      return [resolve(entryPath)]
    })
}

function getCompilerOptions() {
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
  return parsed.options
}

function importDeclarationIsTypeOnly(node) {
  const { importClause } = node

  if (!importClause) {
    return false
  }

  if (importClause.isTypeOnly) {
    return true
  }

  if (importClause.name || !ts.isNamedImports(importClause.namedBindings)) {
    return false
  }

  return (
    importClause.namedBindings.elements.length > 0 &&
    importClause.namedBindings.elements.every((element) => element.isTypeOnly)
  )
}

function exportDeclarationIsTypeOnly(node) {
  if (node.isTypeOnly) {
    return true
  }

  return (
    node.exportClause !== undefined &&
    ts.isNamedExports(node.exportClause) &&
    node.exportClause.elements.length > 0 &&
    node.exportClause.elements.every((element) => element.isTypeOnly)
  )
}

function getModuleImports(sourceFile) {
  const imports = []

  function visit(node) {
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      imports.push({
        isTypeOnly: importDeclarationIsTypeOnly(node),
        specifier: node.moduleSpecifier.text,
      })
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      imports.push({
        isTypeOnly: exportDeclarationIsTypeOnly(node),
        specifier: node.moduleSpecifier.text,
      })
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression &&
      ts.isStringLiteralLike(node.moduleReference.expression)
    ) {
      imports.push({
        isTypeOnly: node.isTypeOnly,
        specifier: node.moduleReference.expression.text,
      })
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
    ) {
      const loader =
        node.expression.kind === ts.SyntaxKind.ImportKeyword ? 'import' : 'require'
      const firstArgument = node.arguments[0]
      const hasLiteralSpecifier =
        firstArgument !== undefined &&
        ts.isStringLiteralLike(firstArgument) &&
        ((loader === 'import' &&
          (node.arguments.length === 1 || node.arguments.length === 2)) ||
          (loader === 'require' && node.arguments.length === 1))

      imports.push({
        expression: node.getText(sourceFile),
        isTypeOnly: false,
        loader,
        specifier:
          hasLiteralSpecifier ? firstArgument.text : null,
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return imports
}

function getInternalImportKind(specifier) {
  if (specifier.startsWith('@/')) {
    return 'alias'
  }

  const normalizedSpecifier = specifier.replaceAll('\\', '/')

  if (
    normalizedSpecifier.startsWith('./') ||
    normalizedSpecifier.startsWith('../')
  ) {
    return 'relative'
  }

  return null
}

function getSpecifierPath(specifier) {
  return specifier.split(/[?#]/, 1)[0]
}

function isInternalCodeImport(specifier) {
  if (getInternalImportKind(specifier) === null) {
    return false
  }

  const extension = extname(getSpecifierPath(specifier)).toLowerCase()
  return !nonCodeImportExtensions.has(extension)
}

function isTypeDeclaration(filePath) {
  return ts.isDeclarationFileName(filePath)
}

function resolvesThroughDirectoryIndex(importer, specifier, target) {
  const specifierPath = getSpecifierPath(specifier)
  const targetExtension = extname(target).toLowerCase()

  if (
    !isSourceCodeFileName(target) ||
    basename(target).toLowerCase() !== `index${targetExtension}`
  ) {
    return false
  }

  const requestedPath = specifierPath.startsWith('@/')
    ? resolve(srcRoot, specifierPath.slice(2))
    : resolve(dirname(importer), specifierPath)

  return toCanonicalKey(requestedPath) === toCanonicalKey(dirname(target))
}

function buildImportGraph() {
  const sourceFiles = getSourceFiles(srcRoot)
  const sourceFilesByKey = new Map(
    sourceFiles.map((filePath) => [toCanonicalKey(filePath), filePath])
  )
  const compilerOptions = getCompilerOptions()
  const moduleResolutionCache = ts.createModuleResolutionCache(
    root,
    toCanonicalKey,
    compilerOptions
  )
  const graph = new Map(sourceFiles.map((filePath) => [filePath, new Set()]))
  const runtimeGraph = new Map(
    sourceFiles.map((filePath) => [filePath, new Set()])
  )
  const internalImports = []
  const nonLiteralModuleLoads = []
  const resolvedInternalEdges = []
  const unresolvedInternalImports = []

  for (const importer of sourceFiles) {
    const scriptKind = getSourceScriptKind(importer)
    const sourceFile = ts.createSourceFile(
      importer,
      readFileSync(importer, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      scriptKind
    )

    for (const moduleImport of getModuleImports(sourceFile)) {
      const { isTypeOnly, specifier } = moduleImport

      if (specifier === null) {
        nonLiteralModuleLoads.push({
          expression: moduleImport.expression,
          importer,
          loader: moduleImport.loader,
        })
        continue
      }

      const internalImportKind = getInternalImportKind(specifier)
      const internalCodeImport = isInternalCodeImport(specifier)

      if (internalImportKind !== null) {
        internalImports.push({ importer, isTypeOnly, specifier })
      }

      const resolvedModule = ts.resolveModuleName(
        specifier,
        importer,
        compilerOptions,
        ts.sys,
        moduleResolutionCache
      ).resolvedModule
      const target = resolvedModule
        ? sourceFilesByKey.get(toCanonicalKey(resolvedModule.resolvedFileName))
        : undefined

      if (target && internalCodeImport) {
        graph.get(importer).add(target)

        if (!isTypeOnly) {
          runtimeGraph.get(importer).add(target)
        }

        resolvedInternalEdges.push({
          importer,
          isTypeOnly,
          kind: internalImportKind,
          resolvesDirectoryIndex: resolvesThroughDirectoryIndex(
            importer,
            specifier,
            target
          ),
          specifier,
          target,
        })
      } else if (
        internalCodeImport &&
        (!resolvedModule || !isTypeDeclaration(resolvedModule.resolvedFileName))
      ) {
        unresolvedInternalImports.push({ importer, specifier })
      }
    }
  }

  return {
    graph,
    internalImports,
    nonLiteralModuleLoads,
    resolvedInternalEdges,
    runtimeGraph,
    unresolvedInternalImports,
  }
}

function toCanonicalKey(filePath) {
  const absolutePath = resolve(filePath)
  return ts.sys.useCaseSensitiveFileNames
    ? absolutePath
    : absolutePath.toLowerCase()
}

function findCycles(graph) {
  const state = new Map()
  const activePath = []
  const activeIndexes = new Map()
  const cycles = []

  function visit(node) {
    state.set(node, 'visiting')
    activeIndexes.set(node, activePath.length)
    activePath.push(node)

    for (const target of [...graph.get(node)].sort()) {
      if (!state.has(target)) {
        visit(target)
      } else if (state.get(target) === 'visiting') {
        const cycleStart = activeIndexes.get(target)
        cycles.push([...activePath.slice(cycleStart), target])
      }
    }

    activePath.pop()
    activeIndexes.delete(node)
    state.set(node, 'visited')
  }

  for (const node of graph.keys()) {
    if (!state.has(node)) {
      visit(node)
    }
  }

  return cycles
}

function getSrcSegments(filePath) {
  return relative(srcRoot, filePath).split(sep)
}

function getEdges(graph, predicate) {
  const edges = []

  for (const [importer, targets] of graph) {
    for (const target of targets) {
      if (predicate(importer, target)) {
        edges.push([importer, target])
      }
    }
  }

  return edges.sort(([leftFrom, leftTo], [rightFrom, rightTo]) =>
    `${leftFrom}\0${leftTo}`.localeCompare(`${rightFrom}\0${rightTo}`)
  )
}

function getFeatureName(filePath) {
  const segments = getSrcSegments(filePath)
  return segments[0] === 'features' ? segments[1] ?? null : null
}

function toRepoPath(filePath) {
  return relative(root, filePath).split(sep).join('/')
}

function formatEdges(edges) {
  return edges
    .map(([importer, target]) => `- ${toRepoPath(importer)} -> ${toRepoPath(target)}`)
    .join('\n')
}

function formatUnresolvedImports(imports) {
  return [...imports]
    .sort((left, right) =>
      `${left.importer}\0${left.specifier}`.localeCompare(
        `${right.importer}\0${right.specifier}`
      )
    )
    .map(({ importer, specifier }) => `- ${toRepoPath(importer)} -> ${specifier}`)
    .join('\n')
}

function isLibRuntimeFile(filePath, runtime) {
  const segments = getSrcSegments(filePath)
  return segments[0] === 'lib' && segments[1] === runtime
}

const serverOnlyLegacyModules = new Set(
  ['bookmark.ts', 'notion.ts', 'postContent.ts', 'seo.ts'].map((fileName) =>
    toCanonicalKey(join(srcRoot, 'lib', fileName))
  )
)

function isServerOnlyLegacyModule(filePath) {
  return serverOnlyLegacyModules.has(toCanonicalKey(filePath))
}

function findForbiddenRuntimePaths(runtimeGraph, starts, isForbidden) {
  const forbiddenPaths = []

  for (const start of starts.sort()) {
    const queue = [[start]]
    const visited = new Set([start])

    while (queue.length > 0) {
      const path = queue.shift()
      const current = path[path.length - 1]

      for (const target of [...runtimeGraph.get(current)].sort()) {
        if (visited.has(target)) {
          continue
        }

        const nextPath = [...path, target]

        if (isForbidden(target)) {
          forbiddenPaths.push(nextPath)
          queue.length = 0
          break
        }

        visited.add(target)
        queue.push(nextPath)
      }
    }
  }

  return forbiddenPaths
}

function formatRuntimePaths(paths) {
  return paths
    .map((path) => `- ${path.map(toRepoPath).join(' -> ')}`)
    .join('\n')
}

function isDeepParentImport(specifier) {
  const normalizedSegments = getSpecifierPath(specifier)
    .replaceAll('\\', '/')
    .split('/')
  let depth = 0
  let minimumDepth = 0

  for (const segment of normalizedSegments) {
    if (segment === '' || segment === '.') {
      continue
    }

    if (segment === '..') {
      depth -= 1
      minimumDepth = Math.min(minimumDepth, depth)
    } else {
      depth += 1
    }
  }

  return minimumDepth <= -2
}

function formatImports(imports) {
  return imports
    .map(({ importer, specifier }) => `- ${toRepoPath(importer)} -> ${specifier}`)
    .join('\n')
}

function formatModuleLoads(loads) {
  return loads
    .map(
      ({ expression, importer, loader }) =>
        `- ${toRepoPath(importer)} (${loader}): ${expression}`
    )
    .join('\n')
}

const {
  graph,
  internalImports,
  nonLiteralModuleLoads,
  resolvedInternalEdges,
  runtimeGraph,
  unresolvedInternalImports,
} = buildImportGraph()
const resolvedInternalEdgeCount = [...graph.values()].reduce(
  (total, targets) => total + targets.size,
  0
)
const resolvedAliasEdgeCount = resolvedInternalEdges.filter(
  ({ kind }) => kind === 'alias'
).length
const resolvedRelativeEdgeCount = resolvedInternalEdges.filter(
  ({ kind }) => kind === 'relative'
).length
const resolvedDirectoryIndexEdgeCount = resolvedInternalEdges.filter(
  ({ resolvesDirectoryIndex }) => resolvesDirectoryIndex
).length
const resolvedRuntimeEdgeCount = resolvedInternalEdges.filter(
  ({ isTypeOnly }) => !isTypeOnly
).length
const resolvedTypeOnlyEdgeCount = resolvedInternalEdges.filter(
  ({ isTypeOnly }) => isTypeOnly
).length
const cycles = findCycles(graph)
const edgesFromSharedToApp = getEdges(
  graph,
  (importer, target) =>
    getSrcSegments(importer)[0] === 'shared' &&
    getSrcSegments(target)[0] === 'app'
)
const crossFeatureEdges = getEdges(graph, (importer, target) => {
  const sourceFeature = getFeatureName(importer)
  const targetFeature = getFeatureName(target)
  return (
    sourceFeature !== null &&
    targetFeature !== null &&
    sourceFeature !== targetFeature
  )
})
const clientRuntimePathsToServer = findForbiddenRuntimePaths(
  runtimeGraph,
  [...runtimeGraph.keys()].filter((filePath) =>
    isLibRuntimeFile(filePath, 'client')
  ),
  (target) =>
    isLibRuntimeFile(target, 'server') || isServerOnlyLegacyModule(target)
)
const serverRuntimePathsToClient = findForbiddenRuntimePaths(
  runtimeGraph,
  [...runtimeGraph.keys()].filter((filePath) =>
    isLibRuntimeFile(filePath, 'server')
  ),
  (target) => isLibRuntimeFile(target, 'client')
)
const domainRuntimePathsOutsideBoundary = findForbiddenRuntimePaths(
  runtimeGraph,
  [...runtimeGraph.keys()].filter((filePath) =>
    isLibRuntimeFile(filePath, 'domain')
  ),
  (target) => {
    const segments = getSrcSegments(target)
    return !(
      (segments[0] === 'lib' && segments[1] === 'domain') ||
      segments[0] === 'types'
    )
  }
)
const deepParentImports = internalImports.filter(({ specifier }) =>
  isDeepParentImport(specifier)
)

test('internal import graph resolution is non-vacuous', () => {
  const fixtures = [
    ['fixture.ts', ts.ScriptKind.TS],
    ['fixture.tsx', ts.ScriptKind.TSX],
    ['fixture.js', ts.ScriptKind.JS],
    ['fixture.jsx', ts.ScriptKind.JSX],
    ['fixture.mjs', ts.ScriptKind.JS],
    ['fixture.cjs', ts.ScriptKind.JS],
  ]

  for (const [fileName, scriptKind] of fixtures) {
    assert.equal(isSourceCodeFileName(fileName), true)
    assert.equal(getSourceScriptKind(fileName), scriptKind)
    assert.equal(
      resolvesThroughDirectoryIndex(
        join(srcRoot, 'consumer.ts'),
        './directory',
        join(srcRoot, `directory/index${extname(fileName)}`)
      ),
      true
    )
  }

  assert.equal(isSourceCodeFileName('fixture.d.ts'), false)
  assert.equal(isSourceCodeFileName('fixture.css'), false)
  const importClassificationFixture = ts.createSourceFile(
    'import-classification-fixture.ts',
    [
      "import type { TypeOnly } from './type-only'",
      "import { type AlsoTypeOnly } from './also-type-only'",
      "import { runtime, type RuntimeType } from './runtime'",
      "export type { ExportedType } from './exported-type'",
      "export { type AlsoExportedType } from './also-exported-type'",
      "void import('./dynamic')",
      "void import('./data.json', { with: { type: 'json' } })",
      'void import(runtimePath)',
      'require(runtimePath)',
    ].join('\n'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  assert.deepEqual(
    getModuleImports(importClassificationFixture).map(
      ({ isTypeOnly, loader, specifier }) => [specifier, isTypeOnly, loader ?? null]
    ),
    [
      ['./type-only', true, null],
      ['./also-type-only', true, null],
      ['./runtime', false, null],
      ['./exported-type', true, null],
      ['./also-exported-type', true, null],
      ['./dynamic', false, 'import'],
      ['./data.json', false, 'import'],
      [null, false, 'import'],
      [null, false, 'require'],
    ],
    'Runtime reachability must exclude only type-only imports and exports'
  )
  const transitiveFixture = new Map([
    ['client', new Set(['facade'])],
    ['facade', new Set(['server'])],
    ['server', new Set()],
  ])
  assert.deepEqual(
    findForbiddenRuntimePaths(
      transitiveFixture,
      ['client'],
      (target) => target === 'server'
    ),
    [['client', 'facade', 'server']],
    'Runtime boundary checks must follow transitive imports through facades'
  )
  assert.equal(isDeepParentImport('../../module'), true)
  assert.equal(isDeepParentImport('..\\..\\module'), true)
  assert.equal(isDeepParentImport('../bridge/../../server'), true)
  assert.equal(isDeepParentImport('./x/../../../server'), true)
  assert.equal(isDeepParentImport('../module'), false)
  assert.equal(isDeepParentImport('../bridge/../server'), false)
  assert.equal(
    isInternalCodeImport('@/v1.0'),
    true,
    'Dotted directory imports must remain code candidates'
  )
  assert.equal(
    resolvesThroughDirectoryIndex(
      join(srcRoot, 'consumer.ts'),
      './v1.0',
      join(srcRoot, 'v1.0/index.ts')
    ),
    true,
    'Dotted directories must support extensionless index resolution'
  )
  assert.equal(
    resolvesThroughDirectoryIndex(
      join(srcRoot, 'consumer.ts'),
      './v1.0/index',
      join(srcRoot, 'v1.0/index.ts')
    ),
    false,
    'Explicit index imports are not directory index resolution'
  )
  assert.equal(
    unresolvedInternalImports.length,
    0,
    `Internal code imports not resolved to src source files:\n${formatUnresolvedImports(
      unresolvedInternalImports
    )}`
  )
  assert.ok(
    resolvedInternalEdgeCount > 0,
    'Expected at least one resolved internal import edge'
  )
  assert.ok(
    resolvedAliasEdgeCount > 0,
    'Expected at least one resolved @/ alias import edge'
  )
  assert.ok(
    resolvedRelativeEdgeCount > 0,
    'Expected at least one resolved relative import edge'
  )
  assert.ok(
    resolvedDirectoryIndexEdgeCount > 0,
    'Expected at least one extensionless directory index import edge'
  )
  assert.ok(
    resolvedRuntimeEdgeCount > 0,
    'Expected at least one resolved runtime import edge'
  )
  assert.ok(
    resolvedTypeOnlyEdgeCount > 0,
    'Expected at least one resolved type-only import edge'
  )
})

test('source import graph has no cycles', () => {
  assert.equal(
    cycles.length,
    0,
    `Import cycles detected:\n${cycles
      .map((cycle) => `- ${cycle.map(toRepoPath).join(' -> ')}`)
      .join('\n')}`
  )
})

test('src/shared does not import src/app', () => {
  assert.equal(
    edgesFromSharedToApp.length,
    0,
    `Forbidden src/shared -> src/app imports:\n${formatEdges(edgesFromSharedToApp)}`
  )
})

test('features do not directly import other features', () => {
  assert.equal(
    crossFeatureEdges.length,
    0,
    `Cross-feature imports detected:\n${formatEdges(crossFeatureEdges)}`
  )
})

test('client runtime graph does not reach server modules', () => {
  assert.equal(
    clientRuntimePathsToServer.length,
    0,
    `Forbidden client -> server runtime paths:\n${formatRuntimePaths(
      clientRuntimePathsToServer
    )}`
  )
})

test('server runtime graph does not reach client modules', () => {
  assert.equal(
    serverRuntimePathsToClient.length,
    0,
    `Forbidden server -> client runtime paths:\n${formatRuntimePaths(
      serverRuntimePathsToClient
    )}`
  )
})

test('domain runtime graph stays within domain and src/types', () => {
  assert.equal(
    domainRuntimePathsOutsideBoundary.length,
    0,
    `Forbidden domain runtime paths:\n${formatRuntimePaths(
      domainRuntimePathsOutsideBoundary
    )}`
  )
})

test('source imports do not traverse two or more parent directories', () => {
  assert.equal(
    deepParentImports.length,
    0,
    `Deep parent imports must use the @/ alias or an existing facade:\n${formatImports(
      deepParentImports
    )}`
  )
})

test('dynamic import and require calls use literal module specifiers', () => {
  assert.equal(
    nonLiteralModuleLoads.length,
    0,
    `Non-literal module loads can escape the import boundary graph:\n${formatModuleLoads(
      nonLiteralModuleLoads
    )}`
  )
})
