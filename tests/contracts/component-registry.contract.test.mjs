import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join, relative } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

import ts from 'typescript'

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const componentDataPath = join(
  root,
  'src/features/component-library/component-data.ts'
)
const componentManifestPath = join(
  root,
  'src/features/component-library/component-manifest.mjs'
)
const componentPreviewsPath = join(
  root,
  'src/features/component-library/component-previews.tsx'
)
const componentPreviewsInternalDir = join(
  root,
  'src/features/component-library/component-previews'
)
const componentPreviewRegistryPath = join(
  componentPreviewsInternalDir,
  'registry.tsx'
)
const registryBuilderPath = join(
  root,
  'scripts/component-registry-builder.cjs'
)
const registryCliPath = join(root, 'scripts/generate-component-registry.cjs')
const registryDir = join(root, 'public/r')

const componentRegistryBaseUrl = 'https://ryong-blog.vercel.app/r'

const catalogSlugs = [
  'background-boxes',
  'keyboard',
  'placeholders-and-vanish-input',
  '3d-marquee',
  'playful-todolist',
  'flower-menu',
  'text-flip',
  'toggle-theme',
  '3d-image-carousel',
  'sparkle-cursor',
  'mouse-invert-cursor',
  'mouse-trail-cursor',
  'mouse-ripple-cursor',
  'mouse-custom-cursor',
  'fairy-dust-cursor',
  'bubble-cursor',
  'character-cursor',
  'canvas-cursor',
  'data-table',
  'physics-number-picker',
  'ripple-button',
  'shiny-button',
  'marquee',
  'icon-cloud',
  'lens',
  'pointer',
  'file-tree',
  'animated-circular-progress-bar',
  'curved-loop',
  'click-spark',
  'magnet',
  'stack',
  'folder',
  'carousel',
  'elastic-slider',
  'counter',
  'meteors',
  'confetti',
  'particles',
  'typing-animation',
  'aurora-text',
  'video-text',
  'number-ticker',
  'dia-text-reveal',
  'morphing-text',
  'highlighter',
]

const categoryIds = [
  'controls-inputs',
  'menus-actions',
  'content-display',
  'data-status',
  'text-effects',
  'background-atmosphere',
  'cursor-interaction-effects',
]

const mobileHiddenSlugs = [
  'pointer',
  'magnet',
  'background-boxes',
  'keyboard',
  'sparkle-cursor',
  'mouse-invert-cursor',
  'mouse-trail-cursor',
  'mouse-custom-cursor',
  'fairy-dust-cursor',
  'bubble-cursor',
  'character-cursor',
  'canvas-cursor',
]

const componentDataExports = [
  'ComponentCategoryId',
  'ComponentPreviewKind',
  'ComponentCategory',
  'ComponentProp',
  'ComponentRegistry',
  'ComponentReference',
  'ComponentSample',
  'componentRegistryBaseUrl',
  'componentCategories',
  'componentSamples',
  'isComponentHiddenOnMobile',
  'getComponentSampleBySlug',
]

const sortedCatalogSlugs = [...catalogSlugs].sort()
const modeAwarePreviewSlugs = [
  'meteors',
  'particles',
  'mouse-invert-cursor',
  'mouse-trail-cursor',
  'mouse-ripple-cursor',
  'mouse-custom-cursor',
  'fairy-dust-cursor',
  'bubble-cursor',
  'character-cursor',
  'canvas-cursor',
]
const previewExportNamesBySlug = {
  'background-boxes': 'BackgroundBoxesPreview',
  keyboard: 'KeyboardPreview',
  'placeholders-and-vanish-input': 'PlaceholdersAndVanishInputPreview',
  '3d-marquee': 'ThreeDMarqueePreview',
  'playful-todolist': 'PlayfulTodoListPreview',
  'flower-menu': 'FlowerMenuPreview',
  'text-flip': 'TextFlipPreview',
  'toggle-theme': 'ToggleThemePreview',
  '3d-image-carousel': 'ThreeDImageCarouselPreview',
  'sparkle-cursor': 'SparkleCursorPreview',
  'mouse-invert-cursor': 'MouseInvertCursorPreview',
  'mouse-trail-cursor': 'MouseTrailCursorPreview',
  'mouse-ripple-cursor': 'MouseRippleCursorPreview',
  'mouse-custom-cursor': 'MouseCustomCursorPreview',
  'fairy-dust-cursor': 'FairyDustCursorPreview',
  'bubble-cursor': 'BubbleCursorPreview',
  'character-cursor': 'CharacterCursorPreview',
  'canvas-cursor': 'CanvasCursorPreview',
  'data-table': 'DataTablePreview',
  'physics-number-picker': 'PhysicsNumberPickerPreview',
  'ripple-button': 'RippleButtonPreview',
  'shiny-button': 'ShinyButtonPreview',
  marquee: 'MarqueePreview',
  'icon-cloud': 'IconCloudPreview',
  lens: 'LensPreview',
  pointer: 'PointerPreview',
  'file-tree': 'FileTreePreview',
  'animated-circular-progress-bar': 'AnimatedCircularProgressBarPreview',
  'curved-loop': 'CurvedLoopPreview',
  'click-spark': 'ClickSparkPreview',
  magnet: 'MagnetPreview',
  stack: 'StackPreview',
  folder: 'FolderPreview',
  carousel: 'CarouselPreview',
  'elastic-slider': 'ElasticSliderPreview',
  counter: 'CounterPreview',
  meteors: 'MeteorsPreview',
  confetti: 'ConfettiPreview',
  particles: 'ParticlesPreview',
  'typing-animation': 'TypingAnimationPreview',
  'aurora-text': 'AuroraTextPreview',
  'video-text': 'VideoTextPreview',
  'number-ticker': 'NumberTickerPreview',
  'dia-text-reveal': 'DiaTextRevealPreview',
  'morphing-text': 'MorphingTextPreview',
  highlighter: 'HighlighterPreview',
}

