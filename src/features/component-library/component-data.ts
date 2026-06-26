export type ComponentCategoryId =
  | 'buttons'
  | 'components'
  | 'animations'
  | 'backgrounds'
  | 'cards'
  | 'navigation'
  | 'forms'
  | 'effects'
  | 'fabs'
  | 'text'
  | 'media'
  | 'controls'
  | 'data-display'

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
  | 'background-boxes'
  | 'keyboard'
  | 'pixelated-canvas'
  | 'wobble-card'
  | 'comet-card'
  | 'floating-dock'
  | 'signup-form'
  | 'placeholders-and-vanish-input'
  | 'gooey-input'
  | 'link-preview'
  | '3d-marquee'
  | 'avatar-group'
  | 'animated-checkbox'
  | 'file-upload'
  | 'animated-radio-group'
  | 'playful-todolist'
  | 'border-beam-button'
  | 'slide-arrow-button'
  | 'flower-menu'
  | 'speed-dial'
  | 'kinetic-center-build'
  | 'text-flip'
  | 'cool-theme-toggle'
  | 'toggle-theme'
  | '3d-image-carousel'
  | '3d-image-slider'
  | 'sparkle-cursor'
  | 'stepper'
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
  'variable-proximity': '/text-animations/variable-proximity',
  'click-spark': '/animations/click-spark',
  magnet: '/animations/magnet',
  strands: '/animations/strands',
  'circular-gallery': '/components/circular-gallery',
  stack: '/components/stack',
  'glass-surface': '/components/glass-surface',
  folder: '/components/folder',
  lanyard: '/components/lanyard',
  carousel: '/components/carousel',
  'border-glow': '/components/border-glow',
  'elastic-slider': '/components/elastic-slider',
  counter: '/components/counter?value=17.8',
  aurora: '/backgrounds/aurora',
  'dot-field': '/backgrounds/dot-field',
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
    id: 'cards',
    name: 'Cards',
    description: 'Interactive cards and preview surfaces.',
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Navigation primitives for app shells and quick actions.',
  },
  {
    id: 'forms',
    name: 'Forms',
    description: 'Inputs, pickers, uploads, and form composition components.',
  },
  {
    id: 'effects',
    name: 'Effects',
    description: 'Visual effects for cards, surfaces, canvas, and celebration UI.',
  },
  {
    id: 'fabs',
    name: 'FABs',
    description: 'Floating action button menus for compact command surfaces.',
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Animated text treatments for headings and inline emphasis.',
  },
  {
    id: 'media',
    name: 'Media',
    description: 'Image and avatar presentation components.',
  },
  {
    id: 'controls',
    name: 'Controls',
    description: 'Toggles, steppers, cursors, and task controls.',
  },
  {
    id: 'data-display',
    name: 'Data Display',
    description: 'Structured data presentation components.',
  },
]

