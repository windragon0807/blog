export type ComponentCategoryId =
  | 'core'
  | 'surfaces'
  | 'navigation'
  | 'feedback'
  | 'typography'
  | 'effects'

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

export interface ComponentSample {
  slug: string
  categoryId: ComponentCategoryId
  title: string
  description: string
  status: 'Draft' | 'Ready'
  installCommand: string
  filePath: string
  preview: {
    kind:
      | 'button'
      | 'surface'
      | 'navigation'
      | 'feedback'
      | 'typography'
      | 'effect'
    label: string
  }
  code: string
  usage: string
  props: readonly ComponentProp[]
}

export const componentCategories: readonly ComponentCategory[] = [
  {
    id: 'core',
    name: 'Core',
    description: 'Reusable primitives for direct user actions.',
  },
  {
    id: 'surfaces',
    name: 'Surfaces',
    description: 'Containers for cards, panels, and document blocks.',
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Controls that move between pages or sections.',
  },
  {
    id: 'feedback',
    name: 'Feedback',
    description: 'Status, empty, and progress communication.',
  },
  {
    id: 'typography',
    name: 'Typography',
    description: 'Text treatments used for hierarchy and emphasis.',
  },
  {
    id: 'effects',
    name: 'Effects',
    description: 'Small visual effects that can be copied into products.',
  },
]

export const componentSamples: readonly ComponentSample[] = [
  {
    slug: 'action-button',
    categoryId: 'core',
    title: 'Action Button',
    description: 'A compact command button for primary actions in blog tools.',
    status: 'Ready',
    installCommand: 'pnpm dlx shadcn@latest add @ryong/action-button',
    filePath: 'components/ryong/action-button.tsx',
    preview: {
      kind: 'button',
      label: 'Publish note',
    },
    code: `import { Button } from "@/components/ui/button"

export function ActionButton() {
  return (
    <Button className="rounded-lg px-4">
      Publish note
    </Button>
  )
}`,
    usage: `import { ActionButton } from "@/components/ryong/action-button"

export default function Example() {
  return <ActionButton />
}`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        defaultValue: '-',
        description: 'Button label or composed content.',
      },
      {
        name: 'variant',
        type: '"default" | "subtle" | "glass"',
        defaultValue: '"default"',
        description: 'Visual emphasis for the action.',
      },
    ],
  },
  {
    slug: 'glass-surface',
    categoryId: 'surfaces',
    title: 'Glass Surface',
    description: 'A restrained translucent panel for dense blog UI sections.',
    status: 'Ready',
    installCommand: 'pnpm dlx shadcn@latest add @ryong/glass-surface',
    filePath: 'components/ryong/glass-surface.tsx',
    preview: {
      kind: 'surface',
      label: 'Reading queue',
    },
    code: `import { cn } from "@/lib/utils"

export function GlassSurface({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/85 bg-white/80 shadow-sm backdrop-blur-md",
        "dark:border-zinc-700/70 dark:bg-zinc-900/70",
        className
      )}
      {...props}
    />
  )
}`,
    usage: `<GlassSurface className="p-4">
  <p>Reading queue</p>
</GlassSurface>`,
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '-',
        description: 'Additional classes merged onto the surface.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Adds hover treatment for clickable surfaces.',
      },
    ],
  },
  {
    slug: 'component-nav',
    categoryId: 'navigation',
    title: 'Component Nav',
    description: 'A compact sidebar list for component documentation pages.',
    status: 'Draft',
    installCommand: 'pnpm dlx shadcn@latest add @ryong/component-nav',
    filePath: 'components/ryong/component-nav.tsx',
    preview: {
      kind: 'navigation',
      label: 'Components',
    },
    code: `const items = ["Action Button", "Glass Surface", "Status Notice"]

export function ComponentNav() {
  return (
    <nav aria-label="Components">
      {items.map((item) => (
        <a key={item} href="#" className="block rounded-md px-3 py-2 text-sm">
          {item}
        </a>
      ))}
    </nav>
  )
}`,
    usage: `<ComponentNav />`,
    props: [
      {
        name: 'items',
        type: 'ComponentNavItem[]',
        defaultValue: '[]',
        description: 'Sidebar entries grouped by category.',
      },
    ],
  },
  {
    slug: 'status-notice',
    categoryId: 'feedback',
    title: 'Status Notice',
    description: 'A small notice block for save, sync, and generation states.',
    status: 'Ready',
    installCommand: 'pnpm dlx shadcn@latest add @ryong/status-notice',
    filePath: 'components/ryong/status-notice.tsx',
    preview: {
      kind: 'feedback',
      label: 'Registry ready',
    },
    code: `export function StatusNotice() {
  return (
    <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      Registry ready
    </p>
  )
}`,
    usage: `<StatusNotice />`,
    props: [
      {
        name: 'tone',
        type: '"info" | "success" | "warning"',
        defaultValue: '"info"',
        description: 'Color system for the notice.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        defaultValue: '-',
        description: 'Notice message.',
      },
    ],
  },
  {
    slug: 'gradient-heading',
    categoryId: 'typography',
    title: 'Gradient Heading',
    description: 'A display heading treatment for named product surfaces.',
    status: 'Draft',
    installCommand: 'pnpm dlx shadcn@latest add @ryong/gradient-heading',
    filePath: 'components/ryong/gradient-heading.tsx',
    preview: {
      kind: 'typography',
      label: 'ryong.ui',
    },
    code: `export function GradientHeading() {
  return (
    <h2 className="bg-gradient-to-r from-zinc-950 via-indigo-600 to-rose-500 bg-clip-text text-4xl font-semibold text-transparent">
      ryong.ui
    </h2>
  )
}`,
    usage: `<GradientHeading />`,
    props: [
      {
        name: 'as',
        type: '"h1" | "h2" | "h3"',
        defaultValue: '"h2"',
        description: 'Semantic heading element.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        defaultValue: '-',
        description: 'Heading content.',
      },
    ],
  },
  {
    slug: 'border-beam',
    categoryId: 'effects',
    title: 'Border Beam',
    description: 'A quiet moving border accent for featured cards.',
    status: 'Draft',
    installCommand: 'pnpm dlx shadcn@latest add @ryong/border-beam',
    filePath: 'components/ryong/border-beam.tsx',
    preview: {
      kind: 'effect',
      label: 'Preview',
    },
    code: `export function BorderBeamCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      <p>Preview</p>
    </div>
  )
}`,
    usage: `<BorderBeamCard />`,
    props: [
      {
        name: 'active',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Controls whether the accent is visible.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '6',
        description: 'Animation duration in seconds.',
      },
    ],
  },
]

export function getComponentSampleBySlug(slug: string) {
  return componentSamples.find((sample) => sample.slug === slug) ?? null
}
