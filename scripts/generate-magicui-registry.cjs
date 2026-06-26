/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const outDir = path.join(root, 'public/r')

const items = [
  {
    name: 'marquee',
    title: 'Marquee',
    description:
      'An infinite scrolling component that can be used to display text, images, or videos.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-marquee': 'marquee var(--duration) infinite linear',
        'animate-marquee-vertical':
          'marquee-vertical var(--duration) linear infinite',
      },
    },
    css: {
      '@keyframes marquee': {
        from: {
          transform: 'translateX(0)',
        },
        to: {
          transform: 'translateX(calc(-100% - var(--gap)))',
        },
      },
      '@keyframes marquee-vertical': {
        from: {
          transform: 'translateY(0)',
        },
        to: {
          transform: 'translateY(calc(-100% - var(--gap)))',
        },
      },
    },
  },
  {
    name: 'icon-cloud',
    title: 'Icon Cloud',
    description: 'An interactive 3D tag cloud component.',
    dependencies: [],
  },
  {
    name: 'lens',
    title: 'Lens',
    description:
      'An interactive component that enables zooming into images, videos, and other elements.',
    dependencies: ['motion'],
  },
  {
    name: 'pointer',
    title: 'Pointer',
    description: 'A component that displays a pointer when hovering over an element.',
    dependencies: ['motion'],
  },
]

fs.mkdirSync(outDir, { recursive: true })

for (const item of items) {
  const sourcePath = path.join(root, `src/components/magicui/${item.name}.tsx`)
  const content = fs.readFileSync(sourcePath, 'utf8')
  const registryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: 'registry:ui',
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    files: [
      {
        path: `src/components/magicui/${item.name}.tsx`,
        content,
        type: 'registry:ui',
      },
    ],
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    ...(item.css ? { css: item.css } : {}),
  }

  fs.writeFileSync(
    path.join(outDir, `${item.name}.json`),
    `${JSON.stringify(registryItem, null, 2)}\n`
  )
}

console.log(`Generated ${items.length} Magic UI registry items`)
