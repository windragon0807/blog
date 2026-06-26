export type ComponentCategoryId = 'components'

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
  slug: string
  categoryId: ComponentCategoryId
  title: string
  description: string
  status: 'Draft' | 'Ready'
  installCommand: string
  filePath: string
  preview: {
    kind: 'marquee' | 'icon-cloud' | 'lens' | 'pointer'
    label: string
  }
  registry?: ComponentRegistry
  code: string
  usage: string
  props: readonly ComponentProp[]
}

export const componentCategories: readonly ComponentCategory[] = [
  {
    id: 'components',
    name: 'Components',
    description: 'Magic UI style components ready for registry installs.',
  },
]

export const componentSamples: readonly ComponentSample[] = [
  {
    slug: 'marquee',
    categoryId: 'components',
    title: 'Marquee',
    description:
      'An infinite scrolling component that can display text, images, or videos.',
    status: 'Ready',
    installCommand: 'pnpm dlx shadcn@latest add https://ryong.dev/r/marquee.json',
    filePath: 'components/magicui/marquee.tsx',
    preview: {
      kind: 'marquee',
      label: 'Marquee',
    },
    registry: {
      name: 'marquee',
      url: '/r/marquee.json',
      dependencies: [],
    },
    code: `import { Marquee } from "@/components/magicui/marquee"

export function MarqueeDemo() {
  return (
    <Marquee pauseOnHover className="[--duration:20s]">
      <span>Next.js</span>
      <span>React</span>
      <span>TypeScript</span>
      <span>Tailwind CSS</span>
    </Marquee>
  )
}`,
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
      {
        name: 'className',
        type: 'string',
        defaultValue: '-',
        description: 'The class name to apply to the component.',
      },
      {
        name: 'reverse',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether to reverse the direction of the marquee.',
      },
      {
        name: 'pauseOnHover',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether to pause the marquee on hover.',
      },
      {
        name: 'vertical',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether to animate vertically.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        defaultValue: '-',
        description: 'The content to display in the marquee.',
      },
      {
        name: 'repeat',
        type: 'number',
        defaultValue: '4',
        description: 'The number of times to repeat the content.',
      },
    ],
  },
  {
    slug: 'icon-cloud',
    categoryId: 'components',
    title: 'Icon Cloud',
    description: 'An interactive 3D tag cloud component.',
    status: 'Ready',
    installCommand:
      'pnpm dlx shadcn@latest add https://ryong.dev/r/icon-cloud.json',
    filePath: 'components/magicui/icon-cloud.tsx',
    preview: {
      kind: 'icon-cloud',
      label: 'Icon Cloud',
    },
    registry: {
      name: 'icon-cloud',
      url: '/r/icon-cloud.json',
      dependencies: [],
    },
    code: `import { IconCloud } from "@/components/magicui/icon-cloud"

const images = ["typescript", "react", "nextdotjs"].map(
  (slug) => \`https://cdn.simpleicons.org/\${slug}/\${slug}\`
)

export function IconCloudDemo() {
  return <IconCloud images={images} />
}`,
    usage: `import { IconCloud } from "@/components/magicui/icon-cloud"

export default function Example() {
  return (
    <div className="relative overflow-hidden">
      <IconCloud images={images} />
    </div>
  )
}`,
    props: [
      {
        name: 'icons',
        type: 'React.ReactNode[]',
        defaultValue: '[]',
        description: 'Array of icons to render in the cloud.',
      },
      {
        name: 'images',
        type: 'string[]',
        defaultValue: '[]',
        description: 'Array of image URLs to render in the cloud.',
      },
    ],
  },
  {
    slug: 'lens',
    categoryId: 'components',
    title: 'Lens',
    description:
      'An interactive component that enables zooming into images, videos, and other elements.',
    status: 'Ready',
    installCommand: 'pnpm dlx shadcn@latest add https://ryong.dev/r/lens.json',
    filePath: 'components/magicui/lens.tsx',
    preview: {
      kind: 'lens',
      label: 'Lens',
    },
    registry: {
      name: 'lens',
      url: '/r/lens.json',
      dependencies: ['motion'],
    },
    code: `import { Lens } from "@/components/magicui/lens"

export function LensDemo() {
  return (
    <Lens zoomFactor={2} lensSize={150}>
      <img src="/images/lens-demo.jpg" alt="Lens demo" />
    </Lens>
  )
}`,
    usage: `import { Lens } from "@/components/magicui/lens"

export default function Example() {
  return (
    <Lens>
      <img src="/images/lens-demo.jpg" alt="Lens demo" />
    </Lens>
  )
}`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        defaultValue: '-',
        description: 'The content that will be magnified by the lens.',
      },
      {
        name: 'zoomFactor',
        type: 'number',
        defaultValue: '1.3',
        description: 'The magnification factor of the lens.',
      },
      {
        name: 'lensSize',
        type: 'number',
        defaultValue: '170',
        description: 'The size of the lens in pixels.',
      },
      {
        name: 'position',
        type: '{ x: number; y: number }',
        defaultValue: '-',
        description: 'The current position of the lens.',
      },
      {
        name: 'defaultPosition',
        type: '{ x: number; y: number }',
        defaultValue: '-',
        description: 'The initial position of the lens.',
      },
      {
        name: 'isStatic',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether the lens should remain fixed.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '0.1',
        description: 'Animation duration in seconds.',
      },
      {
        name: 'lensColor',
        type: 'string',
        defaultValue: '"black"',
        description: 'The color used by the mask.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: '"Zoom Area"',
        description: 'Accessible label for the lens region.',
      },
    ],
  },
  {
    slug: 'pointer',
    categoryId: 'components',
    title: 'Pointer',
    description: 'A component that displays a pointer when hovering over an element.',
    status: 'Ready',
    installCommand:
      'pnpm dlx shadcn@latest add https://ryong.dev/r/pointer.json',
    filePath: 'components/magicui/pointer.tsx',
    preview: {
      kind: 'pointer',
      label: 'Pointer',
    },
    registry: {
      name: 'pointer',
      url: '/r/pointer.json',
      dependencies: ['motion'],
    },
    code: `import { Pointer } from "@/components/magicui/pointer"

export function PointerDemo() {
  return (
    <div className="relative">
      <p>Hover this area</p>
      <Pointer />
    </div>
  )
}`,
    usage: `import { Pointer } from "@/components/magicui/pointer"

export default function Example() {
  return (
    <div className="relative">
      <Pointer />
    </div>
  )
}`,
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '-',
        description: 'Class name applied to the default pointer SVG.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        defaultValue: '-',
        description: 'Custom pointer content.',
      },
      {
        name: '...props',
        type: 'HTMLMotionProps<"div">',
        defaultValue: '-',
        description: 'Additional props passed to the animated pointer wrapper.',
      },
    ],
  },
]

export function getComponentSampleBySlug(slug: string) {
  return componentSamples.find((sample) => sample.slug === slug) ?? null
}