function parseSource(filePath, scriptKind) {
  return ts.createSourceFile(
    filePath,
    readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  )
}

function loadComponentData() {
  const transpiled = ts.transpileModule(readFileSync(componentDataPath, 'utf8'), {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: componentDataPath,
    reportDiagnostics: true,
  })
  const errors = (transpiled.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  )

  assert.deepEqual(
    errors.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    ),
    [],
    'component-data.ts must transpile without diagnostics'
  )

  const componentModule = { exports: {} }
  const evaluate = new Function(
    'require',
    'module',
    'exports',
    '__filename',
    '__dirname',
    transpiled.outputText
  )

  evaluate(
    createRequire(componentDataPath),
    componentModule,
    componentModule.exports,
    componentDataPath,
    dirname(componentDataPath)
  )

  return componentModule.exports
}

function getPublicRegistryFilenames() {
  return readdirSync(registryDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
}

function normalizePath(path) {
  return path.split('\\').join('/')
}

function getSourceFiles(directory) {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name)

      if (entry.isDirectory()) {
        return getSourceFiles(path)
      }

      return entry.isFile() && /\.(?:[cm]?[jt]sx?)$/.test(entry.name)
        ? [path]
        : []
    })
    .sort()
}

function unwrapExpression(node) {
  let expression = node

  while (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isNonNullExpression(expression) ||
    ts.isTypeAssertionExpression(expression)
  ) {
    expression = expression.expression
  }

  return expression
}

function getPropertyNameText(name) {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNoSubstitutionTemplateLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text
  }

  return null
}

function getTopLevelFunction(sourceFile, name) {
  const matches = sourceFile.statements.filter(
    (statement) =>
      ts.isFunctionDeclaration(statement) && statement.name?.text === name
  )

  assert.equal(
    matches.length,
    1,
    `${normalizePath(relative(root, sourceFile.fileName))} must define exactly one top-level ${name} function`
  )

  return matches[0]
}

function getCallExpressionFromReturn(statement) {
  if (!ts.isReturnStatement(statement) || !statement.expression) {
    return null
  }

  const expression = unwrapExpression(statement.expression)
  return ts.isCallExpression(expression) ? expression : null
}

function assertIdentifier(node, expected, message) {
  assert.equal(ts.isIdentifier(node) && node.text === expected, true, message)
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
    }

    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'require' &&
      node.arguments.length === 1 &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      specifiers.push(node.arguments[0].text)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return specifiers
}

