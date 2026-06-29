/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const outDir = path.join(root, 'public/r')

const ignoredPackageDependencies = new Set(['next', 'react', 'react-dom'])

function getRegistryFileType(filePath) {
  if (filePath.startsWith('src/lib/')) return 'registry:lib'
  return 'registry:ui'
}

function getPackageName(importSpecifier) {
  if (importSpecifier.startsWith('@')) {
    return importSpecifier.split('/').slice(0, 2).join('/')
  }

  return importSpecifier.split('/')[0]
}

function getImportSpecifiers(source) {
  return [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(
    (match) => match[1]
  )
}

function resolveLocalImport(importSpecifier, importerPath) {
  if (importSpecifier === '@/lib/utils') {
    return 'src/lib/utils.ts'
  }

  if (importSpecifier.startsWith('@/components/ui/')) {
    return `${importSpecifier.replace('@/', 'src/')}.tsx`
  }

  if (importSpecifier.startsWith('./') || importSpecifier.startsWith('../')) {
    return `${path
      .posix
      .normalize(path.posix.join(path.posix.dirname(importerPath), importSpecifier))}.tsx`
  }

  return null
}

function collectRegistryFiles(entryPath, visited = new Set()) {
  if (visited.has(entryPath)) return []

  visited.add(entryPath)

  const absolutePath = path.join(root, entryPath)
  const content = fs.readFileSync(absolutePath, 'utf8')
  const files = [
    {
      path: entryPath,
      content,
      type: getRegistryFileType(entryPath),
    },
  ]

  for (const importSpecifier of getImportSpecifiers(content)) {
    const localPath = resolveLocalImport(importSpecifier, entryPath)

    if (!localPath) continue

    files.push(...collectRegistryFiles(localPath, visited))
  }

  return files
}

function collectDependencies(files, explicitDependencies) {
  const dependencies = new Set(explicitDependencies)

  for (const file of files) {
    for (const importSpecifier of getImportSpecifiers(file.content)) {
      const isLocal =
        importSpecifier.startsWith('@/') ||
        importSpecifier.startsWith('./') ||
        importSpecifier.startsWith('../')

      if (isLocal) continue

      const packageName = getPackageName(importSpecifier)

      if (!ignoredPackageDependencies.has(packageName)) {
        dependencies.add(packageName)
      }
    }
  }

  return [...dependencies].sort()
}

const items = [
  {
    name: 'ripple-button',
    title: 'Click Ripple Button',
    description: 'A button that emits a click ripple from the pointer position.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-rippling': 'rippling var(--duration) ease-out',
      },
    },
    css: {
      '@keyframes rippling': {
        '0%': { opacity: '1' },
        '100%': {
          transform: 'scale(2)',
          opacity: '0',
        },
      },
    },
  },
  {
    name: 'shiny-button',
    title: 'Shine Button',
    description: 'A button with a looping masked shine and spring tap feedback.',
    dependencies: ['motion'],
  },
  {
    name: 'marquee',
    title: 'Continuous Marquee',
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
    title: 'Rotating Icon Cloud',
    description: 'An interactive 3D tag cloud component.',
    dependencies: [],
  },
  {
    name: 'lens',
    title: 'Magnifier Lens',
    description:
      'An interactive component that enables zooming into images, videos, and other elements.',
    dependencies: ['motion'],
  },
  {
    name: 'pointer',
    title: 'Hover Pointer',
    description: 'A component that displays a pointer when hovering over an element.',
    dependencies: ['motion'],
  },
  {
    name: 'file-tree',
    title: 'Collapsible File Tree',
    description: 'A nested file tree with selectable files, folders, and collapse controls.',
    dependencies: ['@radix-ui/react-accordion', 'lucide-react'],
    cssVars: {
      theme: {
        'animate-accordion-down':
          'accordion-down 0.2s ease-out',
        'animate-accordion-up':
          'accordion-up 0.2s ease-out',
      },
    },
    css: {
      '@keyframes accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      '@keyframes accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
  },
  {
    name: 'animated-circular-progress-bar',
    title: 'Circular Progress Meter',
    description: 'A circular gauge that animates between values with primary and secondary arcs.',
    dependencies: [],
  },
  {
    name: 'curved-loop',
    title: 'Curved Text Marquee',
    description: 'A draggable SVG text marquee that loops along a curved path.',
    dependencies: [],
  },
  {
    name: 'click-spark',
    title: 'Click Spark Burst',
    description: 'A canvas overlay that emits radial sparks from every click.',
    dependencies: [],
  },
  {
    name: 'magnet',
    title: 'Magnetic Hover',
    description: 'A hover target that pulls its child toward the pointer.',
    dependencies: [],
  },
  {
    name: 'stack',
    title: 'Swipe Card Stack',
    description: 'A draggable card stack that sends swiped cards to the back.',
    dependencies: ['motion'],
  },
  {
    name: 'folder',
    title: 'Expandable Folder',
    description: 'A clickable folder illustration that opens layered paper cards.',
    dependencies: [],
  },

  {
    name: 'carousel',
    title: 'Card Carousel',
    description: 'A draggable, optionally autoplaying 3D card carousel.',
    dependencies: ['motion', 'react-icons'],
  },

  {
    name: 'elastic-slider',
    title: 'Spring Slider',
    description: 'A slider with elastic overflow and springy thumb movement.',
    dependencies: ['motion'],
  },
  {
    name: 'counter',
    title: 'Rolling Number Counter',
    description: 'An animated rolling number counter with decimal place support.',
    dependencies: ['motion'],
  },

  {
    name: 'meteors',
    title: 'Meteor Background',
    description: 'A meteor shower effect.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-meteor': 'meteor 5s linear infinite',
      },
    },
    css: {
      '@keyframes meteor': {
        '0%': {
          transform: 'rotate(var(--angle)) translateX(0)',
          opacity: '1',
        },
        '70%': { opacity: '1' },
        '100%': {
          transform: 'rotate(var(--angle)) translateX(-500px)',
          opacity: '0',
        },
      },
    },
  },
  {
    name: 'confetti',
    title: 'Confetti Button',
    description:
      'Confetti animations are best used to delight your users when something special happens.',
    dependencies: ['canvas-confetti', '@types/canvas-confetti'],
  },
  {
    name: 'particles',
    title: 'Particle Background',
    description:
      'Particles add visual flair with depth, movement, and interactivity.',
    dependencies: [],
  },
  {
    name: 'typing-animation',
    title: 'Typewriter Text',
    description: 'Characters appearing in typed animation.',
    dependencies: ['motion'],
    cssVars: {
      theme: {
        'animate-blink-cursor': 'blink-cursor 1.2s step-end infinite',
      },
    },
    css: {
      '@keyframes blink-cursor': {
        '0%, 49%': { opacity: '1' },
        '50%, 100%': { opacity: '0' },
      },
    },
  },
  {
    name: 'aurora-text',
    title: 'Gradient Text',
    description: 'A beautiful aurora text effect.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-aurora': 'aurora 8s ease-in-out infinite alternate',
      },
    },
    css: {
      '@keyframes aurora': {
        '0%': {
          'background-position': '0% 50%',
          transform: 'rotate(-5deg) scale(0.9)',
        },
        '25%': {
          'background-position': '50% 100%',
          transform: 'rotate(5deg) scale(1.1)',
        },
        '50%': {
          'background-position': '100% 50%',
          transform: 'rotate(-3deg) scale(0.95)',
        },
        '75%': {
          'background-position': '50% 0%',
          transform: 'rotate(3deg) scale(1.05)',
        },
        '100%': {
          'background-position': '0% 50%',
          transform: 'rotate(-5deg) scale(0.9)',
        },
      },
    },
  },
  {
    name: 'video-text',
    title: 'Video Mask Text',
    description: 'A component that displays text with a video playing in the background.',
    dependencies: [],
  },
  {
    name: 'number-ticker',
    title: 'Animated Number',
    description: 'Animate numbers to count up or down to a target number.',
    dependencies: ['motion'],
  },
  {
    name: 'dia-text-reveal',
    title: 'Color Sweep Text',
    description:
      'A horizontal color band sweeps across text, revealing a gradient shine before settling on the base color.',
    dependencies: ['motion'],
  },
  {
    name: 'morphing-text',
    title: 'Morphing Word',
    description: 'A dynamic text morphing component.',
    dependencies: [],
  },
  {
    name: 'highlighter',
    title: 'Marker Highlight',
    description:
      'A text highlighter that mimics the effect of a human-drawn marker stroke.',
    dependencies: ['motion', 'rough-notation'],
  },
  {
    name: 'background-boxes',
    title: 'Hover Grid Background',
    description: 'A hover-reactive grid background for hero and feature surfaces.',
    dependencies: ['motion'],
  },
  {
    name: 'keyboard',
    title: 'Interactive Keyboard',
    description: 'A Mac-style keyboard with clickable and physical key states.',
    dependencies: ['motion'],
  },
  {
    name: 'placeholders-and-vanish-input',
    title: 'Rotating Search Input',
    description: 'A search input with rotating placeholders and vanish submit motion.',
    dependencies: ['motion'],
  },

  {
    name: '3d-marquee',
    title: 'Perspective Image Marquee',
    description: 'A perspective marquee grid for image or card strips.',
    dependencies: ['motion'],
  },
  {
    name: 'avatar-group',
    title: 'Hover Avatar Group',
    description: 'A stacked avatar group with overflow count.',
    dependencies: ['motion'],
  },

  {
    name: 'playful-todolist',
    title: 'Animated Task List',
    description: 'A small animated todo list interaction.',
    dependencies: ['motion'],
  },
  {
    name: 'flower-menu',
    title: 'Radial Action Menu',
    description: 'A radial floating action menu.',
    dependencies: [],
  },

  {
    name: 'text-flip',
    title: 'Rotating Word Flip',
    description: 'A rotating word flip animation.',
    dependencies: ['motion'],
  },
  {
    name: 'toggle-theme',
    title: 'Theme Toggle',
    description: 'A minimal switch-style theme toggle.',
    dependencies: ['lucide-react', 'next-themes'],
  },
  {
    name: '3d-image-carousel',
    title: 'Depth Image Carousel',
    description: 'A rotating perspective image carousel.',
    dependencies: ['lucide-react'],
  },
  {
    name: 'sparkle-cursor',
    title: 'Sparkle Cursor Trail',
    description: 'A local cursor sparkle effect for a bounded surface.',
    dependencies: ['gsap'],
  },
  {
    name: 'mouse-invert-cursor',
    title: 'Invert Cursor',
    description: 'A scoped mix-blend-mode cursor adapted from mouse-animations Invert.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'mouse-trail-cursor',
    title: 'Dot Cursor Trail',
    description: 'A bounded canvas dot trail adapted from mouse-animations Trail.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'mouse-ripple-cursor',
    title: 'Click Ripple Cursor',
    description: 'A click ripple adapted from mouse-animations Ripple.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'mouse-custom-cursor',
    title: 'Ring Cursor',
    description: 'A scoped dot and lagging ring adapted from mouse-animations CustomCursor.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'fairy-dust-cursor',
    title: 'Star Particle Cursor',
    description: 'A scoped star-dust trail adapted from tholman cursor-effects Fairy Dust.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'bubble-cursor',
    title: 'Bubble Cursor Trail',
    description: 'A scoped bubble particle cursor adapted from tholman cursor-effects Bubbles.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'character-cursor',
    title: 'Character Particle Cursor',
    description: 'A scoped character particle cursor adapted from tholman cursor-effects Character.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'canvas-cursor',
    title: 'Spring Line Cursor',
    description: 'A scoped spring-line canvas trail adapted from Cursify Canvas Cursor.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'data-table',
    title: 'Typed Data Table',
    description: 'A simple typed data table inspired by HeroUI table structure.',
    dependencies: [],
  },
  {
    name: 'physics-number-picker',
    title: 'Physics Number Picker',
    description: 'A numeric wheel picker with momentum scrolling and snap physics.',
    dependencies: [],
  },
]

fs.mkdirSync(outDir, { recursive: true })

for (const file of fs.readdirSync(outDir)) {
  if (file.endsWith('.json')) {
    fs.rmSync(path.join(outDir, file))
  }
}

for (const item of items) {
  const files = collectRegistryFiles(`src/components/${item.name}.tsx`)
  const dependencies = collectDependencies(files, item.dependencies)
  const registryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: 'registry:ui',
    title: item.title,
    description: item.description,
    dependencies,
    files,
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    ...(item.css ? { css: item.css } : {}),
  }

  fs.writeFileSync(
    path.join(outDir, `${item.name}.json`),
    `${JSON.stringify(registryItem, null, 2)}\n`
  )
}

console.log(`Generated ${items.length} component registry items`)
