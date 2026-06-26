export type ComponentCategoryId = 'components' | 'effects' | 'text'

export type ComponentPreviewKind =
  | 'marquee'
  | 'icon-cloud'
  | 'lens'
  | 'pointer'
  | 'border-beam'
  | 'shine-border'
  | 'meteors'
  | 'confetti'
  | 'particles'
  | 'text-animate'
  | 'typing-animation'
  | 'aurora-text'
  | 'video-text'
  | 'number-ticker'
  | 'animated-shiny-text'
  | 'animated-gradient-text'
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
    code: usage,
    usage,
    props,
  }
}

export const componentCategories: readonly ComponentCategory[] = [
  {
    id: 'components',
    name: 'Components',
    description: 'Magic UI interaction components ready for registry installs.',
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
    slug: 'text-animate',
    categoryId: 'text',
    title: 'Text Animate',
    description:
      'A text animation component that animates text using multiple presets.',
    dependencies: ['motion'],
    usage: `import { TextAnimate } from "@/components/magicui/text-animate"

export default function Example() {
  return <TextAnimate animation="blurInUp">Text Animate</TextAnimate>
}`,
    props: [
      prop('children', 'string', '-', 'Text content to animate.'),
      classNameProp,
      prop('by', '"text" | "word" | "character" | "line"', '"word"', 'How to split the text.'),
      prop('animation', 'AnimationVariant', '"fadeIn"', 'Animation preset.'),
      prop('duration', 'number', '0.3', 'Animation duration.'),
      prop('delay', 'number', '0', 'Initial delay.'),
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
    slug: 'animated-shiny-text',
    categoryId: 'text',
    title: 'Animated Shiny Text',
    description:
      'A light glare effect which pans across text making it appear as if it is shimmering.',
    usage: `import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

export default function Example() {
  return <AnimatedShinyText>Animated Shiny Text</AnimatedShinyText>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('shimmerWidth', 'number', '100', 'Width of the shimmer highlight.'),
    ],
  }),
  createSample({
    slug: 'animated-gradient-text',
    categoryId: 'text',
    title: 'Animated Gradient Text',
    description: 'An animated gradient background which transitions between colors for text.',
    usage: `import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"

export default function Example() {
  return <AnimatedGradientText>Animated Gradient Text</AnimatedGradientText>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('speed', 'number', '1', 'Gradient speed multiplier.'),
      prop('colorFrom', 'string', '"#ffaa40"', 'Gradient start color.'),
      prop('colorTo', 'string', '"#9c40ff"', 'Gradient end color.'),
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
