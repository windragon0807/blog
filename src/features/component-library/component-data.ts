export type ComponentCategoryId =
  | 'actions-controls'
  | 'content-media'
  | 'data-structure'
  | 'text-typography'
  | 'effects-backgrounds'

export type ComponentPreviewKind =
  | 'ripple-button'
  | 'shiny-button'
  | 'marquee'
  | 'icon-cloud'
  | 'lens'
  | 'pointer'
  | 'file-tree'
  | 'animated-circular-progress-bar'
  | 'curved-loop'
  | 'click-spark'
  | 'magnet'
  | 'stack'
  | 'folder'
  | 'carousel'
  | 'elastic-slider'
  | 'counter'
  | 'shine-border'
  | 'meteors'
  | 'confetti'
  | 'particles'
  | 'typing-animation'
  | 'aurora-text'
  | 'video-text'
  | 'number-ticker'
  | 'dia-text-reveal'
  | 'morphing-text'
  | 'highlighter'
  | 'background-boxes'
  | 'keyboard'
  | 'placeholders-and-vanish-input'
  | 'gooey-input'
  | '3d-marquee'
  | 'avatar-group'
  | 'playful-todolist'
  | 'slide-arrow-button'
  | 'flower-menu'
  | 'text-flip'
  | 'toggle-theme'
  | '3d-image-carousel'
  | 'sparkle-cursor'
  | 'data-table'

export interface ComponentCategory {
  id: ComponentCategoryId
  name: string
  description: string
}

export interface ComponentProp {
  name: string
  type: string
  defaultValue: string
  description: string
}

export interface ComponentRegistry {
  name: string
  url: string
  dependencies: readonly string[]
}

export interface ComponentReference {
  label: string
  url: string
}

export interface ComponentSample {
  slug: ComponentPreviewKind
  categoryId: ComponentCategoryId
  title: string
  description: string
  status: 'Draft' | 'Ready'
  installCommand: string
  filePath: string
  preview: {
    kind: ComponentPreviewKind
    label: string
  }
  registry?: ComponentRegistry
  reference: ComponentReference
  code: string
  usage: string
  props: readonly ComponentProp[]
}

interface ComponentSampleInput {
  slug: ComponentPreviewKind
  categoryId: ComponentCategoryId
  title: string
  description: string
  dependencies?: readonly string[]
  reference?: ComponentReference
  usage: string
  props: readonly ComponentProp[]
}

const prop = (
  name: string,
  type: string,
  defaultValue: string,
  description: string
): ComponentProp => ({ name, type, defaultValue, description })

const classNameProp = prop(
  'className',
  'string',
  '-',
  'Additional classes merged onto the component.'
)

const childrenProp = prop(
  'children',
  'React.ReactNode',
  '-',
  'Content rendered inside the component.'
)

const reactBitsReferencePaths: Partial<Record<ComponentPreviewKind, string>> = {
  'curved-loop': '/text-animations/curved-loop',
  'click-spark': '/animations/click-spark',
  magnet: '/animations/magnet',
  stack: '/components/stack',
  folder: '/components/folder',
  carousel: '/components/carousel',
  'elastic-slider': '/components/elastic-slider',
  counter: '/components/counter?value=17.8',
}

function reactBitsReference(slug: ComponentPreviewKind, title: string) {
  const path = reactBitsReferencePaths[slug]

  if (!path) {
    return undefined
  }

  return {
    label: `ReactBits ${title}`,
    url: `https://reactbits.dev${path}`,
  } satisfies ComponentReference
}

function createSample({
  slug,
  categoryId,
  title,
  description,
  dependencies = [],
  reference,
  usage,
  props,
}: ComponentSampleInput): ComponentSample {
  return {
    slug,
    categoryId,
    title,
    description,
    status: 'Ready',
    installCommand: `pnpm dlx shadcn@latest add https://ryong.dev/r/${slug}.json`,
    filePath: `components/magicui/${slug}.tsx`,
    preview: {
      kind: slug,
      label: title,
    },
    registry: {
      name: slug,
      url: `/r/${slug}.json`,
      dependencies,
    },
    reference: reference ?? reactBitsReference(slug, title) ?? {
      label: `Magic UI ${title}`,
      url: `https://magicui.design/docs/components/${slug}`,
    },
    code: usage,
    usage,
    props,
  }
}

export const componentCategories: readonly ComponentCategory[] = [
  {
    id: 'actions-controls',
    name: 'Actions & Controls',
    description: 'Buttons, menus, inputs, toggles, and small interaction controls.',
  },
  {
    id: 'content-media',
    name: 'Content & Media',
    description: 'Carousels, avatars, image tools, and content presentation patterns.',
  },
  {
    id: 'data-structure',
    name: 'Data & Structure',
    description: 'Tables, trees, counters, and progress indicators for structured information.',
  },
  {
    id: 'text-typography',
    name: 'Text & Typography',
    description: 'Animated text treatments for headings, numbers, and inline emphasis.',
  },
  {
    id: 'effects-backgrounds',
    name: 'Effects & Backgrounds',
    description: 'Pointer effects, ambient motion, particles, borders, and background surfaces.',
  },
]

