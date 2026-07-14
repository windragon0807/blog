/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const ts = require('typescript')

const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const ignoredPackageDependencies = new Set(['next', 'react', 'react-dom'])

function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep)
}

function isPathInsideRoot(root, candidate) {
  const relativePath = path.relative(root, candidate)

  return (
    relativePath === '' ||
    (!relativePath.startsWith(`..${path.sep}`) &&
      relativePath !== '..' &&
      !path.isAbsolute(relativePath))
  )
}

function getScriptKind(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.js':
    case '.cjs':
    case '.mjs':
      return ts.ScriptKind.JS
    case '.jsx':
      return ts.ScriptKind.JSX
    case '.tsx':
      return ts.ScriptKind.TSX
    default:
      return ts.ScriptKind.TS
  }
}

function importDeclarationHasRuntimeEdge(statement) {
  const importClause = statement.importClause

  if (!importClause) return true
  if (importClause.isTypeOnly) return false
  if (importClause.name) return true
  if (!importClause.namedBindings) return false

  if (ts.isNamespaceImport(importClause.namedBindings)) return true

  const elements = importClause.namedBindings.elements
  return (
    elements.length === 0 || elements.some((element) => !element.isTypeOnly)
  )
}

function exportDeclarationHasRuntimeEdge(statement) {
  if (statement.isTypeOnly) return false
  if (!statement.exportClause) return true
  if (ts.isNamespaceExport(statement.exportClause)) return true

  const elements = statement.exportClause.elements
  return (
    elements.length === 0 || elements.some((element) => !element.isTypeOnly)
  )
}

function getRuntimeModuleSpecifiers(content, filePath) {
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(filePath)
  )
  const specifiers = []

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteralLike(statement.moduleSpecifier) &&
      importDeclarationHasRuntimeEdge(statement)
    ) {
      specifiers.push(statement.moduleSpecifier.text)
      continue
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteralLike(statement.moduleSpecifier) &&
      exportDeclarationHasRuntimeEdge(statement)
    ) {
      specifiers.push(statement.moduleSpecifier.text)
      continue
    }

    if (
      ts.isImportEqualsDeclaration(statement) &&
      !statement.isTypeOnly &&
      ts.isExternalModuleReference(statement.moduleReference) &&
      statement.moduleReference.expression &&
      ts.isStringLiteralLike(statement.moduleReference.expression)
    ) {
      specifiers.push(statement.moduleReference.expression.text)
    }
  }

  return specifiers
}

function isLocalImport(importSpecifier) {
  return (
    importSpecifier.startsWith('@/') ||
    importSpecifier.startsWith('./') ||
    importSpecifier.startsWith('../') ||
    path.isAbsolute(importSpecifier)
  )
}

function getPackageName(importSpecifier) {
  if (importSpecifier.startsWith('@')) {
    return importSpecifier.split('/').slice(0, 2).join('/')
  }

  return importSpecifier.split('/')[0]
}

function getResolutionCandidates(basePath) {
  const extension = path.extname(basePath).toLowerCase()

  if (sourceExtensions.includes(extension)) {
    return [basePath]
  }

  return [
    ...sourceExtensions.map((sourceExtension) => `${basePath}${sourceExtension}`),
    ...sourceExtensions.map((sourceExtension) =>
      path.join(basePath, `index${sourceExtension}`)
    ),
  ]
}

function formatGraphError(message, context) {
  return new Error(
    `${message} (slug: ${context.slug}, importer: ${context.importer}, specifier: ${context.specifier})`
  )
}

function resolveLocalImport({ fileSystem, importer, root, slug, specifier }) {
  const importerAbsolutePath = path.join(root, importer)
  let unresolvedBasePath

  if (specifier.startsWith('@/')) {
    unresolvedBasePath = path.resolve(root, 'src', specifier.slice(2))
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    unresolvedBasePath = path.resolve(path.dirname(importerAbsolutePath), specifier)
  } else {
    throw formatGraphError('Unsupported absolute local import', {
      importer,
      slug,
      specifier,
    })
  }

  if (!isPathInsideRoot(root, unresolvedBasePath)) {
    throw formatGraphError('Local import escapes the repository root', {
      importer,
      slug,
      specifier,
    })
  }

  for (const candidate of getResolutionCandidates(unresolvedBasePath)) {
    if (!isPathInsideRoot(root, candidate) || !fileSystem.existsSync(candidate)) {
      continue
    }

    const stats = fileSystem.statSync(candidate)
    if (!stats.isFile()) continue

    const realCandidate = fileSystem.realpathSync(candidate)
    if (!isPathInsideRoot(root, realCandidate)) {
      throw formatGraphError('Resolved local import escapes the repository root', {
        importer,
        slug,
        specifier,
      })
    }

    return toPosixPath(path.relative(root, candidate))
  }

  throw formatGraphError('Unable to resolve local import', {
    importer,
    slug,
    specifier,
  })
}

