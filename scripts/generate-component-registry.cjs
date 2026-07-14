/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('node:path')
const { pathToFileURL } = require('node:url')

const {
  buildRegistryArtifacts,
  compareRegistryArtifacts,
  writeRegistryArtifacts,
} = require('./component-registry-builder.cjs')

const root = path.resolve(__dirname, '..')
const outputDir = path.join(root, 'public/r')
const manifestUrl = pathToFileURL(
  path.join(root, 'src/features/component-library/component-manifest.mjs')
).href

function printDifferences(comparison) {
  console.error('Component registry is out of date')

  for (const differenceType of ['missing', 'extra', 'changed']) {
    if (comparison[differenceType].length > 0) {
      console.error(`${differenceType}: ${comparison[differenceType].join(', ')}`)
    }
  }
}

async function main() {
  const argumentsList = process.argv.slice(2)
  const checkOnly = argumentsList.length === 1 && argumentsList[0] === '--check'

  if (argumentsList.length > 0 && !checkOnly) {
    throw new Error(`Unknown registry generator arguments: ${argumentsList.join(' ')}`)
  }

  const { componentManifest } = await import(manifestUrl)
  const artifacts = buildRegistryArtifacts({
    manifest: componentManifest,
    root,
  })

  if (checkOnly) {
    const comparison = compareRegistryArtifacts({ artifacts, outputDir })
    const hasDifferences = Object.values(comparison).some(
      (filenames) => filenames.length > 0
    )

    if (hasDifferences) {
      printDifferences(comparison)
      process.exitCode = 1
      return
    }

    console.log(`Verified ${artifacts.size} component registry items`)
    return
  }

  writeRegistryArtifacts({ artifacts, outputDir })
  console.log(`Generated ${artifacts.size} component registry items`)
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
