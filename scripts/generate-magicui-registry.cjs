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
  {
    name: 'border-beam',
    title: 'Border Beam',
    description:
      'An animated beam of light which travels along the border of its container.',
    dependencies: ['motion'],
  },
  {
    name: 'shine-border',
    title: 'Shine Border',
    description: 'Shine border is an animated background border effect.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-shine': 'shine var(--duration) infinite linear',
      },
    },
    css: {
      '@keyframes shine': {
        '0%': { 'background-position': '0% 0%' },
        '50%': { 'background-position': '100% 100%' },
        to: { 'background-position': '0% 0%' },
      },
    },
  },
  {
    name: 'meteors',
    title: 'Meteors',
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
    title: 'Confetti',
    description:
      'Confetti animations are best used to delight your users when something special happens.',
    dependencies: ['canvas-confetti', '@types/canvas-confetti'],
    registryDependencies: ['button'],
  },
  {
    name: 'particles',
    title: 'Particles',
    description:
      'Particles add visual flair with depth, movement, and interactivity.',
    dependencies: [],
  },
  {
    name: 'text-animate',
    title: 'Text Animate',
    description:
      'A text animation component that animates text using a variety of different animations.',
    dependencies: ['motion'],
  },
  {
    name: 'typing-animation',
    title: 'Typing Animation',
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
    title: 'Aurora Text',
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
    title: 'Video Text',
    description: 'A component that displays text with a video playing in the background.',
    dependencies: [],
  },
  {
    name: 'number-ticker',
    title: 'Number Ticker',
    description: 'Animate numbers to count up or down to a target number.',
    dependencies: ['motion'],
  },
  {
    name: 'animated-shiny-text',
    title: 'Animated Shiny Text',
    description:
      'A light glare effect which pans across text making it appear as if it is shimmering.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-shiny-text': 'shiny-text 8s infinite',
      },
    },
    css: {
      '@keyframes shiny-text': {
        '0%, 90%, 100%': {
          'background-position': 'calc(-100% - var(--shiny-width)) 0',
        },
        '30%, 60%': {
          'background-position': 'calc(100% + var(--shiny-width)) 0',
        },
      },
    },
  },
  {
    name: 'animated-gradient-text',
    title: 'Animated Gradient Text',
    description: 'An animated gradient background which transitions between colors for text.',
    dependencies: [],
    cssVars: {
      theme: {
        'animate-gradient': 'gradient 8s linear infinite',
      },
    },
    css: {
      '@keyframes gradient': {
        to: {
          'background-position': 'var(--bg-size, 300%) 0',
        },
      },
    },
  },
  {
    name: 'dia-text-reveal',
    title: 'Dia Text Reveal',
    description:
      'A horizontal color band sweeps across text, revealing a gradient shine before settling on the base color.',
    dependencies: ['motion'],
  },
  {
    name: 'morphing-text',
    title: 'Morphing Text',
    description: 'A dynamic text morphing component for Magic UI.',
    dependencies: [],
  },
  {
    name: 'highlighter',
    title: 'Highlighter',
    description:
      'A text highlighter that mimics the effect of a human-drawn marker stroke.',
    dependencies: ['motion', 'rough-notation'],
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

console.log(`Generated ${items.length} Magic UI registry items`)