function assertStaticPreviewGraph(graphPaths) {
  const clientBoundaryPaths = []

  for (const path of graphPaths) {
    const sourceFile = parseSource(
      path,
      path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    )
    const relativePath = normalizePath(relative(root, path))
    const hasClientDirective = sourceFile.statements.some(
      (statement) =>
        ts.isExpressionStatement(statement) &&
        ts.isStringLiteral(statement.expression) &&
        statement.expression.text === 'use client'
    )

    if (hasClientDirective) {
      clientBoundaryPaths.push(relativePath)
    }

    for (const specifier of getModuleSpecifiers(sourceFile)) {
      assert.notEqual(
        specifier,
        'next/dynamic',
        `${relativePath} must not use next/dynamic in the preview graph`
      )
      assert.equal(
        /(?:^|\/)loading(?:\.[cm]?[jt]sx?)?$/.test(specifier),
        false,
        `${relativePath} must not import a loading fallback module`
      )
    }

    for (const statement of sourceFile.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        statement.moduleSpecifier.text !== 'react' ||
        !statement.importClause?.namedBindings ||
        !ts.isNamedImports(statement.importClause.namedBindings)
      ) {
        continue
      }

      for (const element of statement.importClause.namedBindings.elements) {
        const importedName = element.propertyName?.text ?? element.name.text
        assert.equal(
          importedName === 'lazy' || importedName === 'Suspense',
          false,
          `${relativePath} must not import React ${importedName}`
        )
      }
    }

    function visit(node) {
      if (ts.isCallExpression(node)) {
        assert.notEqual(
          node.expression.kind,
          ts.SyntaxKind.ImportKeyword,
          `${relativePath} must use static imports instead of import()`
        )

        assert.equal(
          ts.isIdentifier(node.expression) && node.expression.text === 'require',
          false,
          `${relativePath} must use static ESM imports instead of require()`
        )

        const isReactLazy =
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === 'React' &&
          node.expression.name.text === 'lazy'
        const isNamedLazy =
          ts.isIdentifier(node.expression) && node.expression.text === 'lazy'
        assert.equal(
          isReactLazy || isNamedLazy,
          false,
          `${relativePath} must not use React.lazy or a named lazy import`
        )
      }

      if (
        ts.isJsxOpeningElement(node) ||
        ts.isJsxSelfClosingElement(node)
      ) {
        assert.equal(
          node.tagName.getText(sourceFile) === 'Suspense' ||
            node.tagName.getText(sourceFile) === 'React.Suspense',
          false,
          `${relativePath} must not add a Suspense boundary`
        )
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
  }

  assert.deepEqual(
    clientBoundaryPaths,
    ['src/features/component-library/component-previews.tsx'],
    'The public component-previews.tsx facade must remain the only preview client boundary'
  )
}

function assertPreviewImportPrivacy() {
  const internalPrefix = normalizePath(
    relative(join(root, 'src'), componentPreviewsInternalDir)
  )

  for (const path of getSourceFiles(join(root, 'src'))) {
    const relativePath = normalizePath(relative(root, path))
    const sourceRelativePath = normalizePath(relative(join(root, 'src'), path))
    const isInternal =
      sourceRelativePath === internalPrefix ||
      sourceRelativePath.startsWith(`${internalPrefix}/`)
    const isFacade = path === componentPreviewsPath

    if (isInternal || isFacade) {
      continue
    }

    const sourceFile = parseSource(
      path,
      path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    )

    for (const specifier of getModuleSpecifiers(sourceFile)) {
      assert.equal(
        /(?:^|\/)component-previews\//.test(specifier),
        false,
        `${relativePath} must consume the component-previews.tsx public facade instead of ${specifier}`
      )
    }
  }
}

function assertFacadeContract() {
  const sourceFile = parseSource(componentPreviewsPath, ts.ScriptKind.TSX)
  const firstStatement = sourceFile.statements[0]

  assert.equal(
    ts.isExpressionStatement(firstStatement) &&
      ts.isStringLiteral(firstStatement.expression) &&
      firstStatement.expression.text === 'use client',
    true,
    'component-previews.tsx must keep the use client directive'
  )

  const basePreviewContent = getTopLevelFunction(sourceFile, 'BasePreviewContent')
  assert.ok(basePreviewContent.body, 'BasePreviewContent must have a body')
  assert.equal(
    basePreviewContent.body.statements.length,
    2,
    'BasePreviewContent must only select and return the registry result'
  )

  const contentStatement = basePreviewContent.body.statements[0]
  assert.equal(
    ts.isVariableStatement(contentStatement) &&
      contentStatement.declarationList.declarations.length === 1,
    true,
    'BasePreviewContent must bind one registry result'
  )
  const contentDeclaration = contentStatement.declarationList.declarations[0]
  assertIdentifier(
    contentDeclaration.name,
    'content',
    'BasePreviewContent must keep the content result binding'
  )
  const renderCall = unwrapExpression(contentDeclaration.initializer)
  assert.equal(
    ts.isCallExpression(renderCall),
    true,
    'BasePreviewContent content must call renderComponentPreview'
  )
  assertIdentifier(
    renderCall.expression,
    'renderComponentPreview',
    'BasePreviewContent must call renderComponentPreview directly'
  )
  assert.equal(renderCall.arguments.length, 2)
  assert.equal(
    renderCall.arguments[0].getText(sourceFile),
    'sample.preview.kind',
    'BasePreviewContent must forward sample.preview.kind unchanged'
  )
  assertIdentifier(
    renderCall.arguments[1],
    'mode',
    'BasePreviewContent must forward mode unchanged'
  )

  const baseReturn = basePreviewContent.body.statements[1]
  assert.equal(
    ts.isReturnStatement(baseReturn) &&
      baseReturn.expression &&
      ts.isIdentifier(baseReturn.expression) &&
      baseReturn.expression.text === 'content',
    true,
    'BasePreviewContent must return the registry result without a wrapper'
  )

  const publicPreviewContent = getTopLevelFunction(
    sourceFile,
    'ComponentPreviewContent'
  )
  assert.equal(
    hasExportModifier(publicPreviewContent),
    true,
    'ComponentPreviewContent must remain a named export'
  )
  assert.ok(publicPreviewContent.body, 'ComponentPreviewContent must have a body')
  assert.equal(
    publicPreviewContent.body.statements.length,
    1,
    'ComponentPreviewContent must only return BasePreviewContent'
  )
  const publicReturn = publicPreviewContent.body.statements[0]
  assert.ok(
    ts.isReturnStatement(publicReturn) && publicReturn.expression,
    'ComponentPreviewContent must return BasePreviewContent'
  )
  const publicElement = unwrapExpression(publicReturn.expression)
  assert.equal(
    ts.isJsxSelfClosingElement(publicElement) &&
      ts.isIdentifier(publicElement.tagName) &&
      publicElement.tagName.text === 'BasePreviewContent',
    true,
    'ComponentPreviewContent must return only the BasePreviewContent element'
  )
  const publicAttributes = publicElement.attributes.properties
  assert.deepEqual(
    publicAttributes.map((attribute) =>
      ts.isJsxAttribute(attribute) ? attribute.name.getText(sourceFile) : null
    ),
    ['sample', 'mode'],
    'ComponentPreviewContent must forward only sample and mode'
  )
  for (const attribute of publicAttributes) {
    assert.ok(attribute.initializer && ts.isJsxExpression(attribute.initializer))
    assert.ok(attribute.initializer.expression)
    assertIdentifier(
      attribute.initializer.expression,
      attribute.name.getText(sourceFile),
      `ComponentPreviewContent must forward ${attribute.name.getText(sourceFile)} unchanged`
    )
  }
}

function assertRenderFunctionContract(sourceFile) {
  const renderFunction = getTopLevelFunction(sourceFile, 'renderComponentPreview')
  assert.ok(renderFunction.body, 'renderComponentPreview must have a body')
  assert.equal(
    hasExportModifier(renderFunction),
    true,
    'renderComponentPreview must be exported to the public facade'
  )
  assert.deepEqual(
    renderFunction.parameters.map((parameter) => parameter.name.getText(sourceFile)),
    ['kind', 'mode'],
    'renderComponentPreview must accept kind and mode unchanged'
  )
  assert.equal(
    renderFunction.body.statements.length,
    2,
    'renderComponentPreview must only guard and invoke the renderer'
  )

  const guard = renderFunction.body.statements[0]
  assert.ok(ts.isIfStatement(guard), 'renderComponentPreview must guard unknown kinds')
  const condition = unwrapExpression(guard.expression)
  assert.equal(
    ts.isPrefixUnaryExpression(condition) &&
      condition.operator === ts.SyntaxKind.ExclamationToken,
    true,
    'renderComponentPreview must negate its own-property check'
  )
  const ownPropertyCall = unwrapExpression(condition.operand)
  assert.ok(
    ts.isCallExpression(ownPropertyCall),
    'renderComponentPreview must call Object.prototype.hasOwnProperty.call'
  )
  assert.equal(
    ownPropertyCall.expression.getText(sourceFile),
    'Object.prototype.hasOwnProperty.call',
    'renderComponentPreview must use an own-property check'
  )
  assert.deepEqual(
    ownPropertyCall.arguments.map((argument) => argument.getText(sourceFile)),
    ['componentPreviewRenderers', 'kind'],
    'The own-property check must inspect componentPreviewRenderers and kind'
  )
  const guardStatements = ts.isBlock(guard.thenStatement)
    ? guard.thenStatement.statements
    : [guard.thenStatement]
  assert.equal(guardStatements.length, 1)
  assert.equal(
    ts.isReturnStatement(guardStatements[0]) &&
      guardStatements[0].expression &&
      ts.isIdentifier(guardStatements[0].expression) &&
      guardStatements[0].expression.text === 'undefined',
    true,
    'Unknown runtime kinds must return undefined'
  )

  const selectedRendererCall = getCallExpressionFromReturn(
    renderFunction.body.statements[1]
  )
  assert.ok(selectedRendererCall, 'renderComponentPreview must return a renderer call')
  const rendererAccess = unwrapExpression(selectedRendererCall.expression)
  assert.equal(
    ts.isElementAccessExpression(rendererAccess) &&
      ts.isIdentifier(rendererAccess.expression) &&
      rendererAccess.expression.text === 'componentPreviewRenderers' &&
      rendererAccess.argumentExpression &&
      ts.isIdentifier(rendererAccess.argumentExpression) &&
      rendererAccess.argumentExpression.text === 'kind',
    true,
    'renderComponentPreview must select componentPreviewRenderers[kind]'
  )
  assert.deepEqual(
    selectedRendererCall.arguments.map((argument) => argument.getText(sourceFile)),
    ['mode'],
    'renderComponentPreview must invoke the selected renderer with unchanged mode'
  )
}

function assertPreviewRegistryContract() {
  assert.deepEqual(
    Object.keys(previewExportNamesBySlug).sort(),
    sortedCatalogSlugs,
    'The contract must define one canonical preview export for every catalog slug'
  )
  assert.equal(
    new Set(Object.values(previewExportNamesBySlug)).size,
    catalogSlugs.length,
    'Canonical preview export names must be unique'
  )
  assert.equal(
    existsSync(componentPreviewRegistryPath),
    true,
    `Missing static component preview registry: ${componentPreviewRegistryPath}`
  )

  const sourceFile = parseSource(componentPreviewRegistryPath, ts.ScriptKind.TSX)
  const importBindings = new Map()

  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      !statement.importClause?.namedBindings ||
      !ts.isNamedImports(statement.importClause.namedBindings)
    ) {
      continue
    }

    for (const element of statement.importClause.namedBindings.elements) {
      importBindings.set(element.name.text, {
        importedName: element.propertyName?.text ?? element.name.text,
        specifier: statement.moduleSpecifier.text,
      })
    }
  }

  const rendererDeclarations = []
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer) {
        continue
      }

      const initializer = unwrapExpression(declaration.initializer)
      if (
        ts.isObjectLiteralExpression(initializer) &&
        initializer.properties.some((property) => {
          const name = property.name ? getPropertyNameText(property.name) : null
          return name !== null && catalogSlugs.includes(name)
        })
      ) {
        rendererDeclarations.push({ declaration, initializer, statement })
      }
    }
  }

  assert.equal(
    rendererDeclarations.length,
    1,
    'registry.tsx must define one module-level plain preview renderer object'
  )
  const rendererDeclaration = rendererDeclarations[0]
  assertIdentifier(
    rendererDeclaration.declaration.name,
    'componentPreviewRenderers',
    'The module-level renderer object must be named componentPreviewRenderers'
  )
  assert.equal(
    (rendererDeclaration.statement.declarationList.flags & ts.NodeFlags.Const) !== 0,
    true,
    'componentPreviewRenderers must be module-level const data'
  )

  const registrySlugs = []
  const forwardedModeSlugs = []
  for (const property of rendererDeclaration.initializer.properties) {
    assert.ok(
      ts.isPropertyAssignment(property),
      'componentPreviewRenderers may only contain plain property assignments'
    )
    const slug = getPropertyNameText(property.name)
    assert.ok(slug, 'Every componentPreviewRenderers key must be static')
    registrySlugs.push(slug)

    const renderer = unwrapExpression(property.initializer)
    assert.ok(
      ts.isArrowFunction(renderer),
      `Renderer for ${slug} must be a module-level arrow function`
    )
    const element = unwrapExpression(renderer.body)
    assert.ok(
      ts.isJsxSelfClosingElement(element),
      `Renderer for ${slug} must return its preview element directly`
    )
    assert.ok(
      ts.isIdentifier(element.tagName),
      `Renderer for ${slug} must render an imported preview identifier`
    )
    const expectedExportName = previewExportNamesBySlug[slug]
    assert.equal(
      element.tagName.text,
      expectedExportName,
      `Renderer for ${slug} must use canonical JSX binding ${expectedExportName}`
    )
    const binding = importBindings.get(expectedExportName)
    assert.ok(binding, `Renderer for ${slug} must use a statically imported preview`)
    assert.equal(
      binding.importedName,
      expectedExportName,
      `Renderer for ${slug} must import canonical named export ${expectedExportName} without rebinding it`
    )
    assert.equal(
      basename(binding.specifier),
      `${slug}-preview`,
      `Renderer for ${slug} must import its matching slug-named module`
    )

    const attributes = element.attributes.properties
    const forwardsMode =
      renderer.parameters.length === 1 &&
      ts.isIdentifier(renderer.parameters[0].name) &&
      renderer.parameters[0].name.text === 'mode' &&
      attributes.length === 1 &&
      ts.isJsxAttribute(attributes[0]) &&
      attributes[0].name.getText(sourceFile) === 'mode' &&
      attributes[0].initializer &&
      ts.isJsxExpression(attributes[0].initializer) &&
      attributes[0].initializer.expression &&
      ts.isIdentifier(attributes[0].initializer.expression) &&
      attributes[0].initializer.expression.text === 'mode'

    if (forwardsMode) {
      forwardedModeSlugs.push(slug)
    } else {
      assert.equal(
        renderer.parameters.length,
        0,
        `Renderer for ${slug} must not accept an unused mode parameter`
      )
      assert.equal(
        attributes.length,
        0,
        `Renderer for ${slug} must preserve a prop-free preview element`
      )
    }
  }

  assert.equal(
    registrySlugs.length,
    new Set(registrySlugs).size,
    'componentPreviewRenderers must not contain duplicate keys'
  )
  assert.deepEqual([...registrySlugs].sort(), sortedCatalogSlugs)
  assert.deepEqual(
    [...forwardedModeSlugs].sort(),
    [...modeAwarePreviewSlugs].sort(),
    'Exactly the 10 mode-aware previews must receive mode'
  )

  assertRenderFunctionContract(sourceFile)
  assertFacadeContract()
  assertPreviewImportPrivacy()
  assertStaticPreviewGraph([
    componentPreviewsPath,
    ...getSourceFiles(componentPreviewsInternalDir),
  ])
}

