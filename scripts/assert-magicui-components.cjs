/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const requiredNames = [
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
  'background-boxes',
  'keyboard',
  'placeholders-and-vanish-input',
  'gooey-input',
  '3d-marquee',
  'avatar-group',
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
]
const cursorEffectNames = [
  'mouse-invert-cursor',
  'mouse-trail-cursor',
  'mouse-ripple-cursor',
  'mouse-custom-cursor',
  'fairy-dust-cursor',
  'bubble-cursor',
  'character-cursor',
  'canvas-cursor',
]
const requiredCategories = [
  "id: 'actions-controls'",
  "name: 'Actions & Controls'",
  "id: 'content-media'",
  "name: 'Content & Media'",
  "id: 'data-structure'",
  "name: 'Data & Structure'",
  "id: 'text-typography'",
  "name: 'Text & Typography'",
  "id: 'effects-backgrounds'",
  "name: 'Effects & Backgrounds'",
]
const removedNames = [
  'action-button',
  'component-nav',
  'status-notice',
  'gradient-heading',
  'magic-card',
  'text-animate',
  'animated-shiny-text',
  'animated-gradient-text',
  'backlight',
  'aurora',
  'circular-gallery',
  'dot-field',
  'file-upload',
  'floating-dock',
  'glass-surface',
  'pixelated-canvas',
  'signup-form',
  'speed-dial',
  'stepper',
  'strands',
  'variable-proximity',
  'wobble-card',
  'animated-radio-group',
  '3d-image-slider',
  'border-beam',
  'lanyard',
  'border-glow',
  'link-preview',
  'animated-checkbox',
  'kinetic-center-build',
  'border-beam-button',
  'comet-card',
  'cool-theme-toggle',
  'slide-arrow-button',
  'fluid-cursor',
  'shine-border',
]
const removedCategories = [
  'core',
  'surfaces',
  'feedback',
  'typography',
  'buttons',
  'components',
  'animations',
  'backgrounds',
  'cards',
  'forms',
  'effects',
  'fabs',
  'text',
  'media',
  'controls',
  'data-display',
]
const motionNames = [
  'shiny-button',
  'lens',
  'pointer',
  'stack',
  'carousel',
  'elastic-slider',
  'counter',
  'typing-animation',
  'number-ticker',
  'dia-text-reveal',
  'highlighter',
  'background-boxes',
  'keyboard',
  'placeholders-and-vanish-input',
  'gooey-input',
  '3d-marquee',
  'avatar-group',
  'playful-todolist',
  'text-flip',
]
const oglNames = []
const reactThreeNames = []
const reactIconsNames = ['carousel']
const cssRegistryNames = [
  'ripple-button',
  'marquee',
  'meteors',
  'typing-animation',
  'aurora-text',
]
const dataPath = path.join(
  root,
  'src/features/component-library/component-data.ts'
)
const docsPath = path.join(
  root,
  'src/features/component-library/component-docs.tsx'
)
const componentsPagePath = path.join(root, 'src/app/components/page.tsx')
const layoutPath = path.join(root, 'src/app/components/layout.tsx')
const globalsPath = path.join(root, 'src/app/globals.css')
const sidebarPath = path.join(
  root,
  'src/features/component-library/component-sidebar.tsx'
)
const previewsPath = path.join(
  root,
  'src/features/component-library/component-previews.tsx'
)
const exampleTabsPath = path.join(
  root,
  'src/features/component-library/component-example-tabs.tsx'
)
const highlightedCodeBlockPath = path.join(
  root,
  'src/components/code/HighlightedCodeBlock.tsx'
)
const notionCodeBlockPath = path.join(root, 'src/components/notion/CodeBlock.tsx')
const installTabsPath = path.join(
  root,
  'src/features/component-library/install-command-tabs.tsx'
)
const brandLogoPath = path.join(root, 'src/components/BrandLogo.tsx')
const logoMotionsPath = path.join(root, 'src/lib/logoMotions.ts')
const videoTextPath = path.join(root, 'src/components/magicui/video-text.tsx')
const diaTextRevealPath = path.join(
  root,
  'src/components/magicui/dia-text-reveal.tsx'
)
const toggleThemePath = path.join(root, 'src/components/magicui/toggle-theme.tsx')
const playfulTodoListPath = path.join(
  root,
  'src/components/magicui/playful-todolist.tsx'
)
const avatarGroupPath = path.join(root, 'src/components/magicui/avatar-group.tsx')
const dataTablePath = path.join(root, 'src/components/magicui/data-table.tsx')
const fileTreePath = path.join(root, 'src/components/magicui/file-tree.tsx')
const textFlipPath = path.join(root, 'src/components/magicui/text-flip.tsx')
const cursorEffectRuntimePath = path.join(
  root,
  'src/components/magicui/cursor-effect-runtime.tsx'
)
const dataSource = fs.readFileSync(dataPath, 'utf8')
const docsSource = fs.readFileSync(docsPath, 'utf8')
const componentsPageSource = fs.readFileSync(componentsPagePath, 'utf8')
const layoutSource = fs.readFileSync(layoutPath, 'utf8')
const globalsSource = fs.readFileSync(globalsPath, 'utf8')
const previewsSource = fs.readFileSync(previewsPath, 'utf8')
const brandLogoSource = fs.readFileSync(brandLogoPath, 'utf8')
const logoMotionsSource = fs.readFileSync(logoMotionsPath, 'utf8')
const videoTextSource = fs.readFileSync(videoTextPath, 'utf8')
const diaTextRevealSource = fs.readFileSync(diaTextRevealPath, 'utf8')
const toggleThemeSource = fs.readFileSync(toggleThemePath, 'utf8')
const playfulTodoListSource = fs.readFileSync(playfulTodoListPath, 'utf8')
const avatarGroupSource = fs.readFileSync(avatarGroupPath, 'utf8')
const dataTableSource = fs.readFileSync(dataTablePath, 'utf8')
const fileTreeSource = fs.readFileSync(fileTreePath, 'utf8')
const textFlipSource = fs.readFileSync(textFlipPath, 'utf8')
const cursorEffectRuntimeSource = fs.existsSync(cursorEffectRuntimePath)
  ? fs.readFileSync(cursorEffectRuntimePath, 'utf8')
  : ''

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

for (const category of requiredCategories) {
  assert(
    dataSource.includes(category),
    `Missing required category marker in component-data.ts: ${category}`
  )
}

for (const category of removedCategories) {
  assert(
    !dataSource.includes(`id: '${category}'`) &&
      !dataSource.includes(`categoryId: '${category}'`),
    `Removed category still exists: ${category}`
  )
}