export const componentSamples: readonly ComponentSample[] = [
  createSample({
    slug: 'background-boxes',
    categoryId: 'backgrounds',
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
      prop('rows', 'number', '60', 'Number of grid rows.'),
      prop('columns', 'number', '40', 'Number of grid columns.'),
      prop('colors', 'string[]', 'built-in palette', 'Hover color palette.'),
      prop('boxClassName', 'string', '-', 'Classes applied to each box.'),
    ],
  }),
  createSample({
    slug: 'keyboard',
    categoryId: 'forms',
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
    slug: 'pixelated-canvas',
    categoryId: 'backgrounds',
    title: 'Pixelated Canvas',
    description: 'A pixelated image canvas with interactive pointer distortion.',
    reference: {
      label: 'Aceternity Pixelated Canvas',
      url: 'https://ui.aceternity.com/components/pixelated-canvas',
    },
    usage: `import { PixelatedCanvas } from "@/components/magicui/pixelated-canvas"

export default function Example() {
  return <PixelatedCanvas src="/image.jpg" />
}`,
    props: [
      classNameProp,
      prop('src', 'string', 'built-in image', 'Source image sampled into pixels.'),
      prop('cellSize', 'number', '4', 'Sampling cell size.'),
      prop('dotScale', 'number', '0.9', 'Dot size as a fraction of the cell.'),
      prop('shape', '"circle" | "square"', '"square"', 'Rendered pixel shape.'),
      prop('interactive', 'boolean', 'true', 'Whether pointer distortion is enabled.'),
      prop('distortionMode', '"repel" | "attract" | "swirl"', '"swirl"', 'Pointer distortion behavior.'),
    ],
  }),
  createSample({
    slug: 'wobble-card',
    categoryId: 'cards',
    title: 'Wobble Card',
    description: 'A pointer-reactive card that counter-moves its content.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Wobble Card',
      url: 'https://ui.aceternity.com/components/wobble-card',
    },
    usage: `import { WobbleCard } from "@/components/magicui/wobble-card"

export default function Example() {
  return <WobbleCard>Interactive card</WobbleCard>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('containerClassName', 'string', '-', 'Classes applied to the moving outer container.'),
    ],
  }),
  createSample({
    slug: 'comet-card',
    categoryId: 'cards',
    title: 'Comet Card',
    description: 'A card with hover tilt, depth translation, and glare.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Comet Card',
      url: 'https://ui.aceternity.com/components/comet-card',
    },
    usage: `import { CometCard } from "@/components/magicui/comet-card"

export default function Example() {
  return <CometCard>Comet surface</CometCard>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('cardClassName', 'string', '-', 'Classes applied to the inner card surface.'),
      prop('rotateDepth', 'number', '17.5', 'Maximum rotation depth in degrees.'),
      prop('translateDepth', 'number', '20', 'Maximum hover translation depth.'),
    ],
  }),
  createSample({
    slug: 'floating-dock',
    categoryId: 'navigation',
    title: 'Floating Dock',
    description: 'A responsive dock with icon magnification and labels.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Floating Dock',
      url: 'https://ui.aceternity.com/components/floating-dock',
    },
    usage: `import { FloatingDock } from "@/components/magicui/floating-dock"

export default function Example() {
  return <FloatingDock items={items} />
}`,
    props: [
      classNameProp,
      prop('desktopClassName', 'string', '-', 'Classes applied to the desktop dock.'),
      prop('mobileClassName', 'string', '-', 'Classes applied to the mobile dock.'),
      prop('items', 'FloatingDockItem[]', '-', 'Dock items with title, icon, href, and onClick.'),
    ],
  }),
  createSample({
    slug: 'signup-form',
    categoryId: 'forms',
    title: 'Signup Form',
    description: 'A compact signup form surface.',
    reference: {
      label: 'Aceternity Signup Form',
      url: 'https://ui.aceternity.com/components/signup-form',
    },
    usage: `import { SignupForm } from "@/components/magicui/signup-form"

export default function Example() {
  return <SignupForm />
}`,
    props: [
      classNameProp,
      prop('title', 'string', '"Create an account"', 'Form title.'),
      prop('description', 'string', 'built-in copy', 'Supporting copy.'),
      prop('submitLabel', 'string', '"Sign up"', 'Submit button label.'),
      prop('onSubmit', '(event: FormEvent<HTMLFormElement>) => void', '-', 'Submit handler.'),
    ],
  }),
  createSample({
    slug: 'placeholders-and-vanish-input',
    categoryId: 'forms',
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
    categoryId: 'forms',
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
    slug: 'link-preview',
    categoryId: 'cards',
    title: 'Link Preview',
    description: 'A hover card preview for inline links.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Link Preview',
      url: 'https://ui.aceternity.com/components/link-preview',
    },
    usage: `import { LinkPreview } from "@/components/magicui/link-preview"

export default function Example() {
  return <LinkPreview url="/" isStatic imageSrc="/preview.png">Hover me</LinkPreview>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('url', 'string', '-', 'Link URL.'),
      prop('href', 'string', '-', 'Alias for url.'),
      prop('isStatic', 'boolean', 'false', 'Whether to use a supplied image instead of generated screenshot URL.'),
      prop('imageSrc', 'string', '-', 'Static preview image source.'),
      prop('width', 'number', '200', 'Preview width.'),
      prop('height', 'number', '125', 'Preview height.'),
    ],
  }),
  createSample({
    slug: '3d-marquee',
    categoryId: 'media',
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
    categoryId: 'media',
    title: 'Avatar Group',
    description: 'A stacked avatar group with overflow count.',
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
      prop('max', 'number', '5', 'Maximum visible avatars.'),
    ],
  }),
  createSample({
    slug: 'animated-checkbox',
    categoryId: 'forms',
    title: 'Animated Checkbox',
    description: 'A native checkbox with animated check state.',
    dependencies: ['motion', 'lucide-react'],
    reference: {
      label: 'Animate UI Checkbox',
      url: 'https://animate-ui.com/docs/components/radix/checkbox',
    },
    usage: `import { AnimatedCheckbox } from "@/components/magicui/animated-checkbox"

export default function Example() {
  return <AnimatedCheckbox label="Send updates" />
}`,
    props: [
      classNameProp,
      prop('label', 'string', '"Accept terms"', 'Checkbox label.'),
      prop('defaultChecked', 'boolean', 'false', 'Initial checked state.'),
      prop('checked', 'boolean', '-', 'Controlled checked state.'),
      prop('onCheckedChange', '(checked: boolean) => void', '-', 'Change handler.'),
    ],
  }),
  createSample({
    slug: 'file-upload',
    categoryId: 'forms',
    title: 'File Upload',
    description: 'A dashed upload dropzone powered by a native file input.',
    dependencies: ['lucide-react'],
    reference: {
      label: 'Animate UI Files',
      url: 'https://animate-ui.com/docs/components/radix/files',
    },
    usage: `import { FileUpload } from "@/components/magicui/file-upload"

export default function Example() {
  return <FileUpload />
}`,
    props: [
      classNameProp,
      prop('label', 'string', '"Upload files"', 'Upload title.'),
      prop('description', 'string', 'built-in copy', 'Upload helper text.'),
    ],
  }),
  createSample({
    slug: 'animated-radio-group',
    categoryId: 'forms',
    title: 'Animated Radio Group',
    description: 'A native radio group with animated selection dot.',
    dependencies: ['motion'],
    reference: {
      label: 'Animate UI Radio Group',
      url: 'https://animate-ui.com/docs/components/radix/radio-group',
    },
    usage: `import { AnimatedRadioGroup } from "@/components/magicui/animated-radio-group"

export default function Example() {
  return <AnimatedRadioGroup options={options} />
}`,
    props: [
      classNameProp,
      prop('options', 'AnimatedRadioOption[]', '-', 'Radio options.'),
      prop('defaultValue', 'string', '-', 'Initial selected value.'),
      prop('value', 'string', '-', 'Controlled selected value.'),
      prop('onValueChange', '(value: string) => void', '-', 'Change handler.'),
    ],
  }),
  createSample({
    slug: 'playful-todolist',
    categoryId: 'controls',
    title: 'Playful Todo List',
    description: 'A small animated todo list interaction.',
    dependencies: ['motion', 'lucide-react'],
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
      prop('initialItems', 'string[]', '["Sketch", "Build", "Review"]', 'Initial todo labels.'),
    ],
  }),
  createSample({
    slug: 'border-beam-button',
    categoryId: 'buttons',
    title: 'Border Beam Button',
    description: 'A button with an animated conic border beam.',
    reference: {
      label: 'Cult UI Border Beam Button',
      url: 'https://www.cult-ui.com/docs/components/border-beam-button',
    },
    usage: `import { BorderBeamButton } from "@/components/magicui/border-beam-button"

export default function Example() {
  return <BorderBeamButton>Deploy</BorderBeamButton>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('...props', 'ButtonHTMLAttributes<HTMLButtonElement>', '-', 'Native button props.'),
    ],
  }),
  createSample({
    slug: 'slide-arrow-button',
    categoryId: 'buttons',
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
      prop('primaryColor', 'string', '"#6f3cff"', 'Color used by the sliding background.'),
      prop('...props', 'ButtonHTMLAttributes<HTMLButtonElement>', '-', 'Native button props.'),
    ],
  }),
  createSample({
    slug: 'flower-menu',
    categoryId: 'fabs',
    title: 'Flower Menu',
    description: 'A radial floating action menu.',
    dependencies: ['motion', 'lucide-react'],
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
    slug: 'speed-dial',
    categoryId: 'fabs',
    title: 'Speed Dial',
    description: 'A stacked floating action menu.',
    dependencies: ['motion', 'lucide-react'],
    reference: {
      label: 'Animata Speed Dial',
      url: 'https://animata.design/docs/fabs/speed-dial',
    },
    usage: `import { SpeedDial } from "@/components/magicui/speed-dial"

export default function Example() {
  return <SpeedDial items={items} />
}`,
    props: [
      classNameProp,
      prop('items', 'SpeedDialItem[]', '-', 'Dial actions.'),
    ],
  }),
  createSample({
    slug: 'kinetic-center-build',
    categoryId: 'text',
    title: 'Kinetic Center Build',
    description: 'Text that builds into place from the center.',
    dependencies: ['motion'],
    reference: {
      label: 'Animata Kinetic Center Build',
      url: 'https://animata.design/docs/text/kinetic-center-build',
    },
    usage: `import { KineticCenterBuild } from "@/components/magicui/kinetic-center-build"

export default function Example() {
  return <KineticCenterBuild text="Kinetic" />
}`,
    props: [
      classNameProp,
      prop('text', 'string', '-', 'Text to animate.'),
    ],
  }),
  createSample({
    slug: 'text-flip',
    categoryId: 'text',
    title: 'Text Flip',
    description: 'A rotating word flip animation.',
    dependencies: ['motion'],
    reference: {
      label: 'Animata Text Flip',
      url: 'https://animata.design/docs/text/text-flip',
    },
    usage: `import { TextFlip } from "@/components/magicui/text-flip"

export default function Example() {
  return <TextFlip words={["Design", "Build", "Ship"]} />
}`,
    props: [
      classNameProp,
      prop('words', 'string[]', '-', 'Words to rotate.'),
      prop('interval', 'number', '1600', 'Flip interval in milliseconds.'),
    ],
  }),
  createSample({
    slug: 'cool-theme-toggle',
    categoryId: 'controls',
    title: 'Cool Theme Toggle',
    description: 'A playful sun and moon toggle.',
    dependencies: ['motion', 'lucide-react'],
    reference: {
      label: 'Lightswind Cool Theme Toggle',
      url: 'https://lightswind.com/components/cool-theme-toggle',
    },
    usage: `import { CoolThemeToggle } from "@/components/magicui/cool-theme-toggle"

export default function Example() {
  return <CoolThemeToggle />
}`,
    props: [
      classNameProp,
      prop('defaultDark', 'boolean', 'false', 'Initial dark state.'),
      prop('onChange', '(dark: boolean) => void', '-', 'Change handler.'),
    ],
  }),
  createSample({
    slug: 'toggle-theme',
    categoryId: 'controls',
    title: 'Toggle Theme',
    description: 'A minimal switch-style theme toggle.',
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
      prop('defaultChecked', 'boolean', 'false', 'Initial checked state.'),
      prop('onChange', '(checked: boolean) => void', '-', 'Change handler.'),
    ],
  }),
  createSample({
    slug: '3d-image-carousel',
    categoryId: 'media',
    title: '3D Image Carousel',
    description: 'A rotating perspective image carousel.',
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
      prop('interval', 'number', '2200', 'Auto-rotation interval.'),
    ],
  }),
  createSample({
    slug: '3d-image-slider',
    categoryId: 'media',
    title: '3D Image Slider',
    description: 'A perspective image slider with previous and next controls.',
    dependencies: ['lucide-react'],
    reference: {
      label: 'Lightswind 3D Image Slider',
      url: 'https://lightswind.com/components/3d-image-slider',
    },
    usage: `import { ThreeDImageSlider } from "@/components/magicui/3d-image-slider"

export default function Example() {
  return <ThreeDImageSlider items={items} />
}`,
    props: [
      classNameProp,
      prop('items', 'ThreeDImageSliderItem[]', '-', 'Images to show.'),
    ],
  }),
  createSample({
    slug: 'sparkle-cursor',
    categoryId: 'effects',
    title: 'Sparkle Cursor',
    description: 'A local cursor sparkle effect for a bounded surface.',
    dependencies: ['motion'],
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
    ],
  }),
  createSample({
    slug: 'stepper',
    categoryId: 'controls',
    title: 'Stepper',
    description: 'A horizontal stepper with selectable steps.',
    dependencies: ['lucide-react'],
    reference: {
      label: 'Lightswind Stepper',
      url: 'https://lightswind.com/components/stepper',
    },
    usage: `import { Stepper } from "@/components/magicui/stepper"

export default function Example() {
  return <Stepper steps={steps} />
}`,
    props: [
      classNameProp,
      prop('steps', 'StepperItem[]', '-', 'Steps to render.'),
      prop('defaultStep', 'number', '0', 'Initial active step index.'),
    ],
  }),
  createSample({
    slug: 'data-table',
    categoryId: 'data-display',
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
      <CircularGallery bend={0.25} textColor="#71717a" scrollSpeed={0.75} scrollEase={0.08} />
    </div>
  )
}`,
    props: [
      prop('items', '{ image: string; text: string }[]', 'built-in images', 'Gallery image and title items.'),
      prop('bend', 'number', '0.25', 'How strongly the gallery bends.'),
      prop('textColor', 'string', '"#71717a"', 'Caption color.'),
      prop('borderRadius', 'number', '0.05', 'Rounded image corner amount.'),
      prop('font', 'string', '"bold 30px Figtree"', 'Caption canvas font.'),
      prop('scrollSpeed', 'number', '0.75', 'Drag and wheel scroll speed.'),
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
    slug: 'glass-surface',
    categoryId: 'components',
    title: 'Glass Surface',
    description: 'A responsive liquid-glass container with SVG displacement fallback.',
    usage: `import { GlassSurface } from "@/components/magicui/glass-surface"

export default function Example() {
  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#8b5cf6,transparent_34%),radial-gradient(circle_at_80%_70%,#06b6d4,transparent_36%)]" />
      <GlassSurface width={300} height={120}>
        Glass Surface
      </GlassSurface>
    </div>
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