function getRegistryFileType(filePath) {
  return filePath.startsWith('src/lib/') ? 'registry:lib' : 'registry:ui'
}

function collectRegistryFiles({ entryPath, fileSystem, root, slug }) {
  const files = []
  const visited = new Set()

  function visit(filePath) {
    if (visited.has(filePath)) return
    visited.add(filePath)

    const absolutePath = path.join(root, filePath)
    const graphContext = {
      importer: filePath,
      slug,
      specifier: filePath,
    }

    if (!isPathInsideRoot(root, absolutePath)) {
      throw formatGraphError('Registry source file escapes the repository root', graphContext)
    }

    if (!fileSystem.existsSync(absolutePath)) {
      throw formatGraphError('Missing registry source file', {
        importer: filePath,
        slug,
        specifier: filePath,
      })
    }

    if (!fileSystem.statSync(absolutePath).isFile()) {
      throw formatGraphError('Registry source path is not a file', graphContext)
    }

    const realAbsolutePath = fileSystem.realpathSync(absolutePath)
    if (!isPathInsideRoot(root, realAbsolutePath)) {
      throw formatGraphError(
        'Registry source file escapes the repository root',
        graphContext
      )
    }

    const content = fileSystem.readFileSync(realAbsolutePath, 'utf8')
    files.push({
      path: filePath,
      content,
      type: getRegistryFileType(filePath),
    })

    for (const specifier of getRuntimeModuleSpecifiers(content, filePath)) {
      if (!isLocalImport(specifier)) continue

      const resolvedPath = resolveLocalImport({
        fileSystem,
        importer: filePath,
        root,
        slug,
        specifier,
      })
      visit(resolvedPath)
    }
  }

  visit(entryPath)
  return files
}

function collectDependencies(files, explicitDependencies) {
  const dependencies = new Set(explicitDependencies)

  for (const file of files) {
    for (const specifier of getRuntimeModuleSpecifiers(file.content, file.path)) {
      if (isLocalImport(specifier)) continue

      const packageName = getPackageName(specifier)
      if (packageName && !ignoredPackageDependencies.has(packageName)) {
        dependencies.add(packageName)
      }
    }
  }

  return [...dependencies].sort()
}

function buildRegistryArtifacts({ root, manifest }) {
  const repositoryRoot = fs.realpathSync(path.resolve(root))
  const artifacts = new Map()

  for (const component of manifest) {
    const slug = component.slug
    const filename = `${slug}.json`

    if (artifacts.has(filename)) {
      throw new Error(`Duplicate component registry slug: ${slug}`)
    }

    const files = collectRegistryFiles({
      entryPath: `src/components/${slug}.tsx`,
      fileSystem: fs,
      root: repositoryRoot,
      slug,
    })
    const registryMetadata = component.registry
    const registryItem = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: slug,
      type: 'registry:ui',
      title: component.title,
      description: registryMetadata.description,
      dependencies: collectDependencies(files, registryMetadata.dependencies),
      files,
      ...(registryMetadata.registryDependencies
        ? { registryDependencies: registryMetadata.registryDependencies }
        : {}),
      ...(registryMetadata.cssVars ? { cssVars: registryMetadata.cssVars } : {}),
      ...(registryMetadata.css ? { css: registryMetadata.css } : {}),
    }

    artifacts.set(filename, `${JSON.stringify(registryItem, null, 2)}\n`)
  }

  return artifacts
}

function getJsonFilenames(fileSystem, directoryPath) {
  if (!fileSystem.existsSync(directoryPath)) return []

  return fileSystem
    .readdirSync(directoryPath)
    .filter((filename) => filename.endsWith('.json'))
    .sort()
}