for (const name of removedNames) {
  assert(
    !dataSource.includes(`slug: '${name}'`),
    `Removed sample still exists: ${name}`
  )
  assert(
    !fs.existsSync(path.join(root, `src/components/magicui/${name}.tsx`)),
    `Removed source file still exists: ${name}`
  )
  assert(
    !fs.existsSync(path.join(root, `public/r/${name}.json`)),
    `Removed registry file still exists: ${name}`
  )
}

for (const name of requiredNames) {
  assert(
    dataSource.includes(`slug: '${name}'`),
    `Missing ${name} sample in component-data.ts`
  )

  const sourcePath = path.join(root, `src/components/magicui/${name}.tsx`)
  assert(fs.existsSync(sourcePath), `Missing source file: ${sourcePath}`)

  const registryPath = path.join(root, `public/r/${name}.json`)
  assert(fs.existsSync(registryPath), `Missing registry file: ${registryPath}`)

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'))
  assert(
    registry.$schema === 'https://ui.shadcn.com/schema/registry-item.json',
    `${name} registry item has wrong schema`
  )
  assert(registry.name === name, `${name} registry item has wrong name`)
  assert(registry.type === 'registry:ui', `${name} registry item has wrong type`)
  assert(
    Array.isArray(registry.files) &&
      registry.files.length === (cursorEffectNames.includes(name) ? 2 : 1),
    `${name} registry item should expose the expected source files`
  )
  assert(
    registry.files[0].path === `src/components/magicui/${name}.tsx`,
    `${name} registry file path should match local source path`
  )
  assert(
    typeof registry.files[0].content === 'string' &&
      (/export (function|const) /.test(registry.files[0].content) ||
        registry.files[0].content.includes('export {')),
    `${name} registry item should include component source`
  )
}

for (const name of cursorEffectNames) {
  assert(
    previewsSource.includes(`case '${name}'`),
    `${name} preview should be wired into component-previews.tsx`
  )

  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  assert(
    registry.files.some(
      (file) => file.path === 'src/components/magicui/cursor-effect-runtime.tsx'
    ),
    `${name} registry item should include cursor-effect-runtime.tsx`
  )
}

for (const requiredRuntimePart of [
  'prefers-reduced-motion: reduce',
  'matchMedia',
  'ResizeObserver',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'IntersectionObserver',
  'contentvisibilityautostatechange',
  'pointer-events-none',
  'cursify',
  'Adapted from',
]) {
  assert(
    cursorEffectRuntimeSource.includes(requiredRuntimePart),
    `cursor runtime missing performance/source marker: ${requiredRuntimePart}`
  )
}

for (const name of motionNames) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('motion'),
    `${name} registry item should include motion dependency`
  )
}

for (const name of oglNames) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('ogl'),
    `${name} registry item should include ogl dependency`
  )
}

for (const name of reactThreeNames) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  for (const dependency of [
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/rapier',
    'meshline',
    'three',
  ]) {
    assert(
      Array.isArray(registry.dependencies) &&
        registry.dependencies.includes(dependency),
      `${name} registry item should include ${dependency} dependency`
    )
  }
}

for (const name of reactIconsNames) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('react-icons'),
    `${name} registry item should include react-icons dependency`
  )
}

{
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, 'public/r/file-tree.json'), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('@radix-ui/react-accordion') &&
      registry.dependencies.includes('@radix-ui/react-scroll-area') &&
      registry.dependencies.includes('lucide-react'),
    'file-tree registry item should include tree dependencies'
  )
  assert(
    Array.isArray(registry.registryDependencies) &&
      registry.registryDependencies.includes('button') &&
      registry.registryDependencies.includes('scroll-area'),
    'file-tree registry item should include button and scroll-area registry dependencies'
  )
}

{
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, 'public/r/confetti.json'), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('canvas-confetti') &&
      registry.dependencies.includes('@types/canvas-confetti'),
    'confetti registry item should include canvas-confetti dependencies'
  )
  assert(
    Array.isArray(registry.registryDependencies) &&
      registry.registryDependencies.includes('button'),
    'confetti registry item should include button registry dependency'
  )
}

{
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, 'public/r/highlighter.json'), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('rough-notation'),
    'highlighter registry item should include rough-notation dependency'
  )
}

{
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, 'public/r/sparkle-cursor.json'), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('gsap'),
    'sparkle-cursor registry item should include gsap dependency'
  )
}

{
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, 'public/r/toggle-theme.json'), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('lucide-react') &&
      registry.dependencies.includes('next-themes'),
    'toggle-theme registry item should include lucide-react and next-themes dependencies'
  )
}

const marquee = JSON.parse(
  fs.readFileSync(path.join(root, 'public/r/marquee.json'), 'utf8')
)
assert(
  marquee.css?.['@keyframes marquee'] &&
    marquee.css?.['@keyframes marquee-vertical'],
  'marquee registry item should include marquee keyframes'
)

for (const name of cssRegistryNames) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  assert(
    registry.css || registry.cssVars,
    `${name} registry item should include Magic UI CSS metadata`
  )
}

assert(
  fs.existsSync(exampleTabsPath),
  `Missing example tabs file: ${exampleTabsPath}`
)

