/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const packageJsonPath = path.join(root, 'package.json')
const removedSearchInputName = ['goo' + 'ey', 'input'].join('-')
const removedSearchInputComponent = ['Goo' + 'ey', 'Input'].join('')
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
  "id: 'controls-inputs'",
  "name: 'Controls & Inputs'",
  "id: 'menus-actions'",
  "name: 'Menus & Actions'",
  "id: 'content-display'",
  "name: 'Content Display'",
  "id: 'data-status'",
  "name: 'Data & Status'",
  "id: 'text-effects'",
  "name: 'Text Effects'",
  "id: 'background-atmosphere'",
  "name: 'Background & Atmosphere'",
  "id: 'cursor-interaction-effects'",
  "name: 'Cursor & Interaction Effects'",
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
  removedSearchInputName,
]
const removedCategories = [
  'actions-controls',
  'content-media',
  'data-structure',
  'text-typography',
  'effects-backgrounds',
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
const headerPath = path.join(root, 'src/components/Header.tsx')
const headerIconsPath = path.join(root, 'src/components/icons/header-icons.tsx')
const themeSettingsMenuPath = path.join(root, 'src/components/ThemeSettingsMenu.tsx')
const rootLayoutPath = path.join(root, 'src/app/layout.tsx')
const seoPath = path.join(root, 'src/lib/seo.ts')
const homePagePath = path.join(root, 'src/app/(tabs)/page.tsx')
const componentDetailPagePath = path.join(root, 'src/app/components/[slug]/page.tsx')
const portfolioPagePath = path.join(root, 'src/app/portfolio/page.tsx')
const resumePagePath = path.join(root, 'src/app/resume/page.tsx')
const postDetailPagePath = path.join(root, 'src/app/posts/[slug]/page.tsx')
const tagPagePath = path.join(root, 'src/app/tags/[tag]/page.tsx')
const seriesPagePath = path.join(root, 'src/app/series/[series]/page.tsx')
const lightboxImagePath = path.join(root, 'src/components/notion/LightboxImage.tsx')
const blockRenderersPath = path.join(root, 'src/components/notion/block-renderers.tsx')
const videoTextPath = path.join(root, 'src/components/video-text.tsx')
const diaTextRevealPath = path.join(
  root,
  'src/components/dia-text-reveal.tsx'
)
const toggleThemePath = path.join(root, 'src/components/toggle-theme.tsx')
const playfulTodoListPath = path.join(
  root,
  'src/components/playful-todolist.tsx'
)
const avatarGroupPath = path.join(root, 'src/components/avatar-group.tsx')
const dataTablePath = path.join(root, 'src/components/data-table.tsx')
const fileTreePath = path.join(root, 'src/components/file-tree.tsx')
const textFlipPath = path.join(root, 'src/components/text-flip.tsx')
const cursorEffectRuntimePath = path.join(
  root,
  'src/components/cursor-effect-runtime.tsx'
)
const dataSource = fs.readFileSync(dataPath, 'utf8')
const docsSource = fs.readFileSync(docsPath, 'utf8')
const componentsPageSource = fs.readFileSync(componentsPagePath, 'utf8')
const layoutSource = fs.readFileSync(layoutPath, 'utf8')
const globalsSource = fs.readFileSync(globalsPath, 'utf8')
const sidebarSource = fs.readFileSync(sidebarPath, 'utf8')
const previewsSource = fs.readFileSync(previewsPath, 'utf8')
const headerSource = fs.readFileSync(headerPath, 'utf8')
const headerIconsSource = fs.readFileSync(headerIconsPath, 'utf8')
const themeSettingsMenuSource = fs.readFileSync(themeSettingsMenuPath, 'utf8')
const rootLayoutSource = fs.readFileSync(rootLayoutPath, 'utf8')
const seoSource = fs.readFileSync(seoPath, 'utf8')
const homePageSource = fs.readFileSync(homePagePath, 'utf8')
const componentDetailPageSource = fs.readFileSync(componentDetailPagePath, 'utf8')
const portfolioPageSource = fs.readFileSync(portfolioPagePath, 'utf8')
const resumePageSource = fs.readFileSync(resumePagePath, 'utf8')
const postDetailPageSource = fs.readFileSync(postDetailPagePath, 'utf8')
const tagPageSource = fs.readFileSync(tagPagePath, 'utf8')
const seriesPageSource = fs.readFileSync(seriesPagePath, 'utf8')
const lightboxImageSource = fs.readFileSync(lightboxImagePath, 'utf8')
const blockRenderersSource = fs.readFileSync(blockRenderersPath, 'utf8')
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

function getRegistryItem(name) {
  return JSON.parse(fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8'))
}

function getRegistryFilePaths(name) {
  return getRegistryItem(name).files.map((file) => file.path)
}

function getLocalImportSpecifiers(source) {
  return [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)]
    .map((match) => match[1])
    .filter(
      (specifier) =>
        specifier.startsWith('@/lib/') ||
        specifier.startsWith('@/components/ui/') ||
        specifier.startsWith('./') ||
        specifier.startsWith('../')
    )
}

function resolveComponentRegistryImport(importSpecifier, fromComponentName) {
  if (importSpecifier === '@/lib/utils') {
    return 'src/lib/utils.ts'
  }

  if (importSpecifier.startsWith('@/components/ui/')) {
    return `${importSpecifier.replace('@/', 'src/')}.tsx`
  }

  if (importSpecifier.startsWith('./') || importSpecifier.startsWith('../')) {
    return path.posix.normalize(
      path.posix.join(
        'src/components',
        fromComponentName,
        '..',
        `${importSpecifier}.tsx`
      )
    )
  }

  return null
}

const expectedComponentTitles = [
  ['background-boxes', 'Hover Grid Background'],
  ['keyboard', 'Interactive Keyboard'],
  ['placeholders-and-vanish-input', 'Rotating Search Input'],
  ['3d-marquee', 'Perspective Image Marquee'],
  ['avatar-group', 'Hover Avatar Group'],
  ['playful-todolist', 'Animated Task List'],
  ['flower-menu', 'Radial Action Menu'],
  ['text-flip', 'Rotating Word Flip'],
  ['toggle-theme', 'Theme Toggle'],
  ['3d-image-carousel', 'Depth Image Carousel'],
  ['sparkle-cursor', 'Sparkle Cursor Trail'],
  ['mouse-invert-cursor', 'Invert Cursor'],
  ['mouse-trail-cursor', 'Dot Cursor Trail'],
  ['mouse-ripple-cursor', 'Click Ripple Cursor'],
  ['mouse-custom-cursor', 'Ring Cursor'],
  ['fairy-dust-cursor', 'Star Particle Cursor'],
  ['bubble-cursor', 'Bubble Cursor Trail'],
  ['character-cursor', 'Character Particle Cursor'],
  ['canvas-cursor', 'Spring Line Cursor'],
  ['data-table', 'Typed Data Table'],
  ['ripple-button', 'Click Ripple Button'],
  ['shiny-button', 'Shine Button'],
  ['marquee', 'Continuous Marquee'],
  ['icon-cloud', 'Rotating Icon Cloud'],
  ['lens', 'Magnifier Lens'],
  ['pointer', 'Hover Pointer'],
  ['file-tree', 'Collapsible File Tree'],
  ['animated-circular-progress-bar', 'Circular Progress Meter'],
  ['curved-loop', 'Curved Text Marquee'],
  ['click-spark', 'Click Spark Burst'],
  ['magnet', 'Magnetic Hover'],
  ['stack', 'Swipe Card Stack'],
  ['folder', 'Expandable Folder'],
  ['carousel', 'Card Carousel'],
  ['elastic-slider', 'Spring Slider'],
  ['counter', 'Rolling Number Counter'],
  ['meteors', 'Meteor Background'],
  ['confetti', 'Confetti Button'],
  ['particles', 'Particle Background'],
  ['typing-animation', 'Typewriter Text'],
  ['aurora-text', 'Gradient Text'],
  ['video-text', 'Video Mask Text'],
  ['number-ticker', 'Animated Number'],
  ['dia-text-reveal', 'Color Sweep Text'],
  ['morphing-text', 'Morphing Word'],
  ['highlighter', 'Marker Highlight'],
]

for (const [slug, title] of expectedComponentTitles) {
  const registryPath = path.join(root, `public/r/${slug}.json`)
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'))

  assert(
    dataSource.includes(`slug: '${slug}'`) &&
      dataSource.includes(`title: '${title}'`),
    `Component should use intuitive display title: ${slug} / ${title}`
  )
  assert(
    registry.title === title,
    `Component registry should use intuitive display title: ${slug} / ${title}`
  )
}

assert(
  !docsSource.includes('원본 구현과 인터랙션 흐름은') &&
    !docsSource.includes('를 기준으로 확인할 수 있습니다.'),
  'Reference section should render as a simple link, not prose'
)

assert(
  layoutSource.includes('ComponentMobileSidebarTrigger') &&
    layoutSource.includes('hidden') &&
    layoutSource.includes('lg:block') &&
    sidebarSource.includes('lg:hidden'),
  'Components layout should hide the long sidebar on mobile and expose a drawer trigger instead'
)

for (const sidebarMarker of [
  'ComponentMobileSidebarTrigger',
  'ComponentSidebarContent',
  'components-sidebar-list-scroll',
  'components-sidebar-fog-top',
  'components-sidebar-fog-bottom',
  '컴포넌트 메뉴 열기',
]) {
  assert(
    sidebarSource.includes(sidebarMarker),
    `Component sidebar missing mobile/fog marker: ${sidebarMarker}`
  )
}

assert(
  !headerSource.includes('BrandLogo') &&
    !headerSource.includes('useHeaderBrandScope') &&
    !headerSource.includes('brandLabel') &&
    !headerSource.includes('shouldShowHomeButton') &&
    headerSource.includes('aria-label="홈으로 이동"') &&
    headerSource.includes('GitHubIcon') &&
    headerSource.includes('https://github.com/windragon0807') &&
    headerSource.includes('justify-center'),
  'Header should remove the brand logo, center icon controls, and include the GitHub profile button'
)

assert(
  headerIconsSource.includes('function GitHubIcon') &&
    headerIconsSource.includes('viewBox="0 0 24 24"') &&
    headerIconsSource.includes('fill="currentColor"'),
  'Header icons should include a filled GitHub icon that matches the icon button system'
)

assert(
  !themeSettingsMenuSource.includes('LogoMotionSelect') &&
    !themeSettingsMenuSource.includes('Logo Animation'),
  'Settings menu should not expose logo animation settings after the header logo is removed'
)

assert(
  !rootLayoutSource.includes('logoMotionBootScript') &&
    !rootLayoutSource.includes('data-logo-motion') &&
    !rootLayoutSource.includes('HeaderBrandScopeProvider') &&
    !postDetailPageSource.includes('HeaderBrandScopeHydrator'),
  'Root layout and post pages should not keep logo-motion or header brand scope runtime wiring'
)

assert(
  lightboxImageSource.includes('data-lightbox-image-trigger') &&
    lightboxImageSource.includes('event.preventDefault()') &&
    lightboxImageSource.includes('event.stopPropagation()') &&
    lightboxImageSource.includes('cursor-zoom-in') &&
    lightboxImageSource.includes('lightbox-panel') &&
    lightboxImageSource.includes('DialogOverlay'),
  'Post body images should open the dimmed animated lightbox instead of falling through to download/navigation behavior'
)

assert(
  blockRenderersSource.includes('<LightboxImage') &&
    !blockRenderersSource.includes('download=') &&
    !blockRenderersSource.includes('href={src}'),
  'Notion image renderer should use LightboxImage and should not wrap images in download links'
)

for (const [sourceName, source] of [
  ['root layout', rootLayoutSource],
  ['home page', homePageSource],
  ['components page', componentsPageSource],
  ['component detail page', componentDetailPageSource],
  ['portfolio page', portfolioPageSource],
  ['resume page', resumePageSource],
  ['post detail page', postDetailPageSource],
  ['tag page', tagPageSource],
  ['series page', seriesPageSource],
]) {
  assert(
    source.includes('openGraph') || source.includes('createPageMetadata'),
    `${sourceName} should define Open Graph metadata`
  )
  assert(
    source.includes('twitter') || source.includes('createPageMetadata'),
    `${sourceName} should define Twitter metadata`
  )
  assert(
    source.includes('alternates') || source.includes('createPageMetadata'),
    `${sourceName} should define canonical metadata`
  )
}

assert(
  seoSource.includes('openGraph') &&
    seoSource.includes('twitter') &&
    seoSource.includes('canonical') &&
    seoSource.includes('SITE_DESCRIPTION') &&
    seoSource.includes('https://ryong.dev') &&
    !seoSource.includes('http://localhost:3000'),
  'Shared SEO helper should emit canonical, Open Graph, and Twitter metadata'
)

const externalPathSegment = 'magic' + 'ui'
const externalSourcePath = `src/components/${externalPathSegment}`
const removedComponentName = removedSearchInputName

assert(
  !fs.existsSync(path.join(root, externalSourcePath)),
  `External-branded component folder should be removed: ${externalSourcePath}`
)
assert(
    !fs.existsSync(path.join(root, `src/components/${removedComponentName}.tsx`)) &&
    !fs.existsSync(path.join(root, `public/r/${removedComponentName}.json`)) &&
    !dataSource.includes(`slug: '${removedComponentName}'`) &&
    !previewsSource.includes(removedSearchInputComponent),
  'Removed input should be removed from source, registry, data, and previews'
)

const localBrandMarkers = [
  `src/components/${externalPathSegment}`,
  `components/${externalPathSegment}`,
  `@/components/${externalPathSegment}`,
  `./${externalPathSegment}`,
  `components-${externalPathSegment}`,
  `name: '${externalPathSegment}'`,
  `generate-${externalPathSegment}-registry`,
  `assert-${externalPathSegment}-components`,
]
const textFilesToScan = [
  packageJsonPath,
  dataPath,
  docsPath,
  componentsPagePath,
  layoutPath,
  sidebarPath,
  previewsPath,
  path.join(root, 'scripts/generate-component-registry.cjs'),
  ...fs
    .readdirSync(path.join(root, 'public/r'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(root, 'public/r', name)),
]

for (const filePath of textFilesToScan) {
  const source = fs.readFileSync(filePath, 'utf8')
  for (const marker of localBrandMarkers) {
    assert(
      !source.includes(marker),
      `External-branded local marker still exists in ${filePath}: ${marker}`
    )
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
    !fs.existsSync(path.join(root, `src/components/${name}.tsx`)),
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

  const sourcePath = path.join(root, `src/components/${name}.tsx`)
  assert(fs.existsSync(sourcePath), `Missing source file: ${sourcePath}`)

  const registryPath = path.join(root, `public/r/${name}.json`)
  assert(fs.existsSync(registryPath), `Missing registry file: ${registryPath}`)

  const registry = getRegistryItem(name)
  const registryFilePaths = getRegistryFilePaths(name)
  assert(
    registry.$schema === 'https://ui.shadcn.com/schema/registry-item.json',
    `${name} registry item has wrong schema`
  )
  assert(registry.name === name, `${name} registry item has wrong name`)
  assert(registry.type === 'registry:ui', `${name} registry item has wrong type`)
  assert(
    Array.isArray(registry.files) && registry.files.length >= 1,
    `${name} registry item should expose source files`
  )
  assert(
    registry.files[0].path === `src/components/${name}.tsx`,
    `${name} registry file path should match local source path`
  )
  assert(
    typeof registry.files[0].content === 'string' &&
      (/export (function|const) /.test(registry.files[0].content) ||
        registry.files[0].content.includes('export {')),
    `${name} registry item should include component source`
  )

  const componentSource = fs.readFileSync(sourcePath, 'utf8')
  if (componentSource.includes('@/lib/utils')) {
    assert(
      registryFilePaths.includes('src/lib/utils.ts'),
      `${name} registry item should include utils when the component imports it`
    )
  }

  for (const importSpecifier of getLocalImportSpecifiers(componentSource)) {
    const requiredPath = resolveComponentRegistryImport(importSpecifier, name)

    if (!requiredPath) continue

    assert(
      registryFilePaths.includes(requiredPath),
      `${name} registry item should include imported local file ${requiredPath}`
    )
  }
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
      (file) => file.path === 'src/components/cursor-effect-runtime.tsx'
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
      registry.dependencies.includes('lucide-react'),
    'file-tree registry item should include tree dependencies'
  )
  assert(
    registry.files.some((file) => file.path === 'src/components/ui/button.tsx') &&
      registry.files.some((file) => file.path === 'src/lib/utils.ts'),
    'file-tree registry item should bundle local button and utils files used by its imports'
  )
  assert(
    !fileTreeSource.includes('@/components/ui/scroll-area') &&
      !registry.files.some(
        (file) => file.path === 'src/components/ui/scroll-area.tsx'
      ) &&
      !registry.dependencies.includes('overlayscrollbars') &&
      !registry.dependencies.includes('overlayscrollbars-react'),
    'file-tree registry item should not require the site-specific OverlayScrollbars runtime'
  )
  assert(
    registry.css?.['@keyframes accordion-down'] &&
      registry.css?.['@keyframes accordion-up'] &&
      registry.cssVars?.theme?.['animate-accordion-down'] &&
      registry.cssVars?.theme?.['animate-accordion-up'],
    'file-tree registry item should include accordion animation CSS'
  )
}

{
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, 'public/r/data-table.json'), 'utf8')
  )
  assert(
    !dataTableSource.includes('@/components/ui/scroll-area') &&
      !registry.files.some(
        (file) => file.path === 'src/components/ui/scroll-area.tsx'
      ) &&
      !registry.dependencies.includes('overlayscrollbars') &&
      !registry.dependencies.includes('overlayscrollbars-react'),
    'data-table registry item should use plain overflow scrolling and avoid site-specific OverlayScrollbars'
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
    registry.files.some((file) => file.path === 'src/components/ui/button.tsx') &&
      registry.files.some((file) => file.path === 'src/lib/utils.ts'),
    'confetti registry item should bundle local button and utils files used by its imports'
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
    `${name} registry item should include component CSS metadata`
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
  path.join(root, 'src/components/meteors.tsx'),
  'utf8'
)
const carouselSource = fs.readFileSync(
  path.join(root, 'src/components/carousel.tsx'),
  'utf8'
)
const folderSource = fs.readFileSync(
  path.join(root, 'src/components/folder.tsx'),
  'utf8'
)
const elasticSliderSource = fs.readFileSync(
  path.join(root, 'src/components/elastic-slider.tsx'),
  'utf8'
)
const stackSource = fs.readFileSync(
  path.join(root, 'src/components/stack.tsx'),
  'utf8'
)
const shinyButtonSource = fs.readFileSync(
  path.join(root, 'src/components/shiny-button.tsx'),
  'utf8'
)
const flowerMenuSource = fs.readFileSync(
  path.join(root, 'src/components/flower-menu.tsx'),
  'utf8'
)
const auroraTextSource = fs.readFileSync(
  path.join(root, 'src/components/aurora-text.tsx'),
  'utf8'
)
const curvedLoopSource = fs.readFileSync(
  path.join(root, 'src/components/curved-loop.tsx'),
  'utf8'
)
const clickSparkSource = fs.readFileSync(
  path.join(root, 'src/components/click-spark.tsx'),
  'utf8'
)
const particlesSource = fs.readFileSync(
  path.join(root, 'src/components/particles.tsx'),
  'utf8'
)
const placeholdersAndVanishInputSource = fs.readFileSync(
  path.join(root, 'src/components/placeholders-and-vanish-input.tsx'),
  'utf8'
)
const threeDImageCarouselSource = fs.readFileSync(
  path.join(root, 'src/components/3d-image-carousel.tsx'),
  'utf8'
)
const highlighterSource = fs.readFileSync(
  path.join(root, 'src/components/highlighter.tsx'),
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
  !fs.readFileSync(path.join(root, 'scripts/generate-component-registry.cjs'), 'utf8')
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
  path.join(root, 'scripts/generate-component-registry.cjs'),
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
    sidebarSource.includes('component-sidebar-active-indicator-${layoutScope}') &&
    sidebarSource.includes('layoutDependency={pathname}') &&
    sidebarSource.includes('bg-white px-1 pb-3 pt-1') &&
    sidebarSource.includes('dark:bg-zinc-950') &&
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
  sidebarSource.includes('space-y-7 px-1 pb-[max(6rem,env(safe-area-inset-bottom))] pt-3') &&
    sidebarSource.includes('border border-transparent') &&
    sidebarSource.includes('border-zinc-200') &&
    !sidebarSource.includes('ring-1'),
  'Component sidebar active state should have padded, non-clipped inner borders'
)
assert(
  sidebarSource.includes('components-sidebar-list-scroll') &&
    sidebarSource.includes('h-full scroll-pb-24 overflow-y-auto overscroll-contain') &&
    sidebarSource.includes('data-lenis-prevent-wheel'),
  'Component sidebar list should be an independent scroll container below the fixed search input'
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
  'Component previews should not include removed legacy components'
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
  'Highlighter preview should exercise highlighter props with visible animation colors'
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
assert(
  !fs.existsSync(path.join(root, 'src/components/BrandLogo.tsx')) &&
    !fs.existsSync(path.join(root, 'src/components/LogoMotionSelect.tsx')) &&
    !fs.existsSync(path.join(root, 'src/lib/logoMotions.ts')) &&
    !fs.existsSync(path.join(root, 'src/components/HeaderBrandScopeProvider.tsx')) &&
    !fs.existsSync(path.join(root, 'src/components/HeaderBrandScopeHydrator.tsx')) &&
    !globalsSource.includes('brand-link') &&
    !globalsSource.includes('data-logo-motion'),
  'Removed header brand logo should not leave logo runtime files or CSS behind'
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

console.log('Component library assertions passed')