export const componentSamples: readonly ComponentSample[] = [
  createSample({
    slug: 'background-boxes',
    categoryId: 'effects-backgrounds',
    title: 'Background Boxes',
    description: 'A hover-reactive grid background for hero and feature surfaces.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Background Boxes',
      url: 'https://ui.aceternity.com/components/background-boxes',
    },
    usage: `import { BackgroundBoxes } from "@/components/magicui/background-boxes"

export default function Example() {
  return (
    <div className="relative h-96 overflow-hidden bg-slate-900">
      <BackgroundBoxes />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(15,23,42,0.96)_78%)]" />
    </div>
  )
}`,
    props: [
      classNameProp,
      prop('rows', 'number', '150', 'Number of grid rows.'),
      prop('columns', 'number', '100', 'Number of grid columns.'),
      prop('colors', 'string[]', 'built-in palette', 'Hover color palette.'),
      prop('boxClassName', 'string', '-', 'Classes applied to each box.'),
    ],
  }),
  createSample({
    slug: 'keyboard',
    categoryId: 'actions-controls',
    title: 'Keyboard',
    description: 'A Mac-style keyboard with clickable and physical key states.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Keyboard',
      url: 'https://ui.aceternity.com/components/keyboard',
    },
    usage: `import { Keyboard } from "@/components/magicui/keyboard"

export default function Example() {
  return <Keyboard showPreview />
}`,
    props: [
      classNameProp,
      prop('showPreview', 'boolean', 'false', 'Whether to show the last pressed key above the keyboard.'),
      prop('enableSound', 'boolean', 'false', 'Reserved hook for adding key sounds without bundling audio assets.'),
      prop('keys', 'string[]', '-', 'Optional shortcut mode for compact key combinations.'),
      prop('keyClassName', 'string', '-', 'Classes applied to shortcut keys.'),
    ],
  }),
  createSample({
    slug: 'placeholders-and-vanish-input',
    categoryId: 'actions-controls',
    title: 'Placeholders And Vanish Input',
    description: 'A search input with rotating placeholders and vanish submit motion.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Placeholders And Vanish Input',
      url: 'https://ui.aceternity.com/components/placeholders-and-vanish-input',
    },
    usage: `import { PlaceholdersAndVanishInput } from "@/components/magicui/placeholders-and-vanish-input"

export default function Example() {
  return <PlaceholdersAndVanishInput placeholders={["Search docs", "Ask AI"]} />
}`,
    props: [
      classNameProp,
      prop('placeholders', 'string[]', '-', 'Placeholder values to rotate.'),
      prop('onSubmit', '(value: string) => void', '-', 'Submit handler.'),
    ],
  }),
  createSample({
    slug: 'gooey-input',
    categoryId: 'actions-controls',
    title: 'Gooey Input',
    description: 'A collapsed search input that expands through a gooey SVG filter.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Gooey Input',
      url: 'https://ui.aceternity.com/components/gooey-input',
    },
    usage: `import { GooeyInput } from "@/components/magicui/gooey-input"

export default function Example() {
  return <GooeyInput placeholder="Search..." />
}`,
    props: [
      classNameProp,
      prop('placeholder', 'string', '"Type to search..."', 'Input placeholder.'),
      prop('collapsedWidth', 'number', '115', 'Collapsed control width.'),
      prop('expandedWidth', 'number', '200', 'Expanded control width.'),
      prop('expandedOffset', 'number', '50', 'Offset used by the detached search bubble.'),
      prop('onValueChange', '(value: string) => void', '-', 'Value change handler.'),
    ],
  }),

  createSample({
    slug: '3d-marquee',
    categoryId: 'content-media',
    title: '3D Marquee',
    description: 'A perspective marquee grid for image or card strips.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity 3D Marquee',
      url: 'https://ui.aceternity.com/components/3d-marquee',
    },
    usage: `import { ThreeDMarquee } from "@/components/magicui/3d-marquee"

export default function Example() {
  return <ThreeDMarquee images={images} />
}`,
    props: [
      classNameProp,
      prop('images', 'string[]', '-', 'Images rendered in the 3D grid.'),
      prop('items', 'React.ReactNode[]', '-', 'Legacy custom item fallback.'),
    ],
  }),
  createSample({
    slug: 'avatar-group',
    categoryId: 'content-media',
    title: 'Avatar Group',
    description: 'A stacked avatar group with hover lift and tooltip motion.',
    dependencies: ['motion'],
    reference: {
      label: 'Animate UI Avatar Group',
      url: 'https://animate-ui.com/docs/components/animate/avatar-group',
    },
    usage: `import { AvatarGroup } from "@/components/magicui/avatar-group"

export default function Example() {
  return <AvatarGroup items={users} />
}`,
    props: [
      classNameProp,
      prop('items', 'AvatarGroupItem[]', '-', 'Avatar data.'),
      prop('max', 'number', '6', 'Maximum visible avatars.'),
      prop('invertOverlap', 'boolean', 'true', 'Whether the earlier avatars should visually sit above later avatars.'),
      prop('translate', 'string | number', '"-30%"', 'Hover translation applied to the active avatar.'),
      prop('transition', 'Transition', 'spring 300/17', 'Avatar hover transition.'),
      prop('tooltipTransition', 'Transition', 'spring 300/35', 'Tooltip enter and exit transition.'),
    ],
  }),

  createSample({
    slug: 'playful-todolist',
    categoryId: 'actions-controls',
    title: 'Playful Todo List',
    description: 'A small animated todo list interaction.',
    dependencies: ['motion'],
    reference: {
      label: 'Animate UI Playful TodoList',
      url: 'https://animate-ui.com/docs/components/community/playful-todolist',
    },
    usage: `import { PlayfulTodoList } from "@/components/magicui/playful-todolist"

export default function Example() {
  return <PlayfulTodoList />
}`,
    props: [
      classNameProp,
      prop('items', 'TodoItem[]', 'built-in list', 'Todo labels and initial checked states.'),
    ],
  }),
  createSample({
    slug: 'slide-arrow-button',
    categoryId: 'actions-controls',
    title: 'Slide Arrow Button',
    description: 'A button with a sliding arrow hover transition.',
    dependencies: ['lucide-react'],
    reference: {
      label: 'Animata Slide Arrow Button',
      url: 'https://animata.design/docs/button/slide-arrow-button',
    },
    usage: `import { SlideArrowButton } from "@/components/magicui/slide-arrow-button"

export default function Example() {
  return <SlideArrowButton>Continue</SlideArrowButton>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('text', 'string', '"Get Started"', 'Button text when children are not provided.'),
      prop('primaryColor', 'string', '"var(--theme-accent-current)"', 'Color used by the sliding background.'),
      prop('...props', 'ButtonHTMLAttributes<HTMLButtonElement>', '-', 'Native button props.'),
    ],
  }),
  createSample({
    slug: 'flower-menu',
    categoryId: 'actions-controls',
    title: 'Flower Menu',
    description: 'A radial floating action menu.',
    dependencies: [],
    reference: {
      label: 'Animata Flower Menu',
      url: 'https://animata.design/docs/fabs/flower-menu',
    },
    usage: `import { FlowerMenu } from "@/components/magicui/flower-menu"

export default function Example() {
  return <FlowerMenu items={items} />
}`,
    props: [
      classNameProp,
      prop('items', 'FlowerMenuItem[]', '-', 'Menu actions.'),
    ],
  }),

  createSample({
    slug: 'text-flip',
    categoryId: 'text-typography',
    title: 'Text Flip',
    description: 'A rotating word flip animation.',
    dependencies: ['motion'],
    reference: {
      label: 'Animata Text Flip',
      url: 'https://animata.design/docs/text/text-flip',
    },
    usage: `import { TextFlip } from "@/components/magicui/text-flip"

export default function Example() {
  return <TextFlip prefix="Coding is" words={["fantastic", "love", "fire"]} />
}`,
    props: [
      classNameProp,
      prop('prefix', 'string', '"Coding is"', 'Stable text rendered before the animated word.'),
      prop('words', 'string[]', '-', 'Words to rotate.'),
      prop('interval', 'number', '2600', 'Flip interval in milliseconds.'),
    ],
  }),
  createSample({
    slug: 'toggle-theme',
    categoryId: 'actions-controls',
    title: 'Toggle Theme',
    description: 'A minimal switch-style theme toggle.',
    dependencies: ['lucide-react', 'next-themes'],
    reference: {
      label: 'Lightswind Toggle Theme',
      url: 'https://lightswind.com/components/toggle-theme',
    },
    usage: `import { ToggleTheme } from "@/components/magicui/toggle-theme"

export default function Example() {
  return <ToggleTheme />
}`,
    props: [
      classNameProp,
      prop('animationType', '"circle" | "wipe" | "blur" | "fade"', '"circle"', 'View transition animation style.'),
      prop('defaultChecked', 'boolean', 'false', 'Initial checked state.'),
      prop('onChange', '(checked: boolean) => void', '-', 'Change handler.'),
    ],
  }),
  createSample({
    slug: '3d-image-carousel',
    categoryId: 'content-media',
    title: '3D Image Carousel',
    description: 'A rotating perspective image carousel.',
    dependencies: ['lucide-react'],
    reference: {
      label: 'Lightswind 3D Image Carousel',
      url: 'https://lightswind.com/components/3d-image-carousel',
    },
    usage: `import { ThreeDImageCarousel } from "@/components/magicui/3d-image-carousel"

export default function Example() {
  return <ThreeDImageCarousel items={items} />
}`,
    props: [
      classNameProp,
      prop('items', 'ThreeDImageCarouselItem[]', '-', 'Images to show.'),
      prop('slides', 'ThreeDImageCarouselItem[]', '-', 'Alias for images to show.'),
      prop('interval', 'number', '2200', 'Auto-rotation interval.'),
      prop('autoplay', 'boolean', 'false', 'Whether to rotate automatically.'),
    ],
  }),
  createSample({
    slug: 'sparkle-cursor',
    categoryId: 'effects-backgrounds',
    title: 'Sparkle Cursor',
    description: 'A local cursor sparkle effect for a bounded surface.',
    dependencies: ['gsap'],
    reference: {
      label: 'Lightswind Sparkle Cursor',
      url: 'https://lightswind.com/components/sparkle-cursor',
    },
    usage: `import { SparkleCursor } from "@/components/magicui/sparkle-cursor"

export default function Example() {
  return <SparkleCursor>Move here</SparkleCursor>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('color', 'string', '"var(--theme-accent-current)"', 'Sparkle color.'),
      prop('fullScreen', 'boolean', 'false', 'Whether the canvas covers the viewport.'),
    ],
  }),
  createSample({
    slug: 'data-table',
    categoryId: 'data-structure',
    title: 'Table',
    description: 'A simple typed data table inspired by HeroUI table structure.',
    reference: {
      label: 'HeroUI Table',
      url: 'https://heroui.com/en/docs/react/components/table',
    },
    usage: `import { DataTable } from "@/components/magicui/data-table"

export default function Example() {
  return <DataTable columns={columns} rows={rows} />
}`,
    props: [
      classNameProp,
      prop('columns', 'DataTableColumn<T>[]', '-', 'Column definitions.'),
      prop('rows', 'T[]', '-', 'Rows to render.'),
    ],
  }),
  createSample({
    slug: 'ripple-button',
    categoryId: 'actions-controls',
    title: 'Ripple Button',
    description: 'A button that emits a click ripple from the pointer position.',
    usage: `import { RippleButton } from "@/components/magicui/ripple-button"

export default function Example() {
  return <RippleButton>Click me</RippleButton>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('rippleColor', 'string', '"#ffffff"', 'Color of the ripple wave.'),
      prop('duration', 'string', '"600ms"', 'Ripple animation duration.'),
      prop('...props', 'ButtonHTMLAttributes<HTMLButtonElement>', '-', 'Native button props.'),
    ],
  }),
  createSample({
    slug: 'shiny-button',
    categoryId: 'actions-controls',
    title: 'Shiny Button',
    description: 'A button with a looping masked shine and spring tap feedback.',
    dependencies: ['motion'],
    usage: `import { ShinyButton } from "@/components/magicui/shiny-button"

export default function Example() {
  return <ShinyButton>Shiny Button</ShinyButton>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('...props', 'HTMLAttributes<HTMLElement> & MotionProps', '-', 'Motion button props.'),
    ],
  }),
  createSample({
    slug: 'marquee',
    categoryId: 'content-media',
    title: 'Marquee',
    description:
      'An infinite scrolling component that can display text, images, or videos.',
    usage: `import { Marquee } from "@/components/magicui/marquee"

export default function Example() {
  return (
    <Marquee>
      <span>Next.js</span>
      <span>React</span>
      <span>TypeScript</span>
      <span>Tailwind CSS</span>
    </Marquee>
  )
}`,
    props: [
      classNameProp,
      prop('reverse', 'boolean', 'false', 'Whether to reverse the direction.'),
      prop('pauseOnHover', 'boolean', 'false', 'Whether to pause on hover.'),
      prop('vertical', 'boolean', 'false', 'Whether to animate vertically.'),
      childrenProp,
      prop('repeat', 'number', '4', 'How many times to repeat the content.'),
    ],
  }),
  createSample({
    slug: 'icon-cloud',
    categoryId: 'content-media',
    title: 'Icon Cloud',
    description: 'An interactive 3D tag cloud component.',
    usage: `import { IconCloud } from "@/components/magicui/icon-cloud"

const images = [
  "https://cdn.simpleicons.org/typescript/typescript",
  "https://cdn.simpleicons.org/react/react",
  "https://cdn.simpleicons.org/nextdotjs/nextdotjs",
]

export default function Example() {
  return <IconCloud images={images} />
}`,
    props: [
      prop('icons', 'React.ReactNode[]', '[]', 'Custom icon nodes to render.'),
      prop('images', 'string[]', '[]', 'Image URLs to render in the cloud.'),
    ],
  }),
  createSample({
    slug: 'lens',
    categoryId: 'content-media',
    title: 'Lens',
    description:
      'An interactive component that enables zooming into images, videos, and other elements.',
    dependencies: ['motion'],
    usage: `import { Lens } from "@/components/magicui/lens"

export default function Example() {
  return (
    <Lens>
      <img src="/images/lens-demo.jpg" alt="Lens demo" />
    </Lens>
  )
}`,
    props: [
      childrenProp,
      prop('zoomFactor', 'number', '1.3', 'The magnification factor.'),
      prop('lensSize', 'number', '170', 'The lens size in pixels.'),
      prop('isStatic', 'boolean', 'false', 'Whether the lens remains fixed.'),
      prop('duration', 'number', '0.1', 'Animation duration in seconds.'),
      prop('lensColor', 'string', '"black"', 'Color used by the mask.'),
    ],
  }),
  createSample({
    slug: 'pointer',
    categoryId: 'effects-backgrounds',
    title: 'Pointer',
    description: 'A component that displays a pointer when hovering over an element.',
    dependencies: ['motion'],
    usage: `import { Pointer } from "@/components/magicui/pointer"

export default function Example() {
  return (
    <div className="relative">
      <Pointer />
    </div>
  )
}`,
    props: [
      classNameProp,
      childrenProp,
      prop('...props', 'HTMLMotionProps<"div">', '-', 'Motion props for wrapper.'),
    ],
  }),
  createSample({
    slug: 'file-tree',
    categoryId: 'data-structure',
    title: 'File Tree',
    description: 'A nested file tree with selectable files, folders, and collapse controls.',
    dependencies: ['@radix-ui/react-accordion', '@radix-ui/react-scroll-area', 'lucide-react'],
    usage: `import { Tree, type TreeViewElement } from "@/components/magicui/file-tree"

const elements: TreeViewElement[] = [
  {
    id: "1",
    name: "app",
    children: [
      { id: "2", name: "page.tsx" },
      { id: "3", name: "layout.tsx" },
    ],
  },
]

export default function Example() {
  return <Tree elements={elements} initialExpandedItems={["1"]} />
}`,
    props: [
      prop('elements', 'TreeViewElement[]', 'undefined', 'Tree data rendered recursively.'),
      prop('initialSelectedId', 'string', 'undefined', 'Initially selected file or folder id.'),
      prop('initialExpandedItems', 'string[]', 'undefined', 'Folder ids opened on first render.'),
      prop('indicator', 'boolean', 'true', 'Whether to show nesting guide lines.'),
      prop('openIcon', 'React.ReactNode', 'FolderOpenIcon', 'Icon for expanded folders.'),
      prop('closeIcon', 'React.ReactNode', 'FolderIcon', 'Icon for collapsed folders.'),
      prop('sort', 'TreeSortMode', '"default"', 'Folder/file sorting behavior.'),
    ],
  }),
  createSample({
    slug: 'animated-circular-progress-bar',
    categoryId: 'data-structure',
    title: 'Animated Circular Progress Bar',
    description: 'A circular gauge that animates between values with primary and secondary arcs.',
    usage: `import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar"

export default function Example() {
  return (
    <AnimatedCircularProgressBar
      value={75}
      gaugePrimaryColor="#18181b"
      gaugeSecondaryColor="#e4e4e7"
    />
  )
}`,
    props: [
      prop('value', 'number', '0', 'Current value to display.'),
      prop('min', 'number', '0', 'Minimum gauge value.'),
      prop('max', 'number', '100', 'Maximum gauge value.'),
      prop('gaugePrimaryColor', 'string', '-', 'Primary progress stroke color.'),
      prop('gaugeSecondaryColor', 'string', '-', 'Secondary track stroke color.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'curved-loop',
    categoryId: 'text-typography',
    title: 'Curved Loop',
    description: 'A draggable SVG text marquee that loops along a curved path.',
    usage: `import { CurvedLoop } from "@/components/magicui/curved-loop"

export default function Example() {
  return (
    <CurvedLoop
      marqueeText="React Bits ✦ Curved Loop ✦ "
      speed={3}
      curveAmount={120}
      className="text-5xl font-semibold"
    />
  )
}`,
    props: [
      prop('marqueeText', 'string', '""', 'Text repeated along the curve.'),
      prop('speed', 'number', '2', 'Loop speed.'),
      prop('curveAmount', 'number', '400', 'Vertical curve intensity.'),
      prop('direction', '"left" | "right"', '"left"', 'Marquee direction.'),
      prop('interactive', 'boolean', 'true', 'Whether drag controls speed and direction.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'click-spark',
    categoryId: 'effects-backgrounds',
    title: 'Click Spark',
    description: 'A canvas overlay that emits radial sparks from every click.',
    usage: `import { ClickSpark } from "@/components/magicui/click-spark"

export default function Example() {
  return (
    <ClickSpark sparkColor="#5227ff" sparkRadius={32}>
      <button>Click for sparks</button>
    </ClickSpark>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('sparkColor', 'string', '"#fff"', 'Spark line color.'),
      prop('sparkSize', 'number', '10', 'Spark line length.'),
      prop('sparkRadius', 'number', '15', 'Spark travel distance.'),
      prop('sparkCount', 'number', '8', 'Number of lines per click.'),
      prop('duration', 'number', '400', 'Spark animation duration in ms.'),
    ],
  }),
  createSample({
    slug: 'magnet',
    categoryId: 'effects-backgrounds',
    title: 'Magnet',
    description: 'A hover target that pulls its child toward the pointer.',
    usage: `import { Magnet } from "@/components/magicui/magnet"

export default function Example() {
  return (
    <Magnet padding={80} magnetStrength={3}>
      <button>Magnet</button>
    </Magnet>
  )
}`,
    props: [
      childrenProp,
      prop('padding', 'number', '100', 'Pointer activation area around the element.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable magnetic movement.'),
      prop('magnetStrength', 'number', '2', 'How strongly the element follows the pointer.'),
      prop('wrapperClassName', 'string', '""', 'Classes for the outer wrapper.'),
      prop('innerClassName', 'string', '""', 'Classes for the moving child wrapper.'),
    ],
  }),
  createSample({
    slug: 'stack',
    categoryId: 'content-media',
    title: 'Stack',
    description: 'A draggable card stack that sends swiped cards to the back.',
    dependencies: ['motion'],
    usage: `import { Stack } from "@/components/magicui/stack"

export default function Example() {
  return (
    <div className="h-64 w-64">
      <Stack randomRotation />
    </div>
  )
}`,
    props: [
      prop('randomRotation', 'boolean', 'false', 'Whether to rotate cards randomly.'),
      prop('sensitivity', 'number', '200', 'Drag distance required to send card back.'),
      prop('sendToBackOnClick', 'boolean', 'false', 'Whether clicking moves a card back.'),
      prop('cards', 'React.ReactNode[]', 'built-in cards', 'Custom card nodes.'),
      prop('autoplay', 'boolean', 'false', 'Whether the stack cycles automatically.'),
    ],
  }),
  createSample({
    slug: 'folder',
    categoryId: 'content-media',
    title: 'Folder',
    description: 'A clickable folder illustration that opens layered paper cards.',
    usage: `import { Folder } from "@/components/magicui/folder"

export default function Example() {
  return <Folder color="#5227ff" />
}`,
    props: [
      prop('color', 'string', '"#5227FF"', 'Folder base color.'),
      prop('size', 'number', '1', 'Scale multiplier.'),
      prop('items', 'React.ReactNode[]', '[]', 'Custom paper content.'),
      classNameProp,
    ],
  }),

  createSample({
    slug: 'carousel',
    categoryId: 'content-media',
    title: 'Carousel',
    description: 'A draggable, optionally autoplaying 3D card carousel.',
    dependencies: ['motion', 'react-icons'],
    usage: `import { Carousel } from "@/components/magicui/carousel"

export default function Example() {
  return <Carousel autoplay loop pauseOnHover />
}`,
    props: [
      prop('items', 'CarouselItem[]', 'built-in items', 'Carousel cards.'),
      prop('baseWidth', 'number', '300', 'Carousel width.'),
      prop('autoplay', 'boolean', 'false', 'Whether to advance automatically.'),
      prop('autoplayDelay', 'number', '3000', 'Delay between autoplay steps.'),
      prop('pauseOnHover', 'boolean', 'false', 'Whether hovering pauses autoplay.'),
      prop('loop', 'boolean', 'false', 'Whether the carousel wraps.'),
      prop('round', 'boolean', 'false', 'Whether to render the round style.'),
    ],
  }),

  createSample({
    slug: 'elastic-slider',
    categoryId: 'actions-controls',
    title: 'Elastic Slider',
    description: 'A slider with elastic overflow and springy thumb movement.',
    dependencies: ['motion'],
    usage: `import { ElasticSlider } from "@/components/magicui/elastic-slider"

export default function Example() {
  return <ElasticSlider defaultValue={45} />
}`,
    props: [
      prop('defaultValue', 'number', '50', 'Initial slider value.'),
      prop('startingValue', 'number', '0', 'Minimum value.'),
      prop('maxValue', 'number', '100', 'Maximum value.'),
      prop('isStepped', 'boolean', 'false', 'Whether to snap to steps.'),
      prop('stepSize', 'number', '1', 'Value increment when stepped.'),
      prop('leftIcon', 'React.ReactNode', '-', 'Optional left icon.'),
      prop('rightIcon', 'React.ReactNode', '-', 'Optional right icon.'),
    ],
  }),
  createSample({
    slug: 'counter',
    categoryId: 'data-structure',
    title: 'Counter',
    description: 'An animated rolling number counter with decimal place support.',
    dependencies: ['motion'],
    usage: `import { useState } from "react"
import { Counter } from "@/components/magicui/counter"

export default function Example() {
  const [value, setValue] = useState(17.8)

  return (
    <div>
      <Counter value={value} />
      <button
        type="button"
        onClick={() => setValue((current) => Number((current - 1).toFixed(1)))}
      >
        Decrease
      </button>
      <button
        type="button"
        onClick={() => setValue((current) => Number((current + 1).toFixed(1)))}
      >
        Increase
      </button>
    </div>
  )
}`,
    props: [
      prop('value', 'number', '-', 'Target number.'),
      prop('fontSize', 'number', '100', 'Digit font size.'),
      prop('places', 'PlaceValue[]', 'auto from value', 'Displayed integer and decimal places.'),
      prop('gap', 'number', '8', 'Gap between digit columns.'),
      prop('textColor', 'string', '"inherit"', 'Digit text color.'),
      prop('fontWeight', 'React.CSSProperties["fontWeight"]', '"inherit"', 'Digit weight.'),
    ],
  }),

  createSample({
    slug: 'shine-border',
    categoryId: 'effects-backgrounds',
    title: 'Shine Border',
    description: 'Shine border is an animated background border effect.',
    usage: `import { ShineBorder } from "@/components/magicui/shine-border"

export default function Example() {
  return (
    <div className="relative rounded-xl border p-6">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      Shine Border
    </div>
  )
}`,
    props: [
      prop('borderWidth', 'number', '1', 'Width of the shine border.'),
      prop('duration', 'number', '14', 'Animation duration in seconds.'),
      prop('shineColor', 'string | string[]', '"#000000"', 'Border shine colors.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'meteors',
    categoryId: 'effects-backgrounds',
    title: 'Meteors',
    description: 'A meteor shower effect.',
    usage: `import { Meteors } from "@/components/magicui/meteors"

export default function Example() {
  return (
    <div className="relative overflow-hidden rounded-xl border p-6">
      <Meteors number={20} />
      Meteors
    </div>
  )
}`,
    props: [
      prop('number', 'number', '20', 'Number of meteors to render.'),
      prop('minDelay', 'number', '0.2', 'Minimum animation delay.'),
      prop('maxDelay', 'number', '1.2', 'Maximum animation delay.'),
      prop('minDuration', 'number', '2', 'Minimum animation duration.'),
      prop('maxDuration', 'number', '10', 'Maximum animation duration.'),
      prop('angle', 'number', '215', 'Meteor travel angle.'),
    ],
  }),
  createSample({
    slug: 'confetti',
    categoryId: 'effects-backgrounds',
    title: 'Confetti',
    description:
      'Confetti animations are best used to delight users when something special happens.',
    dependencies: ['canvas-confetti', '@types/canvas-confetti'],
    usage: `import { ConfettiButton } from "@/components/magicui/confetti"

export default function Example() {
  return <ConfettiButton>Celebrate</ConfettiButton>
}`,
    props: [
      prop('options', 'ConfettiOptions', '-', 'Per-shot confetti options.'),
      prop('globalOptions', 'ConfettiGlobalOptions', '{ resize: true }', 'Canvas instance options.'),
      prop('manualstart', 'boolean', 'false', 'Whether to start manually.'),
      childrenProp,
    ],
  }),
  createSample({
    slug: 'particles',
    categoryId: 'effects-backgrounds',
    title: 'Particles',
    description:
      'Particles add visual flair with depth, movement, and interactivity.',
    usage: `import { Particles } from "@/components/magicui/particles"

export default function Example() {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl border">
      <Particles quantity={80} color="#38bdf8" />
    </div>
  )
}`,
    props: [
      classNameProp,
      prop('quantity', 'number', '100', 'Number of particles.'),
      prop('staticity', 'number', '50', 'How strongly particles react to pointer movement.'),
      prop('ease', 'number', '50', 'Pointer easing amount.'),
      prop('size', 'number', '0.4', 'Base particle size.'),
      prop('color', 'string', '"#ffffff"', 'Particle color.'),
    ],
  }),
  createSample({
    slug: 'typing-animation',
    categoryId: 'text-typography',
    title: 'Typing Animation',
    description: 'Characters appearing in typed animation.',
    dependencies: ['motion'],
    usage: `import { TypingAnimation } from "@/components/magicui/typing-animation"

export default function Example() {
  return <TypingAnimation>Typing Animation</TypingAnimation>
}`,
    props: [
      prop('children', 'string', '-', 'Text content to type.'),
      prop('words', 'string[]', '-', 'Rotating words to type.'),
      classNameProp,
      prop('duration', 'number', '100', 'Character timing.'),
      prop('loop', 'boolean', 'false', 'Whether to loop words.'),
      prop('showCursor', 'boolean', 'true', 'Whether to show cursor.'),
    ],
  }),
  createSample({
    slug: 'aurora-text',
    categoryId: 'text-typography',
    title: 'Aurora Text',
    description: 'A beautiful aurora text effect.',
    usage: `import { AuroraText } from "@/components/magicui/aurora-text"

export default function Example() {
  return <AuroraText>Aurora Text</AuroraText>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('colors', 'string[]', 'built-in palette', 'Gradient colors.'),
      prop('speed', 'number', '1', 'Animation speed multiplier.'),
    ],
  }),
  createSample({
    slug: 'video-text',
    categoryId: 'text-typography',
    title: 'Video Text',
    description: 'A component that displays text with a video playing in the background.',
    usage: `import { VideoText } from "@/components/magicui/video-text"

export default function Example() {
  return <VideoText src="/videos/demo.mp4">VIDEO</VideoText>
}`,
    props: [
      prop('src', 'string', '-', 'Video source URL.'),
      childrenProp,
      classNameProp,
      prop('autoPlay', 'boolean', 'true', 'Whether to autoplay the video.'),
      prop('muted', 'boolean', 'true', 'Whether to mute the video.'),
      prop('loop', 'boolean', 'true', 'Whether to loop the video.'),
    ],
  }),
  createSample({
    slug: 'number-ticker',
    categoryId: 'text-typography',
    title: 'Number Ticker',
    description: 'Animate numbers to count up or down to a target number.',
    dependencies: ['motion'],
    usage: `import { NumberTicker } from "@/components/magicui/number-ticker"

export default function Example() {
  return <NumberTicker value={1200} />
}`,
    props: [
      prop('value', 'number', '-', 'Target number.'),
      prop('startValue', 'number', '0', 'Initial number.'),
      prop('direction', '"up" | "down"', '"up"', 'Count direction.'),
      prop('delay', 'number', '0', 'Start delay.'),
      prop('decimalPlaces', 'number', '0', 'Decimal precision.'),
    ],
  }),
  createSample({
    slug: 'dia-text-reveal',
    categoryId: 'text-typography',
    title: 'Dia Text Reveal',
    description:
      'A horizontal color band sweeps across text, revealing a gradient shine.',
    dependencies: ['motion'],
    usage: `import { DiaTextReveal } from "@/components/magicui/dia-text-reveal"

export default function Example() {
  return <DiaTextReveal text="Dia Text Reveal" />
}`,
    props: [
      prop('text', 'string | string[]', '-', 'Text or rotating texts to reveal.'),
      prop('colors', 'string[]', 'built-in palette', 'Sweep colors.'),
      prop('textColor', 'string', '"var(--foreground)"', 'Final text color.'),
      prop('duration', 'number', '1.5', 'One sweep duration.'),
      prop('repeat', 'boolean', 'false', 'Whether to repeat text cycling.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'morphing-text',
    categoryId: 'text-typography',
    title: 'Morphing Text',
    description: 'A dynamic text morphing component for Magic UI.',
    usage: `import { MorphingText } from "@/components/magicui/morphing-text"

export default function Example() {
  return <MorphingText texts={["Design", "Code", "Ship"]} />
}`,
    props: [
      prop('texts', 'string[]', '-', 'Texts to morph between.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'highlighter',
    categoryId: 'text-typography',
    title: 'Highlighter',
    description:
      'A text highlighter that mimics the effect of a human-drawn marker stroke.',
    dependencies: ['motion', 'rough-notation'],
    usage: `import { Highlighter } from "@/components/magicui/highlighter"

export default function Example() {
  return (
    <Highlighter color="#fde68a" padding={6}>
      Highlighter
    </Highlighter>
  )
}`,
    props: [
      childrenProp,
      prop('action', 'AnnotationAction', '"highlight"', 'Annotation style.'),
      prop('color', 'string', '"#ffd1dc"', 'Annotation color.'),
      prop('strokeWidth', 'number', '1.5', 'Stroke width.'),
      prop('animationDuration', 'number', '600', 'Draw animation duration.'),
      prop('iterations', 'number', '2', 'Number of rough-notation strokes.'),
      prop('padding', 'number', '2', 'Annotation padding around the text.'),
      prop('multiline', 'boolean', 'true', 'Whether to annotate wrapped lines.'),
      prop('isView', 'boolean', 'false', 'Whether to start when in view.'),
      prop('repeat', 'boolean', 'false', 'Whether to replay the draw animation.'),
      prop('repeatDelay', 'number', '1800', 'Delay between repeated draw animations.'),
    ],
  }),
]

export function getComponentSampleBySlug(slug: string) {
  return componentSamples.find((sample) => sample.slug === slug) ?? null
}
