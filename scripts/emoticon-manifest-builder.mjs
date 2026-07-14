import path from 'node:path'

export const DEFAULT_COLLECTIONS = Object.freeze([
  Object.freeze({
    id: 'material',
    name: 'Material',
    sourceDir: 'public/emoticons/material',
    publicBase: '/emoticons/material',
    sourceLabel: 'Material Icon Theme',
  }),
  Object.freeze({
    id: 'tossface',
    name: 'Tossface',
    sourceDir: 'public/emoticons/tossface',
    publicBase: '/emoticons/tossface',
    sourceLabel: 'Tossface',
  }),
  Object.freeze({
    id: 'ryong',
    name: 'Ryong',
    sourceDir: 'public/emoticons/ryong',
    publicBase: '/emoticons/ryong',
    sourceLabel: 'Ryong',
  }),
])

export const DEFAULT_METADATA_PATHS = Object.freeze({
  tossface: 'scripts/data/tossface-metadata.json',
  ryong: 'scripts/data/ryong-metadata.json',
})

export const DEFAULT_OWNER_MAP = Object.freeze({
  publicRoot: 'public/emoticons',
  directories: Object.freeze([
    Object.freeze({
      owner: 'builder:material',
      path: 'public/emoticons/material',
      extensions: Object.freeze(['.svg']),
    }),
    Object.freeze({
      owner: 'builder:tossface',
      path: 'public/emoticons/tossface',
      extensions: Object.freeze(['.svg']),
    }),
    Object.freeze({
      owner: 'builder:ryong',
      path: 'public/emoticons/ryong',
      extensions: Object.freeze(['.png', '.svg']),
    }),
    Object.freeze({
      owner: 'static:logos',
      path: 'public/emoticons/logos',
      exactFiles: Object.freeze(['material-icon-theme.png', 'toss-symbol.png']),
    }),
  ]),
  files: Object.freeze([
    Object.freeze({
      owner: 'checked:manifest',
      path: 'public/emoticons/manifest.json',
    }),
    Object.freeze({
      owner: 'static:material-license',
      path: 'public/emoticons/material-LICENSE.txt',
    }),
    Object.freeze({
      owner: 'static:tossface-license',
      path: 'public/emoticons/tossface-LICENSE.txt',
    }),
    Object.freeze({
      owner: 'metadata:tossface',
      path: DEFAULT_METADATA_PATHS.tossface,
    }),
    Object.freeze({
      owner: 'metadata:ryong',
      path: DEFAULT_METADATA_PATHS.ryong,
    }),
  ]),
})

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

function isCanonicalIsoTimestamp(value) {
  if (typeof value !== 'string') return false
  const timestamp = new Date(value)
  return !Number.isNaN(timestamp.valueOf()) && timestamp.toISOString() === value
}

function isSafeRelativePath(filePath) {
  if (typeof filePath !== 'string' || filePath === '' || filePath.includes('\\')) return false
  if (path.posix.isAbsolute(filePath)) return false
  const segments = filePath.split('/')
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..')
}

function isSafeFilename(filename) {
  return (
    typeof filename === 'string' &&
    filename !== '' &&
    filename !== '.' &&
    filename !== '..' &&
    !filename.includes('/') &&
    !filename.includes('\\') &&
    !filename.includes('\0')
  )
}

function readOptionalJsonArray(fileSystem, filePath) {
  if (!fileSystem.exists(filePath)) return []
  const value = JSON.parse(fileSystem.readText(filePath))
  if (!Array.isArray(value)) throw new Error(`INVALID_METADATA_ARRAY:${filePath}`)
  return value
}

function metadataMap(items, key, label) {
  const result = new Map()
  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`INVALID_METADATA_ITEM:${label}`)
    }
    const expectedFields =
      label === 'ryong'
        ? ['filename', 'name', 'category', 'order']
        : ['name', 'category', 'order']
    if (!hasExactKeys(item, expectedFields)) {
      throw new Error(`INVALID_METADATA_FIELDS:${label}`)
    }
    const value = item?.[key]
    if (typeof value !== 'string' || value === '') {
      throw new Error(`INVALID_METADATA_KEY:${label}`)
    }
    if (typeof item.category !== 'string' || item.category.length === 0) {
      throw new Error(`INVALID_METADATA_CATEGORY:${label}:${value}`)
    }
    if (typeof item.order !== 'number' || !Number.isFinite(item.order)) {
      throw new Error(`INVALID_METADATA_ORDER:${label}:${value}`)
    }
    if (label === 'ryong' && (typeof item.name !== 'string' || item.name.length === 0)) {
      throw new Error(`INVALID_METADATA_NAME:${label}:${value}`)
    }
    if (result.has(value)) throw new Error(`DUPLICATE_METADATA_KEY:${label}:${value}`)
    result.set(value, item)
  }
  return result
}

