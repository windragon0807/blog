/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const requiredNames = ['marquee', 'icon-cloud', 'lens', 'pointer']
const removedNames = [
  'action-button',
  'glass-surface',
  'component-nav',
  'status-notice',
  'gradient-heading',
  'border-beam',
]
const removedCategories = [
  'core',
  'surfaces',
  'navigation',
  'feedback',
  'typography',
  'effects',
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
const sidebarPath = path.join(
  root,
  'src/features/component-library/component-sidebar.tsx'
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

assert(
  dataSource.includes("id: 'components'") &&
    dataSource.includes("name: 'Components'"),
  'Missing Components category in component-data.ts'
)

for (const category of removedCategories) {
  assert(
    !dataSource.includes(`id: '${category}'`),
    `Removed category still exists: ${category}`
  )
}

for (const name of removedNames) {
  assert(
    !dataSource.includes(`slug: '${name}'`),
    `Removed sample still exists: ${name}`
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
      registry.files[0].content.includes(`export function`),
    `${name} registry item should include component source`
  )
}

for (const name of ['lens', 'pointer']) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(root, `public/r/${name}.json`), 'utf8')
  )
  assert(
    Array.isArray(registry.dependencies) &&
      registry.dependencies.includes('motion'),
    `${name} registry item should include motion dependency`
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
  !docsSource.includes('sample.registry.url') &&
    !docsSource.includes('sample.registry.dependencies'),
  'Component detail page should not render registry URL or dependency chips'
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
  sidebarSource.includes('space-y-7 px-1 py-1') &&
    sidebarSource.includes('border border-transparent') &&
    sidebarSource.includes('border-zinc-200') &&
    !sidebarSource.includes('ring-1'),
  'Component sidebar active state should have padded, non-clipped inner borders'
)
assert(
  !sidebarSource.includes('Getting Started') &&
    !sidebarSource.includes('Introduction') &&
    !sidebarSource.includes('isIntroActive') &&
    !sidebarSource.includes('href="/components"'),
  'Component sidebar should not render the Introduction section'
)
assert(
  layoutSource.includes('@/features/component-library/component-sidebar'),
  'Components layout should import the client sidebar entrypoint'
)

console.log('Magic UI component registry assertions passed')