const exampleTabsSource = fs.readFileSync(exampleTabsPath, 'utf8')
const codeBlockPath = path.join(
  root,
  'src/features/component-library/component-code-block.tsx'
)
const codeBlockSource = fs.readFileSync(codeBlockPath, 'utf8')
assert(
  fs.existsSync(highlightedCodeBlockPath),
  `Missing shared highlighted code block: ${highlightedCodeBlockPath}`
)
assert(
  fs.existsSync(installTabsPath),
  `Missing install command tabs file: ${installTabsPath}`
)
const highlightedCodeBlockSource = fs.readFileSync(highlightedCodeBlockPath, 'utf8')
const notionCodeBlockSource = fs.readFileSync(notionCodeBlockPath, 'utf8')
const installTabsSource = fs.readFileSync(installTabsPath, 'utf8')
const meteorsSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/meteors.tsx'),
  'utf8'
)
const carouselSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/carousel.tsx'),
  'utf8'
)
const folderSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/folder.tsx'),
  'utf8'
)
const elasticSliderSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/elastic-slider.tsx'),
  'utf8'
)
const stackSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/stack.tsx'),
  'utf8'
)
const shinyButtonSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/shiny-button.tsx'),
  'utf8'
)
const flowerMenuSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/flower-menu.tsx'),
  'utf8'
)
const gooeyInputSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/gooey-input.tsx'),
  'utf8'
)
const auroraTextSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/aurora-text.tsx'),
  'utf8'
)
const curvedLoopSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/curved-loop.tsx'),
  'utf8'
)
const clickSparkSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/click-spark.tsx'),
  'utf8'
)
const particlesSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/particles.tsx'),
  'utf8'
)
const placeholdersAndVanishInputSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/placeholders-and-vanish-input.tsx'),
  'utf8'
)
const threeDImageCarouselSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/3d-image-carousel.tsx'),
  'utf8'
)
const highlighterSource = fs.readFileSync(
  path.join(root, 'src/components/magicui/highlighter.tsx'),
  'utf8'
)
assert(
  !exampleTabsSource.includes('>Example<') &&
    !exampleTabsSource.includes('id="example-heading"'),
  'Example tabs should not render an Example heading'
)
assert(
  !exampleTabsSource.includes('sample.filePath'),
  'Example tabs should not render the file path beside the tabs'
)
assert(
  !exampleTabsSource.includes('radial-gradient'),
  'Example tabs should not use nested gradient preview frames'
)
assert(
  exampleTabsSource.includes('rounded-2xl border border-zinc-200'),
  'Example tabs should render one gray rounded border around the active panel'
)
assert(
  exampleTabsSource.includes('Preview') &&
    !exampleTabsSource.includes("id: 'code'") &&
    !exampleTabsSource.includes('role="tabpanel"'),
  'Example area should render a single static Preview section'
)
assert(
  exampleTabsSource.includes('id="preview-heading"') &&
    exampleTabsSource.includes('text-xl font-semibold') &&
    !exampleTabsSource.includes('-mb-px border-b-2'),
  'Preview heading should match the Installation and Code section title style'
)
assert(
  !exampleTabsSource.includes('fullBleedPreviewKinds') &&
    exampleTabsSource.includes('min-h-[28rem] rounded-[inherit]') &&
    exampleTabsSource.includes('flex min-h-[28rem] items-center justify-center overflow-hidden rounded-[inherit]') &&
    !exampleTabsSource.includes('p-6'),
  'All component previews should render full-bleed with a 448px minimum height'
)
assert(
  !previewsSource.includes('bg-background p-8') &&
    previewsSource.includes('bg-background text-center'),
  'Outer effect preview surfaces should not add 32px inner padding'
)
assert(
  !exampleTabsSource.includes('codePanel') &&
    !exampleTabsSource.includes('ReactNode') &&
    !exampleTabsSource.includes('import { CodeBlock }'),
  'Example preview should not render or receive a code panel'
)

for (const requiredCodeBlockPart of [
  'HighlightedCodeBlock',
  "language = 'typescript'",
  'variant="embedded"',
]) {
  assert(
    codeBlockSource.includes(requiredCodeBlockPart),
    `Component code block missing shared renderer part: ${requiredCodeBlockPart}`
  )
}
for (const requiredSharedPart of [
  'codeToHtml',
  'decorateCodeHtml',
  'getCodeLanguageIconSrc',
  'CodeCopyButton',
  'code-line',
]) {
  assert(
    highlightedCodeBlockSource.includes(requiredSharedPart),
    `Shared highlighted code block missing posts-style part: ${requiredSharedPart}`
  )
}
assert(
  notionCodeBlockSource.includes('HighlightedCodeBlock'),
  'Notion CodeBlock should reuse shared HighlightedCodeBlock'
)
for (const manager of ['pnpm', 'npm', 'yarn', 'bun']) {
  assert(
    installTabsSource.includes(manager),
    `Install command tabs missing ${manager}`
  )
}
assert(
  docsSource.includes('language="bash"'),
  'Install command tabs should render bash-highlighted command panels'
)