function hasExportModifier(node) {
  return node.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
  )
}

function collectBindingNames(name, names) {
  if (ts.isIdentifier(name)) {
    names.add(name.text)
    return
  }

  for (const element of name.elements) {
    if (!ts.isOmittedExpression(element)) {
      collectBindingNames(element.name, names)
    }
  }
}

function getComponentDataExportNames(sourceFile) {
  const names = new Set()

  for (const statement of sourceFile.statements) {
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        names.add(element.name.text)
      }
      continue
    }

    if (!hasExportModifier(statement)) {
      continue
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        collectBindingNames(declaration.name, names)
      }
      continue
    }

    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.add(statement.name.text)
    }
  }

  return names
}

function getFrozenSlugLiterals(sourceFile) {
  const slugSet = new Set(catalogSlugs)
  const matches = []

  function visit(node) {
    if (
      (ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node)) &&
      slugSet.has(node.text)
    ) {
      matches.push(node.text)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return matches
}

function snapshotRegistryDirectory() {
  const toMetadata = (path) => {
    const stats = statSync(path, { bigint: true })

    return {
      ctimeNs: stats.ctimeNs,
      ino: stats.ino,
      mode: stats.mode,
      mtimeNs: stats.mtimeNs,
      size: stats.size,
    }
  }

  return {
    directory: toMetadata(registryDir),
    files: getPublicRegistryFilenames().map((name) => {
      const path = join(registryDir, name)

      return {
        content: readFileSync(path),
        metadata: toMetadata(path),
        name,
      }
    }),
  }
}

test('component registry preserves the exact catalog inventory and public paths', () => {
  const componentData = loadComponentData()
  const samples = Array.from(componentData.componentSamples)
  const sampleSlugs = samples.map((sample) => sample.slug)
  const publicFilenames = getPublicRegistryFilenames()
  const publicSlugs = publicFilenames.map((name) => name.replace(/\.json$/, ''))

  assert.equal(componentData.componentRegistryBaseUrl, componentRegistryBaseUrl)
  assert.deepEqual(sampleSlugs, catalogSlugs)
  assert.deepEqual(
    Array.from(componentData.componentCategories, (category) => category.id),
    categoryIds
  )
  assert.deepEqual(publicSlugs, sortedCatalogSlugs)

  const hiddenSlugs = catalogSlugs.filter((slug) =>
    componentData.isComponentHiddenOnMobile(slug)
  )
  assert.deepEqual([...hiddenSlugs].sort(), [...mobileHiddenSlugs].sort())
  assert.equal(
    componentData.isComponentHiddenOnMobile('mouse-ripple-cursor'),
    false,
    'mouse-ripple-cursor must remain mobile-visible'
  )

  assertPreviewRegistryContract()

  for (const [sampleIndex, sample] of samples.entries()) {
    const { slug } = sample
    const sourceEntry = `src/components/${slug}.tsx`
    const publicRegistryPath = `/r/${slug}.json`

    assert.equal(sample.status, 'Ready', `Status mismatch for ${slug}`)
    assert.equal(sample.preview.kind, slug, `Preview kind mismatch for ${slug}`)
    assert.equal(
      sample.preview.label,
      sample.title,
      `Preview label mismatch for ${slug}`
    )
    assert.equal(sample.filePath, sourceEntry, `Source path mismatch for ${slug}`)
    assert.equal(
      sample.installCommand,
      `pnpm dlx shadcn@latest add ${componentRegistryBaseUrl}/${slug}.json`,
      `Install command mismatch for ${slug}`
    )
    assert.ok(sample.registry, `Missing registry metadata for ${slug}`)
    assert.equal(sample.registry.name, slug, `Registry name mismatch for ${slug}`)
    assert.equal(
      sample.registry.url,
      publicRegistryPath,
      `Registry URL mismatch for ${slug}`
    )
    assert.equal(
      existsSync(join(root, sourceEntry)),
      true,
      `Missing source entry for ${slug}`
    )
    assert.equal(
      componentData.getComponentSampleBySlug(slug),
      samples[sampleIndex],
      `Component lookup identity mismatch for ${slug}`
    )

    const registryItem = JSON.parse(
      readFileSync(join(registryDir, `${slug}.json`), 'utf8')
    )
    assert.equal(registryItem.name, slug, `Public registry name mismatch for ${slug}`)
    assert.ok(
      Array.isArray(registryItem.files),
      `Public registry files must be an array for ${slug}`
    )
    assert.equal(
      registryItem.files[0]?.path,
      sourceEntry,
      `Public registry entry file must be first for ${slug}`
    )
  }

  assert.equal(
    componentData.getComponentSampleBySlug('not-a-component'),
    null,
    'Unknown component lookup must return null'
  )
})

test('component manifest is the canonical metadata owner behind the compatibility facade', async () => {
  assert.equal(
    existsSync(componentManifestPath),
    true,
    `Missing canonical component manifest: ${componentManifestPath}`
  )

  const manifestModule = await import(pathToFileURL(componentManifestPath).href)
  const manifest = manifestModule.componentManifest
  const categories = manifestModule.componentCategories

  assert.equal(manifestModule.componentRegistryBaseUrl, componentRegistryBaseUrl)
  assert.ok(Array.isArray(categories), 'Manifest categories must be an array')
  assert.ok(Array.isArray(manifest), 'componentManifest must be an array')
  assert.deepEqual(
    categories.map((category) => category.id),
    categoryIds
  )
  assert.deepEqual(
    manifest.map((component) => component.slug),
    catalogSlugs
  )
  assert.equal(
    new Set(manifest.map((component) => component.slug)).size,
    catalogSlugs.length,
    'Manifest component slugs must be unique'
  )

  const validCategoryIds = new Set(categoryIds)
  const expectedMobileHidden = new Set(mobileHiddenSlugs)
  for (const component of manifest) {
    assert.equal(
      validCategoryIds.has(component.categoryId),
      true,
      `Unknown manifest category for ${component.slug}`
    )
    for (const propertyName of [
      'slug',
      'categoryId',
      'title',
      'description',
      'reference',
      'usage',
      'props',
      'registry',
    ]) {
      assert.equal(
        Object.hasOwn(component, propertyName),
        true,
        `Manifest must own ${propertyName} for ${component.slug}`
      )
    }
    assert.equal(
      typeof component.registry.description,
      'string',
      `Manifest must own public description for ${component.slug}`
    )
    assert.ok(
      Array.isArray(component.registry.dependencies),
      `Manifest must own explicit dependencies for ${component.slug}`
    )
    assert.equal(
      component.hiddenOnMobile === true,
      expectedMobileHidden.has(component.slug),
      `Manifest mobile visibility mismatch for ${component.slug}`
    )
  }

  const componentDataSource = parseSource(componentDataPath, ts.ScriptKind.TS)
  const importsManifest = componentDataSource.statements.some(
    (statement) =>
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === './component-manifest.mjs'
  )
  assert.equal(
    importsManifest,
    true,
    'component-data.ts must import the canonical component manifest'
  )
  assert.deepEqual(
    getFrozenSlugLiterals(componentDataSource),
    [],
    'component-data.ts must not duplicate the 46 component slug literals'
  )

  const exportNames = getComponentDataExportNames(componentDataSource)
  for (const exportName of componentDataExports) {
    assert.equal(
      exportNames.has(exportName),
      true,
      `component-data.ts must preserve export ${exportName}`
    )
  }

  const componentData = loadComponentData()
  assert.deepEqual(componentData.componentCategories, categories)
  assert.equal(componentData.componentRegistryBaseUrl, componentRegistryBaseUrl)

  for (const [index, component] of manifest.entries()) {
    const sample = componentData.componentSamples[index]

    assert.equal(sample.slug, component.slug)
    assert.equal(sample.categoryId, component.categoryId)
    assert.equal(sample.title, component.title)
    assert.equal(sample.description, component.description)
    assert.deepEqual(sample.reference, component.reference)
    assert.equal(sample.usage, component.usage)
    assert.equal(sample.code, component.usage)
    assert.deepEqual(sample.props, component.props)
    assert.deepEqual(sample.registry.dependencies, component.registry.dependencies)
    assert.equal(
      componentData.isComponentHiddenOnMobile(component.slug),
      component.hiddenOnMobile === true
    )
  }
})

test('registry builder and check CLI preserve exact artifacts without repository writes', async () => {
  assert.equal(
    existsSync(registryBuilderPath),
    true,
    `Missing side-effect-free registry builder: ${registryBuilderPath}`
  )

  assert.equal(
    existsSync(componentManifestPath),
    true,
    `Missing canonical component manifest required by builder: ${componentManifestPath}`
  )

  const beforeRequire = snapshotRegistryDirectory()
  const builderSource = parseSource(registryBuilderPath, ts.ScriptKind.JS)
  const cliSource = parseSource(registryCliPath, ts.ScriptKind.JS)
  assert.deepEqual(
    getFrozenSlugLiterals(builderSource),
    [],
    'Registry builder must not duplicate frozen component slug metadata'
  )
  assert.deepEqual(
    getFrozenSlugLiterals(cliSource),
    [],
    'Registry CLI must not retain the legacy 46-item metadata owner'
  )

  const requireProbe = spawnSync(
    process.execPath,
    [
      '-e',
      `require(${JSON.stringify(registryBuilderPath)}); process.stdout.write('required')`,
    ],
    {
      cwd: tmpdir(),
      encoding: 'utf8',
    }
  )
  assert.equal(
    requireProbe.status,
    0,
    `Builder require failed: ${requireProbe.stderr || requireProbe.stdout}`
  )
  assert.equal(
    requireProbe.stdout,
    'required',
    'Builder require must not log or exit before returning'
  )
  assert.equal(requireProbe.stderr, '', 'Builder require must not write stderr')
  assert.deepEqual(
    snapshotRegistryDirectory(),
    beforeRequire,
    'Builder require must not modify public/r'
  )

  const builder = createRequire(import.meta.url)(registryBuilderPath)
  for (const exportName of [
    'buildRegistryArtifacts',
    'compareRegistryArtifacts',
    'writeRegistryArtifacts',
  ]) {
    assert.equal(
      typeof builder[exportName],
      'function',
      `Builder must export ${exportName}`
    )
  }

  const manifestModule = await import(pathToFileURL(componentManifestPath).href)
  const artifacts = await builder.buildRegistryArtifacts({
    manifest: manifestModule.componentManifest,
    root,
  })
  assert.ok(artifacts instanceof Map, 'Builder artifacts must be a Map')
  assert.deepEqual([...artifacts.keys()].sort(), getPublicRegistryFilenames())

  for (const [filename, content] of artifacts) {
    assert.equal(
      content,
      readFileSync(join(registryDir, filename), 'utf8'),
      `Generated artifact bytes changed for ${filename}`
    )
  }

  const fixtureRoot = mkdtempSync(join(tmpdir(), 'component-registry-contract-'))
  try {
    const sentinelRoot = join(fixtureRoot, 'sentinel-root')
    const sentinelSourceDir = join(sentinelRoot, 'src/components')
    mkdirSync(sentinelSourceDir, { recursive: true })
    writeFileSync(
      join(sentinelSourceDir, 'contract-sentinel.tsx'),
      [
        "import {} from './empty-import'",
        "export {} from './empty-export'",
        "import {} from 'empty-runtime-package'",
        'export function ContractSentinel() { return null }',
        '',
      ].join('\n')
    )
    writeFileSync(
      join(sentinelSourceDir, 'empty-import.ts'),
      'export const emptyImportSentinel = true\n'
    )
    writeFileSync(
      join(sentinelSourceDir, 'empty-export.ts'),
      'export const emptyExportSentinel = true\n'
    )
    const sentinelComponent = {
      ...manifestModule.componentManifest[0],
      slug: 'contract-sentinel',
      title: 'Contract Sentinel',
      registry: {
        ...manifestModule.componentManifest[0].registry,
        dependencies: ['contract-sentinel-package'],
        description: 'Contract sentinel registry description.',
      },
    }
    const sentinelArtifacts = await builder.buildRegistryArtifacts({
      manifest: [sentinelComponent],
      root: sentinelRoot,
    })
    assert.deepEqual([...sentinelArtifacts.keys()], ['contract-sentinel.json'])

    const sentinelRegistryItem = JSON.parse(
      sentinelArtifacts.get('contract-sentinel.json')
    )
    assert.equal(sentinelRegistryItem.name, 'contract-sentinel')
    assert.equal(sentinelRegistryItem.title, 'Contract Sentinel')
    assert.equal(
      sentinelRegistryItem.description,
      'Contract sentinel registry description.'
    )
    assert.deepEqual(sentinelRegistryItem.dependencies, [
      'contract-sentinel-package',
      'empty-runtime-package',
    ])
    assert.deepEqual(
      sentinelRegistryItem.files.map((file) => file.path),
      [
        'src/components/contract-sentinel.tsx',
        'src/components/empty-import.ts',
        'src/components/empty-export.ts',
      ],
      'Empty static import/export edges must preserve first-discovery file order'
    )

    const outsideEntryPath = join(fixtureRoot, 'outside-entry.tsx')
    writeFileSync(outsideEntryPath, 'export function OutsideEntry() { return null }\n')
    symlinkSync(
      outsideEntryPath,
      join(sentinelSourceDir, 'symlink-sentinel.tsx')
    )
    const symlinkSentinelComponent = {
      ...sentinelComponent,
      slug: 'symlink-sentinel',
    }
    await assert.rejects(
      async () =>
        builder.buildRegistryArtifacts({
          manifest: [symlinkSentinelComponent],
          root: sentinelRoot,
        }),
      (error) => {
        assert.match(error.message, /escapes the repository root/i)
        assert.match(error.message, /slug: symlink-sentinel/)
        assert.match(
          error.message,
          /importer: src\/components\/symlink-sentinel\.tsx/
        )
        assert.match(
          error.message,
          /specifier: src\/components\/symlink-sentinel\.tsx/
        )
        return true
      }
    )

    const compareDir = join(fixtureRoot, 'compare')
    mkdirSync(compareDir)
    writeFileSync(join(compareDir, 'changed.json'), 'old\n')
    writeFileSync(join(compareDir, 'extra.json'), 'extra\n')

    const comparison = await builder.compareRegistryArtifacts({
      artifacts: new Map([
        ['changed.json', 'new\n'],
        ['missing.json', 'missing\n'],
      ]),
      outputDir: compareDir,
    })
    assert.deepEqual(comparison.missing, ['missing.json'])
    assert.deepEqual(comparison.extra, ['extra.json'])
    assert.deepEqual(comparison.changed, ['changed.json'])

    const writeDir = join(fixtureRoot, 'write')
    const writeArtifacts = new Map([
      ['alpha.json', 'alpha\n'],
      ['beta.json', 'beta\n'],
    ])
    await builder.writeRegistryArtifacts({
      artifacts: writeArtifacts,
      outputDir: writeDir,
    })
    assert.deepEqual(readdirSync(writeDir).sort(), [...writeArtifacts.keys()])
    for (const [filename, content] of writeArtifacts) {
      assert.equal(readFileSync(join(writeDir, filename), 'utf8'), content)
    }

    const transactionRoot = join(fixtureRoot, 'transaction')
    const transactionOutputDir = join(transactionRoot, 'registry')
    mkdirSync(transactionOutputDir, { recursive: true })
    writeFileSync(join(transactionOutputDir, 'old.json'), 'exact old artifact\n')

    const nodeFileSystem = createRequire(import.meta.url)('node:fs')
    let directoryRenameCount = 0
    const failingFileSystem = new Proxy(nodeFileSystem, {
      get(target, property, receiver) {
        if (property !== 'renameSync') {
          return Reflect.get(target, property, receiver)
        }

        return (source, destination) => {
          if (nodeFileSystem.statSync(source).isDirectory()) {
            directoryRenameCount += 1
            if (directoryRenameCount === 2) {
              throw new Error('injected second directory rename failure')
            }
          }

          return nodeFileSystem.renameSync(source, destination)
        }
      },
    })

    await assert.rejects(
      async () =>
        builder.writeRegistryArtifacts({
          artifacts: new Map([
            ['new-a.json', 'new a\n'],
            ['new-b.json', 'new b\n'],
          ]),
          fileSystem: failingFileSystem,
          outputDir: transactionOutputDir,
        }),
      /injected second directory rename failure/
    )
    assert.equal(directoryRenameCount, 3, 'Rollback must restore the backup')
    assert.deepEqual(readdirSync(transactionOutputDir), ['old.json'])
    assert.equal(
      readFileSync(join(transactionOutputDir, 'old.json'), 'utf8'),
      'exact old artifact\n'
    )
    assert.deepEqual(
      readdirSync(transactionRoot),
      ['registry'],
      'Failed transaction must clean staging and backup siblings'
    )

    const stagingCollisionRoot = join(fixtureRoot, 'staging-collision')
    const stagingCollisionOutput = join(stagingCollisionRoot, 'registry')
    mkdirSync(stagingCollisionOutput, { recursive: true })
    writeFileSync(join(stagingCollisionOutput, 'old.json'), 'staging old\n')
    let stagingCollisionPath = null
    const stagingCollisionFileSystem = new Proxy(nodeFileSystem, {
      get(target, property, receiver) {
        if (property !== 'mkdirSync') {
          return Reflect.get(target, property, receiver)
        }

        return (directoryPath, options) => {
          if (String(directoryPath).includes('.registry.staging-')) {
            stagingCollisionPath = directoryPath
            nodeFileSystem.mkdirSync(directoryPath)
            nodeFileSystem.writeFileSync(
              join(directoryPath, 'collision-marker'),
              'do not remove\n'
            )
            const error = new Error('injected staging collision')
            error.code = 'EEXIST'
            throw error
          }

          return nodeFileSystem.mkdirSync(directoryPath, options)
        }
      },
    })
    await assert.rejects(
      async () =>
        builder.writeRegistryArtifacts({
          artifacts: new Map([['new.json', 'new\n']]),
          fileSystem: stagingCollisionFileSystem,
          outputDir: stagingCollisionOutput,
        }),
      /injected staging collision/
    )
    assert.equal(
      readFileSync(join(stagingCollisionOutput, 'old.json'), 'utf8'),
      'staging old\n'
    )
    assert.equal(
      readFileSync(join(stagingCollisionPath, 'collision-marker'), 'utf8'),
      'do not remove\n',
      'Writer must not clean a staging path it did not create'
    )

    const backupCollisionRoot = join(fixtureRoot, 'backup-collision')
    const backupCollisionOutput = join(backupCollisionRoot, 'registry')
    mkdirSync(backupCollisionOutput, { recursive: true })
    writeFileSync(join(backupCollisionOutput, 'old.json'), 'backup old\n')
    let backupCollisionPath = null
    const backupCollisionFileSystem = new Proxy(nodeFileSystem, {
      get(target, property, receiver) {
        if (property !== 'renameSync') {
          return Reflect.get(target, property, receiver)
        }

        return (source, destination) => {
          if (
            source === backupCollisionOutput &&
            String(destination).includes('.registry.backup-')
          ) {
            backupCollisionPath = destination
            nodeFileSystem.mkdirSync(destination)
            nodeFileSystem.writeFileSync(
              join(destination, 'collision-marker'),
              'do not remove\n'
            )
            const error = new Error('injected backup collision')
            error.code = 'EEXIST'
            throw error
          }

          return nodeFileSystem.renameSync(source, destination)
        }
      },
    })
    await assert.rejects(
      async () =>
        builder.writeRegistryArtifacts({
          artifacts: new Map([['new.json', 'new\n']]),
          fileSystem: backupCollisionFileSystem,
          outputDir: backupCollisionOutput,
        }),
      /injected backup collision/
    )
    assert.equal(
      readFileSync(join(backupCollisionOutput, 'old.json'), 'utf8'),
      'backup old\n'
    )
    assert.equal(
      readFileSync(join(backupCollisionPath, 'collision-marker'), 'utf8'),
      'do not remove\n',
      'Writer must not clean a backup path it did not create'
    )
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true })
  }

  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  const registryCliSource = readFileSync(registryCliPath, 'utf8')
  assert.equal(
    packageJson.scripts?.['registry:check'],
    'node scripts/generate-component-registry.cjs --check',
    'registry:check must invoke the check-aware registry CLI'
  )
  assert.match(
    registryCliSource,
    /component-registry-builder\.cjs/,
    'Registry CLI must consume the side-effect-free builder before it can be spawned'
  )
  assert.match(
    registryCliSource,
    /--check/,
    'Registry CLI must implement --check before it can be spawned'
  )

  const beforeCheck = snapshotRegistryDirectory()
  const checkResult = spawnSync(process.execPath, [registryCliPath, '--check'], {
    cwd: tmpdir(),
    encoding: 'utf8',
  })
  assert.equal(
    checkResult.status,
    0,
    `Registry --check failed: ${checkResult.stderr || checkResult.stdout}`
  )
  assert.deepEqual(
    snapshotRegistryDirectory(),
    beforeCheck,
    'Registry --check must preserve public/r bytes and filesystem metadata'
  )
})
