/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const outDir = path.join(root, 'public/r')

const items = [
  {
    name: 'ripple-button',
    title: 'Ripple Button',
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
    title: 'Shiny Button',
    description: 'A button with a looping masked shine and spring tap feedback.',
    dependencies: ['motion'],
  },
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
    name: 'file-tree',
    title: 'File Tree',
    description: 'A nested file tree with selectable files, folders, and collapse controls.',
    dependencies: ['@radix-ui/react-accordion', '@radix-ui/react-scroll-area', 'lucide-react'],
    registryDependencies: ['button', 'scroll-area'],
  },
  {
    name: 'animated-circular-progress-bar',
    title: 'Animated Circular Progress Bar',
    description: 'A circular gauge that animates between values with primary and secondary arcs.',
    dependencies: [],
  },
  {
    name: 'curved-loop',
    title: 'Curved Loop',
    description: 'A draggable SVG text marquee that loops along a curved path.',
    dependencies: [],
  },
  {
    name: 'click-spark',
    title: 'Click Spark',
    description: 'A canvas overlay that emits radial sparks from every click.',
    dependencies: [],
  },
  {
    name: 'magnet',
    title: 'Magnet',
    description: 'A hover target that pulls its child toward the pointer.',
    dependencies: [],
  },
  {
    name: 'stack',
    title: 'Stack',
    description: 'A draggable card stack that sends swiped cards to the back.',
    dependencies: ['motion'],
  },
  {
    name: 'folder',
    title: 'Folder',
    description: 'A clickable folder illustration that opens layered paper cards.',
    dependencies: [],
  },

  {
    name: 'carousel',
    title: 'Carousel',
    description: 'A draggable, optionally autoplaying 3D card carousel.',
    dependencies: ['motion', 'react-icons'],
  },

  {
    name: 'elastic-slider',
    title: 'Elastic Slider',
    description: 'A slider with elastic overflow and springy thumb movement.',
    dependencies: ['motion'],
  },
  {
    name: 'counter',
    title: 'Counter',
    description: 'An animated rolling number counter with decimal place support.',
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
  {
    name: 'background-boxes',
    title: 'Background Boxes',
    description: 'A hover-reactive grid background for hero and feature surfaces.',
    dependencies: ['motion'],
  },
  {
    name: 'keyboard',
    title: 'Keyboard',
    description: 'A Mac-style keyboard with clickable and physical key states.',
    dependencies: ['motion'],
  },
  {
    name: 'placeholders-and-vanish-input',
    title: 'Placeholders And Vanish Input',
    description: 'A search input with rotating placeholders and vanish submit motion.',
    dependencies: ['motion'],
  },
  {
    name: 'gooey-input',
    title: 'Gooey Input',
    description: 'A collapsed search input that expands through a gooey SVG filter.',
    dependencies: ['motion'],
  },

  {
    name: '3d-marquee',
    title: '3D Marquee',
    description: 'A perspective marquee grid for image or card strips.',
    dependencies: ['motion'],
  },
  {
    name: 'avatar-group',
    title: 'Avatar Group',
    description: 'A stacked avatar group with overflow count.',
    dependencies: ['motion'],
  },

  {
    name: 'playful-todolist',
    title: 'Playful Todo List',
    description: 'A small animated todo list interaction.',
    dependencies: ['motion'],
  },
  {
    name: 'slide-arrow-button',
    title: 'Slide Arrow Button',
    description: 'A button with a sliding arrow hover transition.',
    dependencies: ['lucide-react'],
  },
  {
    name: 'flower-menu',
    title: 'Flower Menu',
    description: 'A radial floating action menu.',
    dependencies: [],
  },

  {
    name: 'text-flip',
    title: 'Text Flip',
    description: 'A rotating word flip animation.',
    dependencies: ['motion'],
  },
  {
    name: 'toggle-theme',
    title: 'Toggle Theme',
    description: 'A minimal switch-style theme toggle.',
    dependencies: ['lucide-react', 'next-themes'],
  },
  {
    name: '3d-image-carousel',
    title: '3D Image Carousel',
    description: 'A rotating perspective image carousel.',
    dependencies: ['lucide-react'],
  },
  {
    name: 'sparkle-cursor',
    title: 'Sparkle Cursor',
    description: 'A local cursor sparkle effect for a bounded surface.',
    dependencies: ['gsap'],
  },
  {
    name: 'mouse-invert-cursor',
    title: 'Mouse Invert Cursor',
    description: 'A scoped mix-blend-mode cursor adapted from mouse-animations Invert.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'mouse-trail-cursor',
    title: 'Mouse Trail Cursor',
    description: 'A bounded canvas dot trail adapted from mouse-animations Trail.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'mouse-ripple-cursor',
    title: 'Mouse Ripple Cursor',
    description: 'A click ripple adapted from mouse-animations Ripple.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'mouse-custom-cursor',
    title: 'Mouse Custom Cursor',
    description: 'A scoped dot and lagging ring adapted from mouse-animations CustomCursor.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'fairy-dust-cursor',
    title: 'Fairy Dust Cursor',
    description: 'A scoped star-dust trail adapted from tholman cursor-effects Fairy Dust.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'bubble-cursor',
    title: 'Bubble Cursor',
    description: 'A scoped bubble particle cursor adapted from tholman cursor-effects Bubbles.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'character-cursor',
    title: 'Character Cursor',
    description: 'A scoped character particle cursor adapted from tholman cursor-effects Character.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'canvas-cursor',
    title: 'Canvas Cursor',
    description: 'A scoped spring-line canvas trail adapted from Cursify Canvas Cursor.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'fluid-cursor',
    title: 'Fluid Cursor',
    description: 'A bounded fluid dye cursor adapted from Cursify Fluid Cursor.',
    dependencies: [],
    sharedFiles: ['cursor-effect-runtime'],
  },
  {
    name: 'data-table',
    title: 'Table',
    description: 'A simple typed data table inspired by HeroUI table structure.',
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
  const sourcePath = path.join(root, `src/components/magicui/${item.name}.tsx`)
  const content = fs.readFileSync(sourcePath, 'utf8')
  const files = [
    {
      path: `src/components/magicui/${item.name}.tsx`,
      content,
      type: 'registry:ui',
    },
    ...(item.sharedFiles ?? []).map((sharedName) => {
      const sharedPath = `src/components/magicui/${sharedName}.tsx`
      return {
        path: sharedPath,
        content: fs.readFileSync(path.join(root, sharedPath), 'utf8'),
        type: 'registry:ui',
      }
    }),
  ]
  const registryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: 'registry:ui',
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
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

console.log(`Generated ${items.length} Magic UI registry items`)