assert(
  docsSource.includes('<ComponentExampleTabs sample={sample} />') &&
    docsSource.includes('InstallCommand'),
  'Component detail page should render preview separately from install commands'
)
assert(
  docsSource.includes('code-section-block-shell') &&
    docsSource.includes('rounded-2xl border border-zinc-200'),
  'Code section should wrap the highlighted code block in a rounded border shell'
)
assert(
  docsSource.includes('id="code"') &&
    docsSource.includes('id="code-heading"') &&
    !docsSource.includes('id="usage"') &&
    !docsSource.includes('Usage'),
  'Component detail page should rename Usage to Code'
)
assert(
  !docsSource.includes('sample.status') &&
    !componentsPageSource.includes('sample.status'),
  'Component pages should not render Ready status badges'
)
assert(
  !componentsPageSource.includes('componentSamples.map') &&
    !componentsPageSource.includes('<PreviewFrame sample={sample} mode="thumbnail" />') &&
    !componentsPageSource.includes('id="components"') &&
    !componentsPageSource.includes('>\n          Components\n        </h1>') &&
    !componentsPageSource.includes('Browse components'),
  'Components introduction page should not render or label the removed component preview section'
)
assert(
  docsSource.includes('sample.reference.url') &&
    docsSource.includes('sample.reference.label') &&
    !docsSource.includes('sample.registry.dependencies'),
  'Component detail page should render reference links without dependency chips'
)
assert(
  previewsSource.includes('function PreviewDemoSurface') &&
    previewsSource.includes('data-preview-demo-surface') &&
    !previewsSource.includes('function CursorDemoSurface'),
  'Component previews should use the shared dark demo surface instead of cursor-only surface'
)
const previewSurfaceFunctionIndex = previewsSource.indexOf('function PreviewDemoSurface')
assert(previewSurfaceFunctionIndex >= 0, 'Missing PreviewDemoSurface function')
const previewSurfaceNextFunctionIndex = previewsSource.indexOf(
  '\nfunction ',
  previewSurfaceFunctionIndex + 1
)
const previewSurfaceSource = previewsSource.slice(
  previewSurfaceFunctionIndex,
  previewSurfaceNextFunctionIndex === -1 ? undefined : previewSurfaceNextFunctionIndex
)
assert(
  previewSurfaceSource.indexOf('{label}') <
    previewSurfaceSource.indexOf('{title}') &&
    previewSurfaceSource.indexOf('{title}') <
      previewSurfaceSource.indexOf('{subtitle}') &&
    previewSurfaceSource.indexOf('{subtitle}') <
      previewSurfaceSource.indexOf('{children ? ('),
  'Preview demo surface should render component content below category, title, and subtitle'
)
assert(
  previewsSource.includes('function KeyboardPreview') &&
    previewsSource.includes('className="min-h-[44rem]"'),
  'Keyboard preview should use a taller surface than the 448px minimum'
)
assert(
  previewSurfaceSource.includes('py-16') &&
    previewSurfaceSource.includes('md:py-20') &&
    previewSurfaceSource.includes('contentGapClassName') &&
    previewSurfaceSource.includes('children ? ('),
  'Preview demo surface should keep a 448px minimum while giving taller content generous vertical padding'
)
for (const requiredDemoSurfacePreview of [
  'BackgroundBoxesPreview',
  'KeyboardPreview',
  'PlaceholdersAndVanishInputPreview',
  'GooeyInputPreview',
  'ThreeDMarqueePreview',
  'AvatarGroupPreview',
  'PlayfulTodoListPreview',
  'FlowerMenuPreview',
  'TextFlipPreview',
  'ToggleThemePreview',
  'ThreeDImageCarouselPreview',
  'DataTablePreview',
  'RippleButtonPreview',
  'ShinyButtonPreview',
  'MarqueePreview',
  'IconCloudPreview',
  'LensPreview',
  'PointerPreview',
  'FileTreePreview',
  'AnimatedCircularProgressBarPreview',
  'CurvedLoopPreview',
  'ClickSparkPreview',
  'MagnetPreview',
  'StackPreview',
  'FolderPreview',
  'CarouselPreview',
  'ElasticSliderPreview',
  'CounterPreview',
  'ConfettiPreview',
  'SparkleCursorPreview',
  'MeteorsPreview',
  'ParticlesPreview',
  'TypingAnimationPreview',
  'AuroraTextPreview',
  'NumberTickerPreview',
  'DiaTextRevealPreview',
  'MorphingTextPreview',
  'HighlighterPreview',
  'VideoTextPreview',
  'MouseInvertCursorPreview',
  'MouseTrailCursorPreview',
  'MouseRippleCursorPreview',
  'MouseCustomCursorPreview',
  'FairyDustCursorPreview',
  'BubbleCursorPreview',
  'CharacterCursorPreview',
  'CanvasCursorPreview',
]) {
  const functionIndex = previewsSource.indexOf(`function ${requiredDemoSurfacePreview}`)
  assert(functionIndex >= 0, `Missing preview function: ${requiredDemoSurfacePreview}`)
  const nextFunctionIndex = previewsSource.indexOf('\nfunction ', functionIndex + 1)
  const previewFunctionSource = previewsSource.slice(
    functionIndex,
    nextFunctionIndex === -1 ? undefined : nextFunctionIndex
  )
  assert(
    previewFunctionSource.includes('<PreviewDemoSurface'),
    `${requiredDemoSurfacePreview} should use PreviewDemoSurface`
  )
}
for (const removedPreviewPart of [
  'SlideArrowButtonPreview',
  "case 'slide-arrow-button'",
  "import { SlideArrowButton }",
]) {
  assert(
    !previewsSource.includes(removedPreviewPart),
    `Slide Arrow Button should be removed from previews: ${removedPreviewPart}`
  )
}
assert(
  !fs.readFileSync(path.join(root, 'scripts/generate-magicui-registry.cjs'), 'utf8')
    .includes("name: 'slide-arrow-button'"),
  'Slide Arrow Button should be removed from registry generation'
)
for (const removedComponentPart of [
  'FluidCursorPreview',
  "case 'fluid-cursor'",
  "import { FluidCursor }",
  'ShineBorderPreview',
  "case 'shine-border'",
  "import { ShineBorder }",
]) {
  assert(
    !previewsSource.includes(removedComponentPart),
    `Removed component should be removed from previews: ${removedComponentPart}`
  )
}
const generatorSource = fs.readFileSync(
  path.join(root, 'scripts/generate-magicui-registry.cjs'),
  'utf8'
)
for (const removedGeneratorName of ['fluid-cursor', 'shine-border']) {
  assert(
    !generatorSource.includes(`name: '${removedGeneratorName}'`),
    `${removedGeneratorName} should be removed from registry generation`
  )
}
const previewFunctionSource = (functionName) => {
  const functionIndex = previewsSource.indexOf(`function ${functionName}`)
  assert(functionIndex >= 0, `Missing preview function: ${functionName}`)
  const nextFunctionIndex = previewsSource.indexOf('\nfunction ', functionIndex + 1)
  return previewsSource.slice(
    functionIndex,
    nextFunctionIndex === -1 ? undefined : nextFunctionIndex
  )
}
const threeDImageCarouselPreviewSource = previewFunctionSource('ThreeDImageCarouselPreview')
assert(
  !threeDImageCarouselPreviewSource.includes('!bg-transparent') &&
    threeDImageCarouselPreviewSource.includes('!overflow-visible'),
  '3D Image Carousel preview should let the component own the transparent stage without clipping'
)
assert(
  previewFunctionSource('FolderPreview').includes('mt-16'),
  'Folder preview content should sit lower to leave room for expansion'
)
assert(
  previewFunctionSource('CounterPreview').includes('gradientHeight={0}'),
  'Counter preview should hide the white gradient bands'
)
assert(
  previewFunctionSource('TextFlipPreview').includes('wordColors={textFlipColors}') &&
    previewFunctionSource('TextFlipPreview').includes('gap-2') &&
    previewFunctionSource('TextFlipPreview').includes('wordClassName="w-[9ch] justify-items-start text-left"') &&
    textFlipSource.includes('wordColors?: readonly string[]') &&
    textFlipSource.includes('style={{ color: wordColors?.[index % wordColors.length] }}') &&
    !textFlipSource.includes('text-[var(--theme-accent-current)]'),
  'Text Flip preview should keep the changing word adjacent while centering the full longest phrase'
)
const curvedLoopPreviewSource = previewFunctionSource('CurvedLoopPreview')
assert(
  !curvedLoopPreviewSource.includes('overlay={') &&
    curvedLoopPreviewSource.includes('<CurvedLoop') &&
    curvedLoopPreviewSource.includes('contentClassName="w-full max-w-none"') &&
    curvedLoopPreviewSource.includes('w-[calc(100%+4rem)]') &&
    curvedLoopPreviewSource.includes('curveAmount={150}') &&
    curvedLoopPreviewSource.includes('colors={auroraSparkColors}') &&
    curvedLoopSource.includes('colors?: readonly string[]') &&
    curvedLoopSource.includes('<linearGradient') &&
    curvedLoopSource.includes('fill={gradientColors ?'),
  'Curved Loop preview should render a steeper full-width loop with SVG Aurora gradient text'
)
const videoTextPreviewSource = previewFunctionSource('VideoTextPreview')
assert(
  videoTextPreviewSource.includes('fontSize={17}') &&
    videoTextPreviewSource.includes('h-72') &&
    videoTextPreviewSource.includes('max-w-4xl') &&
    videoTextPreviewSource.includes('contentClassName="w-full max-w-4xl"'),
  'Video Text preview should render the masked text at roughly half of the parent width'
)
const keyboardPreviewSource = previewFunctionSource('KeyboardPreview')
assert(
  keyboardPreviewSource.includes('headingClassName="-translate-y-10 md:-translate-y-12"') &&
    keyboardPreviewSource.includes('contentGapClassName="mt-3"'),
  'Keyboard preview heading should sit higher without leaving excessive space above the keystroke preview'
)
assert(
  previewFunctionSource('AvatarGroupPreview').includes('contentGapClassName="mt-16"') &&
    avatarGroupSource.includes('bottom-[calc(100%+26px)]') &&
    avatarGroupSource.includes('bg-[#3c3540]/95') &&
    avatarGroupSource.includes('top-[calc(100%-1px)]') &&
    avatarGroupSource.includes('backdrop-blur-md') &&
    avatarGroupSource.includes('text-white'),
  'Avatar Group preview should sit lower and use a raised seamless tooltip on the dark surface'
)
assert(
  playfulTodoListSource.includes('space-y-4') &&
    playfulTodoListSource.includes('p-5') &&
    playfulTodoListSource.includes('bg-white/[0.07]') &&
    playfulTodoListSource.includes('text-white/42') &&
    playfulTodoListSource.includes('stroke-white/38') &&
    playfulTodoListSource.includes('checked[index]'),
  'Playful Todo List checked text should dim on a glass panel and item spacing should be tighter'
)
assert(
  !toggleThemeSource.includes('<Check className=') &&
    !toggleThemeSource.includes('<Sparkles className=') &&
    toggleThemeSource.includes('<span>{label}</span>'),
  'Toggle Theme labeled buttons should not render trailing state icons'
)
assert(
  previewFunctionSource('AnimatedCircularProgressBarPreview').includes('onClick={() => setValue') &&
    previewFunctionSource('AnimatedCircularProgressBarPreview').includes('aria-label="Decrease progress value"') &&
    previewFunctionSource('AnimatedCircularProgressBarPreview').includes('aria-label="Increase progress value"') &&
    !previewFunctionSource('AnimatedCircularProgressBarPreview').includes('setInterval'),
  'Circular Progress preview should use manual controls instead of automatic value cycling'
)
assert(
  !previewFunctionSource('DataTablePreview').includes('dark-preview-panel') &&
    dataTableSource.includes('gridTemplateColumns') &&
    dataTableSource.includes('rounded-[34px] border border-white/10 bg-white/[0.085] p-2 pt-0') &&
    dataTableSource.includes('className="grid px-1 text-white/58"') &&
    dataTableSource.includes('rounded-[28px] border border-white/10 bg-white/[0.055]') &&
    dataTableSource.includes('className="grid border-t border-white/10') &&
    !dataTableSource.includes('border-separate') &&
    dataTableSource.includes('bg-white/[0.025]') &&
    dataTableSource.includes('hover:bg-white/[0.075]'),
  'Table preview should use a glass outer header shell that wraps the inset body rows'
)
assert(
  previewFunctionSource('FileTreePreview').includes('w-[min(34rem,90vw)]') &&
    previewFunctionSource('FileTreePreview').includes('h-[28rem]') &&
    previewFunctionSource('FileTreePreview').includes('text-base') &&
    fileTreeSource.includes('w-full items-center') &&
    fileTreeSource.includes('min-w-0 flex-1 truncate'),
  'File Tree preview should use a stable taller dark panel with larger text and no width shift on collapse'
)
assert(
  previewFunctionSource('CarouselPreview').includes('variant="dark"') &&
    carouselSource.includes("variant?: 'light' | 'dark'") &&
    carouselSource.includes('data-carousel-variant={variant}'),
  'Carousel preview should use a dark variant that matches the shared preview surface'
)
assert(
  previewFunctionSource('DiaTextRevealPreview').includes('textColor="#ffffff"') &&
    previewFunctionSource('DiaTextRevealPreview').includes('finalTextColor="#ffffff"'),
  'Dia Text Reveal preview should leave white text after the color sweep'
)
assert(
  !previewFunctionSource('AuroraTextPreview').includes('bg-white') &&
    previewFunctionSource('AuroraTextPreview').includes('auroraOriginalColors') &&
    !previewFunctionSource('AuroraTextPreview').includes('themeGradientColors') &&
    !auroraTextSource.includes('absolute inset-0'),
  'Aurora Text preview should keep the original dark-stage text treatment and only swap the gradient palette'
)
assert(
  previewFunctionSource('MorphingTextPreview').includes('contentClassName="w-full max-w-4xl"') &&
    previewFunctionSource('MorphingTextPreview').includes('w-[min(42rem,82vw)]') &&
    previewFunctionSource('MorphingTextPreview').includes('justify-center'),
  'Morphing Text preview should center the morphing element'
)
assert(
  !previewFunctionSource('SparkleCursorPreview').includes('<Sparkles'),
  'Sparkle Cursor preview should not render the star icon below the subtitle'
)
assert(
  previewFunctionSource('PointerTile').includes('h-36') &&
    previewFunctionSource('PointerTile').includes('text-white') &&
    previewFunctionSource('PointerTile').includes('text-white/55'),
  'Pointer preview tiles should be shorter rectangles with white text'
)
assert(
  previewFunctionSource('ClickSparkPreview').includes('sparkColors={auroraSparkColors}') &&
    previewFunctionSource('ClickSparkPreview').includes('[&>canvas]:z-20') &&
    previewFunctionSource('ClickSparkPreview').includes('cursor-crosshair') &&
    !previewFunctionSource('ClickSparkPreview').includes('<button') &&
    clickSparkSource.includes('sparkColors?: readonly string[]') &&
    clickSparkSource.includes('color: string') &&
    clickSparkSource.includes('ctx.strokeStyle = spark.color'),
  'Click Spark preview should spark from the full surface with stable per-spark Aurora colors'
)
assert(
  previewFunctionSource('GooeyInputPreview').includes('placeholder="Search Something"') &&
    previewFunctionSource('GooeyInputPreview').includes('collapsedLabel="Search Something"') &&
    previewFunctionSource('GooeyInputPreview').includes('collapsedWidth={420}') &&
    previewFunctionSource('GooeyInputPreview').includes('expandedWidth={388}') &&
    previewFunctionSource('GooeyInputPreview').includes('expandedOffset={56}') &&
    previewFunctionSource('GooeyInputPreview').includes('gooeyBlur={5}') &&
    previewFunctionSource('GooeyInputPreview').includes('className="w-full max-w-md"') &&
    previewFunctionSource('GooeyInputPreview').includes('filterWrap:') &&
    previewFunctionSource('GooeyInputPreview').includes('h-12') &&
    gooeyInputSource.includes('data-gooey-filter-wrap') &&
    gooeyInputSource.includes('data-gooey-trigger') &&
    gooeyInputSource.includes('data-gooey-bubble') &&
    !gooeyInputSource.includes('data-gooey-filter-layer') &&
    !previewFunctionSource('GooeyInputPreview').includes('gooLayer:') &&
    previewFunctionSource('GooeyInputPreview').includes('bg-[#25282d]') &&
    previewFunctionSource('GooeyInputPreview').includes('text-white/75') &&
    previewFunctionSource('GooeyInputPreview').includes('shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)]') &&
    previewFunctionSource('GooeyInputPreview').includes('placeholder:text-white/45'),
  'Gooey Input preview should keep the original gooey animation structure while using a taller Vanish Input-like outer shell'
)
assert(
  previewFunctionSource('FlowerMenuPreview').includes('variant="glass"') &&
    flowerMenuSource.includes("variant?: 'default' | 'glass'") &&
    flowerMenuSource.includes("variant === 'glass'"),
  'Flower Menu preview should render trigger and petals with the glass variant'
)
assert(
  previewFunctionSource('RippleButtonPreview').includes('rippleColor="rgba(56,189,248,0.36)"') &&
    previewFunctionSource('RippleButtonPreview').includes('glassButtonClassName') &&
    previewFunctionSource('RippleButtonPreview').includes('Click me'),
  'Ripple Button preview should use a glass button with a sky-tinted ripple'
)
assert(
  !previewFunctionSource('ShinyButtonPreview').includes('style={themeAccentButtonStyle}') &&
    previewFunctionSource('ShinyButtonPreview').includes('shineColor="rgba(56,189,248,0.68)"') &&
    previewFunctionSource('ShinyButtonPreview').includes('glassStaticButtonClassName') &&
    !previewFunctionSource('ShinyButtonPreview').includes('glassButtonClassName') &&
    shinyButtonSource.includes('shineColor?: string'),
  'Shiny Button preview should use a static glass button with white text and sky shine'
)
assert(
  elasticSliderSource.includes('text-2xl') &&
    elasticSliderSource.includes('-translate-y-8') &&
    elasticSliderSource.includes('text-xl') &&
    elasticSliderSource.includes('bg-white/[0.12]') &&
    elasticSliderSource.includes('bg-sky-400') &&
    elasticSliderSource.includes('text-white/58'),
  'Elastic Slider should use glass rail styling with larger progress and control icons'
)
assert(
  previewFunctionSource('CounterPreview').includes('textColor="#ffffff"') &&
    previewFunctionSource('CounterPreview').includes('glassIconButtonClassName'),
  'Counter preview should render the animated number and controls in glass styling'
)
assert(
  previewFunctionSource('PlaceholdersAndVanishInputPreview').includes('variant="glass"') &&
    placeholdersAndVanishInputSource.includes("variant?: 'light' | 'glass'") &&
    placeholdersAndVanishInputSource.includes("isGlass ? 'text-white/45'") &&
    placeholdersAndVanishInputSource.includes('backdrop-blur-md'),
  'Placeholders And Vanish Input preview should use the glass variant'
)
assert(
  previewFunctionSource('ToggleThemePreview').includes('variant="glass"') &&
    toggleThemeSource.includes("variant?: 'default' | 'glass'") &&
    toggleThemeSource.includes('bg-white/[0.08]') &&
    toggleThemeSource.includes('backdrop-blur-md'),
  'Toggle Theme preview should use glass root, track, and thumb styling'
)
assert(
  !threeDImageCarouselPreviewSource.includes('!bg-transparent') &&
    threeDImageCarouselSource.includes('bg-transparent') &&
    threeDImageCarouselSource.includes('aria-label="Previous image"') &&
    threeDImageCarouselSource.includes('aria-label="Next image"') &&
    threeDImageCarouselSource.includes('bg-white/[0.08]') &&
    threeDImageCarouselSource.includes('backdrop-blur-md'),
  '3D Image Carousel should own transparent stage and glass arrow buttons'
)
assert(
  previewFunctionSource('LensPreview').includes('bg-white/[0.07]') &&
    previewFunctionSource('LensPreview').includes('backdrop-blur-md') &&
    previewFunctionSource('LensPreview').includes('text-white/58'),
  'Lens preview card should use the same glass card treatment'
)
assert(
  previewFunctionSource('ConfettiPreview').includes('glassButtonClassName') &&
    !previewFunctionSource('ConfettiPreview').includes('style={originalAccentButtonStyle}'),
  'Confetti preview should use a glass button instead of the old accent button'
)
assert(
  previewFunctionSource('ParticlesPreview').includes('colors={cosmicParticleColors}') &&
    particlesSource.includes('colors?: readonly string[]') &&
    particlesSource.includes('color: number[]') &&
    particlesSource.includes('colorPalette'),
  'Particles preview should render with a varied cosmic color palette'
)
assert(
  previewFunctionSource('MagnetPreview').includes('bg-white/[0.08]') &&
    !previewFunctionSource('MagnetPreview').includes('style={originalAccentButtonStyle}'),
  'Magnet preview should use a glassy dark-surface chip instead of the amber accent button'
)
assert(
  fs.existsSync(sidebarPath),
  `Missing active sidebar file: ${sidebarPath}`
)
const sidebarSource = fs.readFileSync(sidebarPath, 'utf8')
assert(
  sidebarSource.includes('useState') &&
    sidebarSource.includes('componentSearchQuery') &&
    sidebarSource.includes('filteredSamples') &&
    sidebarSource.includes('aria-label="컴포넌트 메뉴 검색"') &&
    sidebarSource.includes('placeholder="컴포넌트 검색"'),
  'Component sidebar should render a search input above Introduction and filter menu samples'
)
assert(
  sidebarSource.includes('AnimatePresence') &&
    sidebarSource.includes('layoutId="component-sidebar-active-indicator"') &&
    sidebarSource.includes('layoutDependency={pathname}') &&
    sidebarSource.includes('transform-gpu') &&
    sidebarSource.includes('backdrop-blur') &&
    sidebarSource.includes('willChange:') &&
    sidebarSource.includes('contain:') &&
    sidebarSource.includes('translateZ(0)'),
  'Component sidebar should keep the search input visually stable and animate the active menu box with a shared layout indicator'
)
const sampleDescriptionMatches = [
  ...dataSource.matchAll(
    /createSample\(\{[\s\S]*?slug: '([^']+)'[\s\S]*?description:\s*'([^']+)'/g
  ),
]
assert(
  sampleDescriptionMatches.length === requiredNames.length,
  'Every component sample should expose one detail-page description'
)
for (const [, sampleSlug, sampleDescription] of sampleDescriptionMatches) {
  assert(
    /[가-힣]/.test(sampleDescription) &&
      !/^(A|An|The)\s/.test(sampleDescription),
    `Component sample description should be Korean: ${sampleSlug} - ${sampleDescription}`
  )
}
const referenceSectionIndex = docsSource.indexOf('id="reference"')
const propsSectionIndex = docsSource.indexOf('id="props"')
const headerBeforePreviewSource = docsSource.slice(
  0,
  docsSource.indexOf('<ComponentExampleTabs sample={sample} />')
)
assert(
  referenceSectionIndex > propsSectionIndex &&
    !headerBeforePreviewSource.includes('Reference:'),
  'Component Reference link should move from the header to the bottom of the page'
)
assert(
  !previewsSource.includes('subtitle="//'),
  'Component preview subtitles should not render code-comment slashes'
)
assert(
  sidebarSource.includes("'use client'") &&
    sidebarSource.includes('usePathname') &&
    sidebarSource.includes('aria-current') &&
    sidebarSource.includes('isActive'),
  'Component sidebar should mark the current page with pathname-based active state'
)
assert(
  sidebarSource.includes('space-y-7 px-1 pb-24 pt-1') &&
    sidebarSource.includes('border border-transparent') &&
    sidebarSource.includes('border-zinc-200') &&
    !sidebarSource.includes('ring-1'),
  'Component sidebar active state should have padded, non-clipped inner borders'
)
assert(
  sidebarSource.includes('lg:h-full') &&
    sidebarSource.includes('lg:overflow-y-auto') &&
    sidebarSource.includes('lg:overscroll-contain') &&
    sidebarSource.includes('lg:scroll-pb-24') &&
    sidebarSource.includes('data-lenis-prevent-wheel'),
  'Component sidebar should be an independent desktop scroll container that bypasses Lenis wheel smoothing'
)
assert(
  layoutSource.includes('lg:fixed') &&
    layoutSource.includes('lg:top-[6.25rem]') &&
    layoutSource.includes('lg:bottom-0') &&
    layoutSource.includes('lg:h-full') &&
    layoutSource.includes('components-scroll-shell') &&
    layoutSource.includes('components-shell-grid') &&
    layoutSource.includes('components-content-scroll') &&
    layoutSource.includes('lg:overflow-hidden') &&
    layoutSource.includes('lg:overflow-y-auto') &&
    layoutSource.includes('lg:overscroll-contain') &&
    layoutSource.includes('data-lenis-prevent-wheel'),
  'Components layout should use a fixed desktop app shell with independent scroll containers and no page-level wheel capture'
)
assert(
  globalsSource.includes('.components-shell-grid') &&
    globalsSource.includes('.components-content-scroll') &&
    globalsSource.includes('minmax(0, 1fr)') &&
    globalsSource.includes('grid-column: 4'),
  'Components desktop content scroller should extend to the viewport right edge'
)
assert(
  globalsSource.includes('html:has(.components-scroll-shell)') &&
    globalsSource.includes('overflow-y: hidden'),
  'Components desktop app shell should disable page-level html scrolling'
)
assert(
  !previewsSource.includes('MagicCard') &&
    !previewsSource.includes('MagicCardPreview') &&
    !previewsSource.includes("case 'magic-card'") &&
    !previewsSource.includes('TextAnimate') &&
    !previewsSource.includes('AnimatedShinyText') &&
    !previewsSource.includes('AnimatedGradientText') &&
    !previewsSource.includes("case 'text-animate'") &&
    !previewsSource.includes("case 'animated-shiny-text'") &&
    !previewsSource.includes("case 'animated-gradient-text'"),
  'Component previews should not include removed Magic UI components'
)
for (const requiredPreviewPart of [
  'OuterEffectSurface',
  'MeteorsPreview',
  'ConfettiPreview',
  'ParticlesPreview',
  'VideoTextPreview',
  'HighlighterPreview',
  'bg-background',
  'glassButtonClassName',
]) {
  assert(
    previewsSource.includes(requiredPreviewPart),
    `Component previews missing light outer surface part: ${requiredPreviewPart}`
  )
}
assert(
  previewsSource.includes('action="underline"') &&
    previewsSource.includes('action="highlight"') &&
    previewsSource.includes('color="#87CEFA"') &&
    previewsSource.includes('animationDuration={900}'),
  'Highlighter preview should exercise Magic UI highlighter props with visible animation colors'
)
assert(
  !sidebarSource.includes('Getting Started') &&
    sidebarSource.includes('Introduction') &&
    sidebarSource.includes('isIntroActive') &&
    sidebarSource.includes('href="/components"'),
  'Component sidebar should render Introduction as the first navigation item'
)
assert(
  installTabsSource.includes('rounded-xl bg-zinc-100 p-1') &&
    installTabsSource.includes('rounded-lg bg-white shadow-sm') &&
    !installTabsSource.includes('bottom-0 h-0.5'),
  'Install tabs should use a moving rounded background indicator instead of an underline'
)
assert(
  !previewsSource.includes('TextPreviewFont') &&
    !previewsSource.includes('textPreviewFontStyle') &&
    !previewsSource.includes('fontFamily="Hancom MalangMalang"') &&
    previewsSource.includes('useUserFontFamily') &&
    previewsSource.includes('fontFamily={userFontFamily}'),
  'Text previews should inherit the selected blog font, including VideoText mask font'
)
assert(
  videoTextSource.includes('escapeSvgAttribute') &&
    videoTextSource.includes('escapeSvgText') &&
    videoTextSource.includes('font-family="${escapeSvgAttribute(fontFamily)}"') &&
    videoTextSource.includes('${escapeSvgText(content)}'),
  'VideoText should escape SVG text and font-family values before building the mask'
)
for (const logoMotionPart of [
  "'dia-text-reveal'",
  "'highlighter'",
  "label: 'Dia Text Reveal'",
  "label: 'Highlighter'",
]) {
  assert(
    logoMotionsSource.includes(logoMotionPart),
    `Logo motion option missing: ${logoMotionPart}`
  )
}
assert(
  brandLogoSource.includes('DiaTextReveal') &&
    brandLogoSource.includes('Highlighter') &&
    brandLogoSource.includes("motion === 'dia-text-reveal'") &&
    brandLogoSource.includes("motion === 'highlighter'") &&
    brandLogoSource.includes('finalTextColor="currentColor"') &&
    brandLogoSource.includes("type LogoHighlighterPhase = 'highlight' | 'underline'") &&
    brandLogoSource.includes("setPhase((currentPhase) =>") &&
    brandLogoSource.includes("currentPhase === 'highlight' ? 'underline' : 'highlight'") &&
    brandLogoSource.includes("action={isHighlight ? 'highlight' : 'underline'}") &&
    brandLogoSource.includes('data-logo-highlighter-phase={phase}') &&
    brandLogoSource.includes("data-logo-highlighter-visible={visible ? 'true' : 'false'}") &&
    brandLogoSource.includes('visible ?') &&
    brandLogoSource.includes('LogoHighlighterAnnotation') &&
    !brandLogoSource.includes('repeatDelay={2600}'),
  'Brand logo should keep Dia Text Reveal text visible and sequence Highlighter phases'
)
assert(
  globalsSource.includes('.brand-link') &&
    globalsSource.includes('overflow: visible') &&
    globalsSource.includes('text-overflow: clip') &&
    globalsSource.includes('line-height: 1.35') &&
    globalsSource.includes('padding-block: 0.16em') &&
    globalsSource.includes('margin-block: -0.16em'),
  'Brand logo link should leave vertical room for descenders and annotation strokes'
)
assert(
  globalsSource.includes('brand-logo-jump 2.05s') &&
    globalsSource.includes('var(--brand-char-index, 0) * 56ms') &&
    globalsSource.includes('brand-logo-wave 1.85s') &&
    globalsSource.includes('var(--brand-char-index, 0) * 52ms'),
  'Brand logo jump and wave timing should use a faster ordered stagger'
)
assert(
  brandLogoSource.includes('brand-logo-highlight-frame') &&
    brandLogoSource.includes('relative z-10') &&
    brandLogoSource.includes('z-0') &&
    brandLogoSource.includes('brand-logo-highlighter-target') &&
    brandLogoSource.includes("width: 'calc(100% + 0.5em)'") &&
    brandLogoSource.includes("transform: 'translateY(0.5em)'") &&
    brandLogoSource.includes('[&>span]:w-full') &&
    brandLogoSource.includes('absolute inset-x-0 -inset-y-1') &&
    brandLogoSource.includes('trailSize={28}') &&
    brandLogoSource.includes('iterations={2}') &&
    brandLogoSource.includes('padding={isHighlight ? 4 : 3}'),
  'Brand logo Dia and Highlighter variants should leave enough visual trail, stroke room, and text clarity'
)
assert(
  diaTextRevealSource.includes('trailSize?: number') &&
    diaTextRevealSource.includes('const DEFAULT_TRAIL_SIZE = 17') &&
    diaTextRevealSource.includes('function buildGradient(') &&
    diaTextRevealSource.includes('optsRef.current.trailSize') &&
    diaTextRevealSource.includes('100 + trailSize'),
  'Dia Text Reveal should support a scoped trail size without changing the default'
)
assert(
  !previewFunctionSource('FolderPreview').includes('useThemeColor') &&
    !previewFunctionSource('CounterPreview').includes('useThemeColor') &&
    !previewFunctionSource('ParticlesPreview').includes('useThemeColor') &&
    !previewFunctionSource('AuroraTextPreview').includes('themeGradientColors') &&
    !previewFunctionSource('CurvedLoopPreview').includes('theme-accent-current') &&
    !previewsSource.includes('const originalAccentButtonStyle'),
  'Component previews should avoid applying the blog theme color to previewed components'
)
assert(
  previewsSource.includes('pointer-events-none flex flex-col') &&
    previewsSource.includes('relative flex h-36') &&
    previewsSource.includes('<Pointer>'),
  'Pointer preview should bind each cursor to the visible bordered tile'
)
assert(
  !previewsSource.includes('Backlight') &&
    !dataSource.includes("slug: 'backlight'") &&
    !fs.existsSync(path.join(root, 'public/r/backlight.json')),
  'Backlight should be fully removed from previews, data, and registry output'
)
assert(
  dataSource.includes('https://reactbits.dev${path}'),
  'ReactBits references should be generated from the reactbits.dev base URL'
)
for (const referencePath of [
  "stack: '/components/stack'",
  "counter: '/components/counter?value=17.8'",
]) {
  assert(
    dataSource.includes(referencePath),
    `ReactBits reference path missing or stale: ${referencePath}`
  )
}
assert(
  previewsSource.includes('cards={stackCards}') &&
    previewsSource.includes('aria-label="Increase counter value"') &&
    previewsSource.includes('aria-label="Decrease counter value"'),
  'Component previews should include fixed Stack cards and Counter controls'
)
assert(
  dataSource.includes('Decrease') &&
    dataSource.includes('Number((current - 1).toFixed(1))') &&
    dataSource.includes('type="button"'),
  'Counter usage snippet should include explicit increment and decrement buttons'
)
assert(
  shinyButtonSource.includes('items-center justify-center') &&
    shinyButtonSource.includes('text-current') &&
    !shinyButtonSource.includes('hover:shadow'),
  'Shiny Button should keep centered readable text without hover shadow effects'
)
assert(
  carouselSource.includes("variant = 'light'") &&
    carouselSource.includes("variant === 'dark'") &&
    carouselSource.includes('bg-white/[0.06]') &&
    carouselSource.includes('border-white/10'),
  'Carousel should expose a dark variant for preview surfaces while keeping the default light variant'
)
assert(
  carouselSource.includes('focus-visible:outline-zinc-500 dark:focus-visible:outline-white'),
  'Carousel pagination dots should have visible focus outlines in light and dark mode'
)
assert(
  folderSource.includes("paperVariant?: 'paper' | 'glass'") &&
    folderSource.includes('color-mix(in srgb, ${hex}') &&
    folderSource.includes("return 'translate(-50%, -100%) rotate(5deg)'") &&
    folderSource.includes("background: isGlassPaper") &&
    folderSource.includes("backdropFilter: isGlassPaper ? 'blur(12px)'") &&
    previewsSource.includes('const folderPreviewColor') &&
    previewsSource.includes('color-mix(in srgb, var(--theme-accent-current) 64%, #f8fafc)') &&
    previewFunctionSource('FolderPreview').includes('color={folderPreviewColor}') &&
    previewFunctionSource('FolderPreview').includes('paperVariant="glass"'),
  'Folder preview should use a visible current-theme folder color with glass document cards'
)
assert(
  elasticSliderSource.includes('bg-sky-400') &&
    elasticSliderSource.includes('bg-white/[0.12]'),
  'Elastic Slider should use a fixed sky progress color and glass track'
)
assert(
  !stackSource.includes('Math.random()') &&
    stackSource.includes('getDeterministicRotation'),
  'Stack random rotation should be deterministic to avoid hydration mismatch'
)
assert(
  meteorsSource.includes('[animation-fill-mode:backwards]'),
  'Meteors should preserve the initial rotated keyframe during animation delay'
)
assert(
  !meteorsSource.includes('window.innerWidth') &&
    !meteorsSource.includes('typeof window') &&
    meteorsSource.includes('left: `${leftPercent}%`') &&
    meteorsSource.includes('function formatSeconds') &&
    meteorsSource.includes('value.toFixed(3)') &&
    meteorsSource.includes('animationDelay: formatSeconds('),
  'Meteors should use deterministic percentage positions and rounded delays to avoid SSR/client hydration mismatches'
)
assert(
  highlighterSource.includes('getScrollTargets') &&
    highlighterSource.includes('addEventListener("scroll"') &&
    highlighterSource.includes('removeEventListener') &&
    highlighterSource.includes('"scroll"'),
  'Highlighter should refresh rough-notation positions inside scroll containers'
)
assert(
  layoutSource.includes('@/features/component-library/component-sidebar'),
  'Components layout should import the client sidebar entrypoint'
)

console.log('Magic UI component registry assertions passed')
