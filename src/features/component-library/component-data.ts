export type ComponentCategoryId =
  | 'buttons'
  | 'components'
  | 'animations'
  | 'backgrounds'
  | 'effects'
  | 'text'

export type ComponentPreviewKind =
  | 'ripple-button'
  | 'shiny-button'
  | 'marquee'
  | 'icon-cloud'
  | 'lens'
  | 'pointer'
  | 'file-tree'
  | 'animated-circular-progress-bar'
  | 'backlight'
  | 'curved-loop'
  | 'variable-proximity'
  | 'click-spark'
  | 'magnet'
  | 'strands'
  | 'circular-gallery'
  | 'stack'
  | 'glass-surface'
  | 'folder'
  | 'lanyard'
  | 'carousel'
  | 'border-glow'
  | 'elastic-slider'
  | 'counter'
  | 'aurora'
  | 'dot-field'
  | 'border-beam'
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

function createSample({
  slug,
  categoryId,
  title,
  description,
  dependencies = [],
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
    reference: {
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
    id: 'buttons',
    name: 'Buttons',
    description: 'Interactive Magic UI button components with motion feedback.',
  },
  {
    id: 'components',
    name: 'Components',
    description: 'Magic UI interaction components ready for registry installs.',
  },
  {
    id: 'animations',
    name: 'Animations',
    description: 'Pointer, click, and WebGL motion primitives for interaction-heavy UI.',
  },
  {
    id: 'backgrounds',
    name: 'Backgrounds',
    description: 'Animated background surfaces for immersive sections and demos.',
  },
  {
    id: 'effects',
    name: 'Effects',
    description: 'Visual effects for cards, surfaces, canvas, and celebration UI.',
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Animated text treatments for headings and inline emphasis.',
  },
]

export const componentSamples: readonly ComponentSample[] = [
  createSample({
    slug: 'ripple-button',
    categoryId: 'buttons',
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
    categoryId: 'buttons',
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
    categoryId: 'components',
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
    categoryId: 'components',
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
    categoryId: 'components',
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
    categoryId: 'components',
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
    categoryId: 'components',
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
    categoryId: 'components',
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
    slug: 'backlight',
    categoryId: 'components',
    title: 'Backlight',
    description: 'An SVG filter wrapper that adds a saturated blurred glow behind its child.',
    usage: `import { Backlight } from "@/components/magicui/backlight"

export default function Example() {
  return (
    <Backlight>
      <div>Backlight</div>
    </Backlight>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('blur', 'number', '20', 'Gaussian blur radius for the backlight filter.'),
    ],
  }),
  createSample({
    slug: 'curved-loop',
    categoryId: 'text',
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
    slug: 'variable-proximity',
    categoryId: 'text',
    title: 'Variable Proximity',
    description: 'Variable font settings interpolate as the pointer nears each character.',
    dependencies: ['motion'],
    usage: `import { useRef } from "react"
import { VariableProximity } from "@/components/magicui/variable-proximity"

export default function Example() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef}>
      <VariableProximity
        label="Variable Proximity"
        containerRef={containerRef}
        fromFontVariationSettings="'wght' 400"
        toFontVariationSettings="'wght' 900"
        radius={120}
      />
    </div>
  )
}`,
    props: [
      prop('label', 'string', '-', 'Text split into animated characters.'),
      prop('containerRef', 'MutableRefObject<HTMLElement | null>', '-', 'Pointer coordinate container.'),
      prop('fromFontVariationSettings', 'string', '-', 'Base variable font settings.'),
      prop('toFontVariationSettings', 'string', '-', 'Pointer-proximity variable font settings.'),
      prop('radius', 'number', '50', 'Pointer influence radius.'),
      prop('falloff', '"linear" | "exponential" | "gaussian"', '"linear"', 'Distance falloff curve.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'click-spark',
    categoryId: 'animations',
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
      prop('sparkColor', 'string', '"#fff"', 'Spark line color.'),
      prop('sparkSize', 'number', '10', 'Spark line length.'),
      prop('sparkRadius', 'number', '15', 'Spark travel distance.'),
      prop('sparkCount', 'number', '8', 'Number of lines per click.'),
      prop('duration', 'number', '400', 'Spark animation duration in ms.'),
    ],
  }),
  createSample({
    slug: 'magnet',
    categoryId: 'animations',
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
    slug: 'strands',
    categoryId: 'animations',
    title: 'Strands',
    description: 'A WebGL shader that renders flowing luminous strands.',
    dependencies: ['ogl'],
    usage: `import { Strands } from "@/components/magicui/strands"

export default function Example() {
  return (
    <div className="h-80 overflow-hidden rounded-xl">
      <Strands colors={["#5227ff", "#7cff67", "#ffffff"]} />
    </div>
  )
}`,
    props: [
      prop('colors', 'string[]', 'built-in palette', 'Strand gradient colors.'),
      prop('count', 'number', '3', 'Number of rendered strands.'),
      prop('speed', 'number', '1', 'Animation speed.'),
      prop('amplitude', 'number', '1', 'Wave amplitude.'),
      prop('glow', 'number', '0.4', 'Glow intensity.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'circular-gallery',
    categoryId: 'components',
    title: 'Circular Gallery',
    description: 'A draggable WebGL image gallery with a bent carousel plane.',
    dependencies: ['ogl'],
    usage: `import { CircularGallery } from "@/components/magicui/circular-gallery"

export default function Example() {
  return (
    <div className="h-96">
      <CircularGallery bend={3} textColor="#ffffff" />
    </div>
  )
}`,
    props: [
      prop('items', '{ image: string; text: string }[]', 'built-in images', 'Gallery image and title items.'),
      prop('bend', 'number', '3', 'How strongly the gallery bends.'),
      prop('textColor', 'string', '"#ffffff"', 'Caption color.'),
      prop('borderRadius', 'number', '0.05', 'Rounded image corner amount.'),
      prop('font', 'string', '"bold 30px Figtree"', 'Caption canvas font.'),
      prop('scrollSpeed', 'number', '2', 'Drag and wheel scroll speed.'),
    ],
  }),
  createSample({
    slug: 'stack',
    categoryId: 'components',
    title: 'Stack',
    description: 'A draggable card stack that sends swiped cards to the back.',
    dependencies: ['motion'],
    usage: `import { Stack } from "@/components/magicui/stack"

export default function Example() {
  return <Stack randomRotation />
}`,
    props: [
      prop('randomRotation', 'boolean', 'false', 'Whether to rotate cards randomly.'),
      prop('sensitivity', 'number', '200', 'Drag distance required to send card back.'),
      prop('sendToBackOnClick', 'boolean', 'false', 'Whether clicking moves a card back.'),
      prop('cardDimensions', '{ width: number; height: number }', '{ width: 208, height: 208 }', 'Card size.'),
      prop('cardsData', '{ id: number; img: string }[]', 'built-in cards', 'Card image data.'),
    ],
  }),
  createSample({
    slug: 'glass-surface',
    categoryId: 'components',
    title: 'Glass Surface',
    description: 'A responsive liquid-glass container with SVG displacement fallback.',
    usage: `import { GlassSurface } from "@/components/magicui/glass-surface"

export default function Example() {
  return (
    <GlassSurface width={300} height={120}>
      Glass Surface
    </GlassSurface>
  )
}`,
    props: [
      childrenProp,
      prop('width', 'number | string', '200', 'Surface width.'),
      prop('height', 'number | string', '80', 'Surface height.'),
      prop('borderRadius', 'number', '20', 'Corner radius.'),
      prop('displace', 'number', '0', 'SVG displacement intensity.'),
      prop('backgroundOpacity', 'number', '0.07', 'Glass fill opacity.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'folder',
    categoryId: 'components',
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
    slug: 'lanyard',
    categoryId: 'components',
    title: 'Lanyard',
    description: 'A physics-driven 3D lanyard and badge rendered with React Three Fiber.',
    dependencies: ['@react-three/fiber', '@react-three/drei', '@react-three/rapier', 'meshline', 'three'],
    usage: `import { Lanyard } from "@/components/magicui/lanyard"

export default function Example() {
  return (
    <div className="h-[520px] overflow-hidden">
      <Lanyard />
    </div>
  )
}`,
    props: [
      prop('position', '[number, number, number]', '[0, 0, 30]', 'Camera position.'),
      prop('gravity', '[number, number, number]', '[0, -40, 0]', 'Physics gravity.'),
      prop('fov', 'number', '20', 'Camera field of view.'),
      prop('transparent', 'boolean', 'true', 'Whether the canvas background is transparent.'),
      prop('frontImage', 'string | null', 'null', 'Optional custom badge front image.'),
      prop('backImage', 'string | null', 'null', 'Optional custom badge back image.'),
      prop('lanyardWidth', 'number', '1', 'Rendered lanyard band width.'),
    ],
  }),
  createSample({
    slug: 'carousel',
    categoryId: 'components',
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
    slug: 'border-glow',
    categoryId: 'components',
    title: 'Border Glow',
    description: 'A pointer-aware gradient glow that travels around the border.',
    usage: `import { BorderGlow } from "@/components/magicui/border-glow"

export default function Example() {
  return (
    <BorderGlow>
      Hover the border
    </BorderGlow>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('edgeSensitivity', 'number', '0.4', 'How close the pointer must be to activate.'),
      prop('glowRadius', 'number', '14', 'Glow radius in pixels.'),
      prop('colors', 'string[]', 'built-in palette', 'Glow gradient colors.'),
      prop('animated', 'boolean', 'true', 'Whether to animate glow activation.'),
    ],
  }),
  createSample({
    slug: 'elastic-slider',
    categoryId: 'components',
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
    categoryId: 'components',
    title: 'Counter',
    description: 'An animated rolling number counter with decimal place support.',
    dependencies: ['motion'],
    usage: `import { Counter } from "@/components/magicui/counter"

export default function Example() {
  return <Counter value={17.8} />
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
    slug: 'aurora',
    categoryId: 'backgrounds',
    title: 'Aurora',
    description: 'A WebGL aurora shader background with configurable color stops.',
    dependencies: ['ogl'],
    usage: `import { Aurora } from "@/components/magicui/aurora"

export default function Example() {
  return (
    <div className="h-80 overflow-hidden rounded-xl">
      <Aurora colorStops={["#5227ff", "#7cff67", "#5227ff"]} />
    </div>
  )
}`,
    props: [
      prop('colorStops', 'string[]', '["#5227FF", "#7cff67", "#5227FF"]', 'Aurora gradient colors.'),
      prop('amplitude', 'number', '1', 'Wave amplitude.'),
      prop('blend', 'number', '0.5', 'Color blending intensity.'),
    ],
  }),
  createSample({
    slug: 'dot-field',
    categoryId: 'backgrounds',
    title: 'Dot Field',
    description: 'An interactive canvas field of dots that reacts to pointer movement.',
    usage: `import { DotField } from "@/components/magicui/dot-field"

export default function Example() {
  return (
    <div className="h-80 overflow-hidden rounded-xl">
      <DotField />
    </div>
  )
}`,
    props: [
      prop('dotRadius', 'number', '1.5', 'Base dot radius.'),
      prop('dotSpacing', 'number', '14', 'Spacing between dots.'),
      prop('cursorRadius', 'number', '500', 'Pointer influence distance.'),
      prop('cursorForce', 'number', '0.1', 'How strongly dots react to the pointer.'),
      prop('gradientFrom', 'string', 'rgba(168, 85, 247, 0.35)', 'Dot gradient start.'),
      prop('gradientTo', 'string', 'rgba(180, 151, 207, 0.25)', 'Dot gradient end.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'border-beam',
    categoryId: 'effects',
    title: 'Border Beam',
    description:
      'An animated beam of light which travels along the border of its container.',
    dependencies: ['motion'],
    usage: `import { BorderBeam } from "@/components/magicui/border-beam"

export default function Example() {
  return (
    <div className="relative overflow-hidden rounded-xl border p-6">
      <BorderBeam />
      Border Beam
    </div>
  )
}`,
    props: [
      prop('size', 'number', '50', 'The size of the border beam.'),
      prop('duration', 'number', '6', 'Animation duration in seconds.'),
      prop('delay', 'number', '0', 'Animation delay in seconds.'),
      prop('colorFrom', 'string', '"#ffaa40"', 'Beam start color.'),
      prop('colorTo', 'string', '"#9c40ff"', 'Beam end color.'),
      prop('borderWidth', 'number', '1', 'The animated border width.'),
    ],
  }),
  createSample({
    slug: 'shine-border',
    categoryId: 'effects',
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
    categoryId: 'effects',
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
    categoryId: 'effects',
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
    categoryId: 'effects',
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
    categoryId: 'text',
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
    categoryId: 'text',
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
    categoryId: 'text',
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
    categoryId: 'text',
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
    categoryId: 'text',
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
    categoryId: 'text',
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
    categoryId: 'text',
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
    ],
  }),
]

export function getComponentSampleBySlug(slug: string) {
  return componentSamples.find((sample) => sample.slug === slug) ?? null
}