function compareRegistryArtifacts({ outputDir, artifacts }) {
  const expectedFilenames = [...artifacts.keys()].sort()
  const actualFilenames = getJsonFilenames(fs, outputDir)
  const expectedFilenameSet = new Set(expectedFilenames)
  const actualFilenameSet = new Set(actualFilenames)
  const missing = expectedFilenames.filter(
    (filename) => !actualFilenameSet.has(filename)
  )
  const extra = actualFilenames.filter(
    (filename) => !expectedFilenameSet.has(filename)
  )
  const changed = expectedFilenames.filter(
    (filename) =>
      actualFilenameSet.has(filename) &&
      fs.readFileSync(path.join(outputDir, filename), 'utf8') !==
        artifacts.get(filename)
  )

  return { missing, extra, changed }
}

function assertArtifactFilename(filename) {
  if (
    path.basename(filename) !== filename ||
    !filename.endsWith('.json') ||
    filename === '.json'
  ) {
    throw new Error(`Invalid registry artifact filename: ${filename}`)
  }
}

function verifyStagingDirectory({ artifacts, fileSystem, stagingDir }) {
  const expectedFilenames = [...artifacts.keys()].sort()
  const actualFilenames = fileSystem.readdirSync(stagingDir).sort()

  if (JSON.stringify(actualFilenames) !== JSON.stringify(expectedFilenames)) {
    throw new Error('Registry staging directory filename verification failed')
  }

  for (const [filename, content] of artifacts) {
    if (fileSystem.readFileSync(path.join(stagingDir, filename), 'utf8') !== content) {
      throw new Error(`Registry staging content verification failed: ${filename}`)
    }
  }
}

function removePathIfPresent(fileSystem, targetPath) {
  if (fileSystem.existsSync(targetPath)) {
    fileSystem.rmSync(targetPath, { force: true, recursive: true })
  }
}

function writeRegistryArtifacts({ outputDir, artifacts, fileSystem = fs }) {
  const resolvedOutputDir = path.resolve(outputDir)
  const parentDir = path.dirname(resolvedOutputDir)
  const outputName = path.basename(resolvedOutputDir)
  const transactionId = `${process.pid}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
  const stagingDir = path.join(parentDir, `.${outputName}.staging-${transactionId}`)
  const backupDir = path.join(parentDir, `.${outputName}.backup-${transactionId}`)
  let stagingOwned = false
  let backupOwned = false

  for (const filename of artifacts.keys()) {
    assertArtifactFilename(filename)
  }

  fileSystem.mkdirSync(parentDir, { recursive: true })

  try {
    fileSystem.mkdirSync(stagingDir)
    stagingOwned = true
    for (const [filename, content] of artifacts) {
      fileSystem.writeFileSync(path.join(stagingDir, filename), content)
    }
    verifyStagingDirectory({ artifacts, fileSystem, stagingDir })

    if (fileSystem.existsSync(resolvedOutputDir)) {
      if (!fileSystem.statSync(resolvedOutputDir).isDirectory()) {
        throw new Error(`Registry output path is not a directory: ${resolvedOutputDir}`)
      }

      fileSystem.renameSync(resolvedOutputDir, backupDir)
      backupOwned = true
    }

    try {
      fileSystem.renameSync(stagingDir, resolvedOutputDir)
      stagingOwned = false
    } catch (swapError) {
      if (backupOwned && fileSystem.existsSync(backupDir)) {
        try {
          fileSystem.renameSync(backupDir, resolvedOutputDir)
          backupOwned = false
        } catch (rollbackError) {
          const error = new Error(
            `Registry swap failed and rollback also failed: ${rollbackError.message}`,
            { cause: swapError }
          )
          error.rollbackError = rollbackError
          throw error
        }
      }

      throw swapError
    }

    if (backupOwned) {
      removePathIfPresent(fileSystem, backupDir)
      backupOwned = false
    }
  } finally {
    if (stagingOwned) {
      removePathIfPresent(fileSystem, stagingDir)
      stagingOwned = false
    }
  }
}

module.exports = {
  buildRegistryArtifacts,
  compareRegistryArtifacts,
  writeRegistryArtifacts,
}