export function buildEmoticonManifest({
  fileSystem,
  clock,
  collections = DEFAULT_COLLECTIONS,
  metadataPaths = DEFAULT_METADATA_PATHS,
}) {
  if (!fileSystem || typeof fileSystem.readDirectory !== 'function') {
    throw new Error('INVALID_FILESYSTEM_DEPENDENCY')
  }
  if (!clock || typeof clock.now !== 'function') throw new Error('INVALID_CLOCK_DEPENDENCY')

  const generatedAt = clock.now().toISOString()
  if (!isCanonicalIsoTimestamp(generatedAt)) throw new Error('INVALID_GENERATED_AT')

  const tossfaceMetadata = metadataMap(
    readOptionalJsonArray(fileSystem, metadataPaths.tossface),
    'name',
    'tossface'
  )
  const ryongMetadata = metadataMap(
    readOptionalJsonArray(fileSystem, metadataPaths.ryong),
    'filename',
    'ryong'
  )
  const collectionIds = new Set()
  const itemIds = new Map()
  const sources = new Map()

  const payloadCollections = collections.map((collection) => {
    if (
      !collection ||
      typeof collection !== 'object' ||
      Array.isArray(collection) ||
      typeof collection.id !== 'string' ||
      collection.id.length === 0 ||
      typeof collection.name !== 'string' ||
      collection.name.length === 0 ||
      typeof collection.sourceLabel !== 'string' ||
      collection.sourceLabel.length === 0 ||
      typeof collection.publicBase !== 'string' ||
      !collection.publicBase.startsWith('/')
    ) {
      throw new Error('INVALID_COLLECTION_DEFINITION')
    }
    if (collectionIds.has(collection.id)) {
      throw new Error(`DUPLICATE_COLLECTION_ID:${collection.id}`)
    }
    collectionIds.add(collection.id)
    if (!isSafeRelativePath(collection.sourceDir)) {
      throw new Error(`SOURCE_DIRECTORY_TRAVERSAL:${collection.sourceDir}`)
    }
    if (!fileSystem.exists(collection.sourceDir)) {
      throw new Error(`MISSING_SOURCE_DIRECTORY:${collection.sourceDir}`)
    }

    const filenames = fileSystem
      .readDirectory(collection.sourceDir)
      .filter((filename) => filename.toLowerCase().endsWith('.svg'))
      .map((filename) => {
        if (!isSafeFilename(filename)) throw new Error(`SOURCE_FILENAME_TRAVERSAL:${filename}`)
        return filename
      })
      .sort((left, right) => left.localeCompare(right, 'ko'))

    const items = filenames.map((filename) => {
      const name = toTitle(filename)
      const metadata =
        collection.id === 'tossface'
          ? tossfaceMetadata.get(name)
          : collection.id === 'ryong'
            ? ryongMetadata.get(filename)
            : null
      const pngFilename = filename.replace(/\.svg$/i, '.png')
      const pngPath = `${collection.sourceDir}/${pngFilename}`
      const id = toId(collection.id, filename)
      const src = toPublicPath(collection.publicBase, filename)
      const pngSrc = fileSystem.exists(pngPath)
        ? toPublicPath(collection.publicBase, pngFilename)
        : null

      if (itemIds.has(id)) {
        throw new Error(`GENERATED_ID_COLLISION:${id}:${itemIds.get(id)}:${filename}`)
      }
      itemIds.set(id, filename)
      for (const source of [src, pngSrc].filter(Boolean)) {
        if (sources.has(source)) {
          throw new Error(
            `GENERATED_SOURCE_COLLISION:${source}:${sources.get(source)}:${filename}`
          )
        }
        sources.set(source, filename)
      }

      return {
        id,
        name: metadata?.name ?? name,
        filename,
        src,
        ...(pngSrc ? { pngSrc } : {}),
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
  })

  return { generatedAt, collections: payloadCollections }
}

export function serializeEmoticonManifest(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`
}

function pushError(errors, error) {
  if (!errors.includes(error)) errors.push(error)
}

function isWithin(absoluteRoot, candidate) {
  return candidate === absoluteRoot || candidate.startsWith(`${absoluteRoot}/`)
}

function inspectOwnedPath(fileSystem, filePath, expectedKind, errors) {
  if (!isSafeRelativePath(filePath)) {
    pushError(errors, `PATH_TRAVERSAL:${filePath}`)
    return false
  }
  if (!fileSystem.exists(filePath)) {
    pushError(errors, `MISSING_OWNED_PATH:${filePath}`)
    return false
  }
  const stats = fileSystem.lstat(filePath)
  if (stats.isSymbolicLink) {
    pushError(errors, `SYMLINK:${filePath}`)
    return false
  }
  if (expectedKind === 'directory' ? !stats.isDirectory : !stats.isFile) {
    pushError(errors, `OWNER_KIND_MISMATCH:${filePath}`)
    return false
  }
  const absoluteRoot = fileSystem.resolve('.')
  const realPath = fileSystem.realpath(filePath)
  if (!isWithin(absoluteRoot, realPath)) {
    pushError(errors, `REALPATH_ESCAPE:${filePath}`)
    return false
  }
  return true
}

function walkFiles(fileSystem, directory, errors) {
  const files = []
  if (!inspectOwnedPath(fileSystem, directory, 'directory', errors)) return files
  for (const name of fileSystem.readDirectory(directory)) {
    if (!isSafeFilename(name)) {
      pushError(errors, `PATH_TRAVERSAL:${directory}/${name}`)
      continue
    }
    const filePath = `${directory}/${name}`
    if (!fileSystem.exists(filePath)) {
      pushError(errors, `MISSING_OWNED_PATH:${filePath}`)
      continue
    }
    const stats = fileSystem.lstat(filePath)
    if (stats.isSymbolicLink) {
      pushError(errors, `SYMLINK:${filePath}`)
      continue
    }
    const absoluteRoot = fileSystem.resolve('.')
    const realPath = fileSystem.realpath(filePath)
    if (!isWithin(absoluteRoot, realPath)) {
      pushError(errors, `REALPATH_ESCAPE:${filePath}`)
      continue
    }
    if (stats.isDirectory) files.push(...walkFiles(fileSystem, filePath, errors))
    else if (stats.isFile) files.push(filePath)
    else pushError(errors, `UNSUPPORTED_FILE_TYPE:${filePath}`)
  }
  return files
}

function validateOwnerMap(fileSystem, ownerMap, errors) {
  const directories = ownerMap?.directories ?? []
  const files = ownerMap?.files ?? []
  const claims = new Map()

  if (!isSafeRelativePath(ownerMap?.publicRoot)) {
    pushError(errors, `PATH_TRAVERSAL:${ownerMap?.publicRoot}`)
    return { claims, publicFiles: [] }
  }

  const descriptors = [
    ...directories.map((descriptor) => ({ ...descriptor, kind: 'directory' })),
    ...files.map((descriptor) => ({ ...descriptor, kind: 'file' })),
  ]
  for (let index = 0; index < descriptors.length; index += 1) {
    const descriptor = descriptors[index]
    if (!isSafeRelativePath(descriptor.path)) {
      pushError(errors, `PATH_TRAVERSAL:${descriptor.path}`)
      continue
    }
    for (let otherIndex = index + 1; otherIndex < descriptors.length; otherIndex += 1) {
      const other = descriptors[otherIndex]
      if (!isSafeRelativePath(other.path)) continue
      const overlap =
        descriptor.path === other.path ||
        (descriptor.kind === 'directory' && other.path.startsWith(`${descriptor.path}/`)) ||
        (other.kind === 'directory' && descriptor.path.startsWith(`${other.path}/`))
      if (overlap) pushError(errors, `OWNER_OVERLAP:${descriptor.path}:${other.path}`)
    }
  }

  for (const descriptor of files) {
    if (!inspectOwnedPath(fileSystem, descriptor.path, 'file', errors)) continue
    claims.set(descriptor.path, [descriptor.owner])
  }

  for (const descriptor of directories) {
    if (!inspectOwnedPath(fileSystem, descriptor.path, 'directory', errors)) continue
    const directFiles = walkFiles(fileSystem, descriptor.path, errors)
    const exactFiles = descriptor.exactFiles ? new Set(descriptor.exactFiles) : null
    const extensions = descriptor.extensions
      ? new Set(descriptor.extensions.map((extension) => extension.toLowerCase()))
      : null

    if (exactFiles) {
      const actualNames = directFiles
        .filter((filePath) => path.posix.dirname(filePath) === descriptor.path)
        .map((filePath) => path.posix.basename(filePath))
        .sort()
      if (JSON.stringify(actualNames) !== JSON.stringify([...exactFiles].sort())) {
        pushError(errors, `OWNER_EXACT_FILES_DRIFT:${descriptor.path}`)
      }
    }

    for (const filePath of directFiles) {
      const direct = path.posix.dirname(filePath) === descriptor.path
      const filename = path.posix.basename(filePath)
      const approved =
        direct &&
        (exactFiles
          ? exactFiles.has(filename)
          : extensions?.has(path.posix.extname(filename).toLowerCase()))
      if (!approved) continue
      const owners = claims.get(filePath) ?? []
      claims.set(filePath, [...owners, descriptor.owner])
    }
  }

  const publicFiles = walkFiles(fileSystem, ownerMap.publicRoot, errors)
  for (const filePath of publicFiles) {
    const owners = claims.get(filePath) ?? []
    if (owners.length === 0) pushError(errors, `UNOWNED_EXTRA:${filePath}`)
    if (owners.length > 1) pushError(errors, `OWNER_OVERLAP:${filePath}`)
  }

  return { claims, publicFiles }
}

function sameStrings(left, right) {
  return (
    Array.isArray(left) &&
    left.length === right.length &&
    JSON.stringify([...left].sort()) === JSON.stringify([...right].sort())
  )
}

function validateConfigurationOwnership(collections, metadataPaths, ownerMap, errors) {
  const directories = ownerMap?.directories ?? []
  const files = ownerMap?.files ?? []
  const collectionIds = new Set(collections.map((collection) => collection.id))

  for (const collection of collections) {
    const expectedOwner = `builder:${collection.id}`
    const canonicalCollection = DEFAULT_COLLECTIONS.find(
      (candidate) => candidate.id === collection.id
    )
    const expectedExtensions = collection.id === 'ryong' ? ['.png', '.svg'] : ['.svg']
    const matches = directories.filter(
      (descriptor) =>
        descriptor.owner === expectedOwner &&
        descriptor.path === canonicalCollection?.sourceDir &&
        descriptor.exactFiles === undefined &&
        hasExactKeys(descriptor, ['owner', 'path', 'extensions']) &&
        sameStrings(descriptor.extensions, expectedExtensions)
    )
    if (
      !canonicalCollection ||
      matches.length !== 1 ||
      collection.sourceDir !== canonicalCollection.sourceDir ||
      collection.publicBase !== canonicalCollection.publicBase
    ) {
      pushError(errors, `COLLECTION_OWNER_BINDING:${collection.id}`)
    }
  }

  for (const descriptor of directories) {
    if (!descriptor.owner?.startsWith('builder:')) continue
    const id = descriptor.owner.slice('builder:'.length)
    if (!collectionIds.has(id)) {
      pushError(errors, `EXTRA_BUILDER_OWNER_DESCRIPTOR:${descriptor.owner}:${descriptor.path}`)
      continue
    }
    const collection = collections.find((candidate) => candidate.id === id)
    const canonicalCollection = DEFAULT_COLLECTIONS.find((candidate) => candidate.id === id)
    const expectedExtensions = id === 'ryong' ? ['.png', '.svg'] : ['.svg']
    if (
      !canonicalCollection ||
      descriptor.path !== canonicalCollection.sourceDir ||
      collection.sourceDir !== canonicalCollection.sourceDir ||
      collection.publicBase !== canonicalCollection.publicBase ||
      descriptor.exactFiles !== undefined ||
      !hasExactKeys(descriptor, ['owner', 'path', 'extensions']) ||
      !sameStrings(descriptor.extensions, expectedExtensions)
    ) {
      pushError(errors, `COLLECTION_OWNER_BINDING:${id}`)
    }
  }

  const metadataKeys = new Set(['tossface', 'ryong'])
  const configuredMetadataKeys = Object.keys(metadataPaths ?? {})
  for (const key of configuredMetadataKeys) {
    if (!metadataKeys.has(key)) pushError(errors, `EXTRA_METADATA_PATH:${key}`)
  }
  for (const key of metadataKeys) {
    const metadataPath = metadataPaths?.[key]
    const canonicalMetadataPath = DEFAULT_METADATA_PATHS[key]
    const matches = files.filter(
      (descriptor) =>
        descriptor.owner === `metadata:${key}` &&
        descriptor.path === canonicalMetadataPath &&
        hasExactKeys(descriptor, ['owner', 'path'])
    )
    if (
      !isSafeRelativePath(metadataPath) ||
      metadataPath !== canonicalMetadataPath ||
      matches.length !== 1
    ) {
      pushError(errors, `METADATA_OWNER_BINDING:${key}`)
    }
  }
  for (const descriptor of files) {
    if (!descriptor.owner?.startsWith('metadata:')) continue
    const key = descriptor.owner.slice('metadata:'.length)
    if (!metadataKeys.has(key)) {
      pushError(errors, `EXTRA_METADATA_OWNER_DESCRIPTOR:${descriptor.owner}:${descriptor.path}`)
    } else if (
      descriptor.path !== metadataPaths[key] ||
      descriptor.path !== DEFAULT_METADATA_PATHS[key]
    ) {
      pushError(errors, `METADATA_OWNER_BINDING:${key}`)
    } else if (!hasExactKeys(descriptor, ['owner', 'path'])) {
      pushError(errors, `METADATA_OWNER_BINDING:${key}`)
    }
  }

  const expectedStaticDirectories = new Map([
    [
      'static:logos',
      {
        path: `${ownerMap.publicRoot}/logos`,
        exactFiles: ['material-icon-theme.png', 'toss-symbol.png'],
      },
    ],
  ])
  for (const descriptor of directories) {
    if (descriptor.owner?.startsWith('builder:')) continue
    const expected = expectedStaticDirectories.get(descriptor.owner)
    if (!expected) {
      pushError(errors, `EXTRA_OWNER_DESCRIPTOR:${String(descriptor.owner)}:${descriptor.path}`)
      continue
    }
    if (
      descriptor.path !== expected.path ||
      descriptor.extensions !== undefined ||
      !hasExactKeys(descriptor, ['owner', 'path', 'exactFiles']) ||
      !sameStrings(descriptor.exactFiles, expected.exactFiles)
    ) {
      pushError(errors, `OWNER_DESCRIPTOR_BINDING:${descriptor.owner}`)
    }
  }
  for (const owner of expectedStaticDirectories.keys()) {
    if (directories.filter((descriptor) => descriptor.owner === owner).length !== 1) {
      pushError(errors, `OWNER_DESCRIPTOR_BINDING:${owner}`)
    }
  }

  const expectedStaticFiles = new Map([
    ['checked:manifest', `${ownerMap.publicRoot}/manifest.json`],
    ['static:material-license', `${ownerMap.publicRoot}/material-LICENSE.txt`],
    ['static:tossface-license', `${ownerMap.publicRoot}/tossface-LICENSE.txt`],
  ])
  for (const descriptor of files) {
    if (descriptor.owner?.startsWith('metadata:')) continue
    const expectedPath = expectedStaticFiles.get(descriptor.owner)
    if (!expectedPath) {
      pushError(errors, `EXTRA_OWNER_DESCRIPTOR:${String(descriptor.owner)}:${descriptor.path}`)
      continue
    }
    if (
      descriptor.path !== expectedPath ||
      !hasExactKeys(descriptor, ['owner', 'path'])
    ) {
      pushError(errors, `OWNER_DESCRIPTOR_BINDING:${descriptor.owner}`)
    }
  }
  for (const owner of expectedStaticFiles.keys()) {
    if (files.filter((descriptor) => descriptor.owner === owner).length !== 1) {
      pushError(errors, `OWNER_DESCRIPTOR_BINDING:${owner}`)
    }
  }
}

function sourcePathFromPublicUrl(source, errors) {
  if (typeof source !== 'string' || !source.startsWith('/emoticons/')) {
    pushError(errors, `INVALID_SOURCE_PATH:${source}`)
    return null
  }
  let decoded
  try {
    decoded = decodeURIComponent(source)
  } catch {
    pushError(errors, `INVALID_SOURCE_ENCODING:${source}`)
    return null
  }
  if (decoded.includes('\\') || decoded.includes('\0')) {
    pushError(errors, `SOURCE_TRAVERSAL:${source}`)
    return null
  }
  const segments = decoded.split('/')
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    pushError(errors, `SOURCE_TRAVERSAL:${source}`)
    return null
  }
  const relativePath = `public${decoded}`
  if (!isSafeRelativePath(relativePath) || !relativePath.startsWith('public/emoticons/')) {
    pushError(errors, `SOURCE_TRAVERSAL:${source}`)
    return null
  }
  return relativePath
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.length > 0
}

function hasExactKeys(value, requiredKeys, optionalKeys = []) {
  const keys = Object.keys(value).sort()
  const allowed = new Set([...requiredKeys, ...optionalKeys])
  return (
    requiredKeys.every((key) => Object.hasOwn(value, key)) &&
    keys.every((key) => allowed.has(key))
  )
}

function validateManifestShape(manifest, fileSystem, ownerState, errors) {
  if (!isRecord(manifest)) {
    pushError(errors, 'INVALID_MANIFEST_SCHEMA')
    return new Set()
  }
  if (!hasExactKeys(manifest, ['generatedAt', 'collections'])) {
    pushError(errors, 'INVALID_MANIFEST_FIELDS')
  }
  if (!isCanonicalIsoTimestamp(manifest.generatedAt)) {
    pushError(errors, 'INVALID_GENERATED_AT')
  }
  if (!Array.isArray(manifest.collections)) {
    pushError(errors, 'INVALID_COLLECTIONS_SCHEMA')
    return new Set()
  }

  const collectionIds = new Set()
  const itemIds = new Set()
  const referencedSources = new Set()
  for (const collection of manifest.collections) {
    if (!isRecord(collection)) {
      pushError(errors, 'INVALID_COLLECTION_SCHEMA')
      continue
    }
    if (!hasExactKeys(collection, ['id', 'name', 'sourceLabel', 'count', 'items'])) {
      pushError(errors, `INVALID_COLLECTION_FIELDS:${String(collection.id)}`)
    }
    if (!isNonEmptyString(collection.id)) {
      pushError(errors, 'INVALID_COLLECTION_ID')
    }
    if (!isNonEmptyString(collection.name)) {
      pushError(errors, `INVALID_COLLECTION_NAME:${String(collection.id)}`)
    }
    if (!isNonEmptyString(collection.sourceLabel)) {
      pushError(errors, `INVALID_COLLECTION_SOURCE_LABEL:${String(collection.id)}`)
    }
    if (!Number.isInteger(collection.count) || collection.count < 0) {
      pushError(errors, `INVALID_COLLECTION_COUNT:${String(collection.id)}`)
    }
    if (collectionIds.has(collection.id)) {
      pushError(errors, `DUPLICATE_COLLECTION_ID:${collection.id}`)
    }
    collectionIds.add(collection.id)
    if (!Array.isArray(collection.items) || collection.count !== collection.items?.length) {
      pushError(errors, `COLLECTION_COUNT_DRIFT:${collection.id}`)
      continue
    }
    for (const item of collection.items) {
      if (!isRecord(item)) {
        pushError(errors, `INVALID_ITEM_SCHEMA:${String(collection.id)}`)
        continue
      }
      if (
        !hasExactKeys(item, ['id', 'name', 'filename', 'src'], [
          'pngSrc',
          'category',
          'order',
        ])
      ) {
        pushError(errors, `INVALID_ITEM_FIELDS:${String(item.id)}`)
      }
      if (!isNonEmptyString(item.id)) pushError(errors, `INVALID_ITEM_ID:${String(item.id)}`)
      if (!isNonEmptyString(item.name)) {
        pushError(errors, `INVALID_ITEM_NAME:${String(item.id)}`)
      }
      if (!isSafeFilename(item.filename) || !item.filename.toLowerCase().endsWith('.svg')) {
        pushError(errors, `INVALID_ITEM_FILENAME:${String(item.id)}`)
      }
      if (Object.hasOwn(item, 'category') && !isNonEmptyString(item.category)) {
        pushError(errors, `INVALID_ITEM_CATEGORY:${String(item.id)}`)
      }
      if (
        Object.hasOwn(item, 'order') &&
        (typeof item.order !== 'number' || !Number.isFinite(item.order))
      ) {
        pushError(errors, `INVALID_ITEM_ORDER:${String(item.id)}`)
      }
      if (Object.hasOwn(item, 'pngSrc') && !isNonEmptyString(item.pngSrc)) {
        pushError(errors, `INVALID_ITEM_PNG_SOURCE:${String(item.id)}`)
      }
      if (!isNonEmptyString(item.src)) {
        pushError(errors, `INVALID_ITEM_SOURCE:${String(item.id)}`)
      }
      if (itemIds.has(item.id)) pushError(errors, `DUPLICATE_ID:${item.id}`)
      itemIds.add(item.id)
      for (const source of [item.src, item.pngSrc].filter(Boolean)) {
        if (referencedSources.has(source)) pushError(errors, `DUPLICATE_SOURCE:${source}`)
        referencedSources.add(source)
        const sourcePath = sourcePathFromPublicUrl(source, errors)
        if (!sourcePath) continue
        if (!fileSystem.exists(sourcePath)) {
          pushError(errors, `MISSING_REFERENCED_SOURCE:${sourcePath}`)
          continue
        }
        const owners = ownerState.claims.get(sourcePath) ?? []
        if (!owners.includes(`builder:${collection.id}`)) {
          pushError(errors, `SOURCE_OWNER_MISMATCH:${sourcePath}`)
        }
        const sourceFilename = path.posix.basename(sourcePath)
        const expectedFilename =
          source === item.pngSrc && isSafeFilename(item.filename)
            ? item.filename.replace(/\.svg$/i, '.png')
            : item.filename
        if (sourceFilename !== expectedFilename) {
          pushError(errors, `SOURCE_FILENAME_MISMATCH:${String(item.id)}`)
        }
      }
    }
  }

  const referencedPaths = new Set(
    [...referencedSources]
      .map((source) => sourcePathFromPublicUrl(source, []))
      .filter(Boolean)
  )
  for (const [filePath, owners] of ownerState.claims) {
    if (owners.some((owner) => owner.startsWith('builder:')) && !referencedPaths.has(filePath)) {
      pushError(errors, `UNREFERENCED_SOURCE:${filePath}`)
    }
  }
  return referencedPaths
}

export function auditEmoticonManifest({
  fileSystem,
  clock,
  collections = DEFAULT_COLLECTIONS,
  metadataPaths = DEFAULT_METADATA_PATHS,
  ownerMap = DEFAULT_OWNER_MAP,
  manifestText,
}) {
  const errors = []
  validateConfigurationOwnership(collections, metadataPaths, ownerMap, errors)
  const ownerState = validateOwnerMap(fileSystem, ownerMap, errors)

  let payload = null
  try {
    payload = buildEmoticonManifest({ fileSystem, clock, collections, metadataPaths })
  } catch (error) {
    pushError(errors, error instanceof Error ? error.message : String(error))
  }

  let manifest = null
  let manifestParsed = false
  try {
    manifest = JSON.parse(manifestText)
    manifestParsed = true
  } catch {
    pushError(errors, 'INVALID_MANIFEST_JSON')
  }

  if (manifestParsed) validateManifestShape(manifest, fileSystem, ownerState, errors)
  if (manifestParsed && payload) {
    const manifestPayload = JSON.stringify(manifest)
    const expectedPayload = JSON.stringify(payload)
    if (manifestPayload !== expectedPayload) {
      pushError(errors, 'MANIFEST_PAYLOAD_DRIFT')
      pushError(errors, 'MANIFEST_BYTE_DRIFT')
    }
    const expectedText = serializeEmoticonManifest(payload)
    if (manifestText !== expectedText) {
      if (manifestPayload === expectedPayload) pushError(errors, 'MANIFEST_FORMAT_DRIFT')
      else pushError(errors, 'MANIFEST_BYTE_DRIFT')
    }
  }

  return {
    errors: errors.sort(),
    manifest,
    manifestText,
    ownerState,
    payload,
  }
}
