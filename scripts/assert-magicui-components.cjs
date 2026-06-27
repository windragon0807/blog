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
  'shine-border',
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
  'slide-arrow-button',
  'flower-menu',
  'text-flip',
  'toggle-theme',
  '3d-image-carousel',
  'sparkle-cursor',
  'data-table',
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
  'shine-border',
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
const dataSource = fs.readFileSync(dataPath, 'utf8')
const docsSource = fs.readFileSync(docsPath, 'utf8')
const componentsPageSource = fs.readFileSync(componentsPagePath, 'utf8')
const layoutSource = fs.readFileSync(layoutPath, 'utf8')
const globalsSource = fs.readFileSync(globalsPath, 'utf8')
const previewsSource = fs.readFileSync(previewsPath, 'utf8')

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
    Array.isArray(registry.files) && registry.files.length === 1,
    `${name} registry item should expose one source file`
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
    exampleTabsSource.includes('flushPreview') &&
    exampleTabsSource.includes("sample.preview.kind === 'shine-border'") &&
    exampleTabsSource.includes("sample.preview.kind === 'meteors'") &&
    exampleTabsSource.includes("sample.preview.kind === 'particles'") &&
    exampleTabsSource.includes("sample.preview.kind === 'video-text'"),
  'Effect previews should render flush against the outer preview border'
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
  docsSource.includes('sample.reference.url') &&
    docsSource.includes('sample.reference.label') &&
    !docsSource.includes('sample.registry.dependencies'),
  'Component detail page should render reference links without dependency chips'
)
assert(
  fs.existsSync(sidebarPath),
  `Missing active sidebar file: ${sidebarPath}`
)
const sidebarSource = fs.readFileSync(sidebarPath, 'utf8')
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
  'TextPreviewFont',
  'bg-background',
  'theme-accent-current',
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
  previewsSource.includes('Hancom MalangMalang') &&
    previewsSource.includes('TextPreviewFont') &&
    previewsSource.includes('fontFamily="Hancom MalangMalang"'),
  'Text previews should use Hancom MalangMalang, including VideoText mask font'
)
assert(
  previewsSource.includes('themeGradientColors') &&
    previewsSource.includes('useThemeColor') &&
    previewsSource.includes('var(--theme-accent-current)'),
  'Component previews should use the selected blog theme colors'
)
assert(
  previewsSource.includes('pointer-events-none flex flex-col') &&
    previewsSource.includes('relative flex h-48') &&
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
  carouselSource.includes('border border-zinc-200 bg-white') &&
    carouselSource.includes('text-zinc-500 dark:text-zinc-400') &&
    !carouselSource.includes("border border-[#222]"),
  'Carousel should use light-mode gray borders and text instead of black cards'
)
assert(
  carouselSource.includes('focus-visible:outline-zinc-500 dark:focus-visible:outline-white'),
  'Carousel pagination dots should have visible focus outlines in light and dark mode'
)
assert(
  folderSource.includes("border: '1px solid rgba(148, 163, 184, 0.55)'") &&
    folderSource.includes('boxShadow: open'),
  'Folder papers should be distinguishable when expanded'
)
assert(
  elasticSliderSource.includes('bg-[var(--theme-accent-current)]') &&
    elasticSliderSource.includes('bg-zinc-200 dark:bg-zinc-800'),
  'Elastic Slider should use theme progress color and a light gray track'
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
