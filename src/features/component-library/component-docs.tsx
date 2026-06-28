import { componentCategories, type ComponentSample } from './component-data'
import { CodeBlock } from './component-code-block'
import { ComponentExampleTabs } from './component-example-tabs'
import { ComponentPreviewContent } from './component-previews'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  InstallCommandTabs,
  type InstallCommandPanel,
  type PackageManager,
} from './install-command-tabs'

type PreviewMode = 'interactive' | 'thumbnail'

export function PreviewFrame({
  sample,
  mode = 'interactive',
}: {
  sample: ComponentSample
  mode?: PreviewMode
}) {
  return (
    <div
      aria-hidden={mode === 'thumbnail' ? true : undefined}
      className="rounded-2xl border border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_34%),linear-gradient(180deg,#fafafa,#f4f4f5)] p-6 dark:border-zinc-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.14),transparent_34%),linear-gradient(180deg,#111113,#09090b)]"
    >
      <div className="flex min-h-60 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/72 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-950/58">
        <ComponentPreviewContent sample={sample} mode={mode} />
      </div>
    </div>
  )
}

export function InstallCommand({ command }: { command: string }) {
  const target = getInstallTarget(command)
  const panels: InstallCommandPanel[] = packageManagers.map((manager) => {
    const installCommand = getPackageManagerCommand(manager, target)

    return {
      manager,
      command: installCommand,
      panel: (
        <CodeBlock
          blockId={`install-${manager}-${target}`}
          code={installCommand}
          language="bash"
        />
      ),
    }
  })

  return <InstallCommandTabs panels={panels} />
}

const packageManagers: readonly PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']

function getInstallTarget(command: string) {
  return command.match(/\sadd\s+(.+)$/)?.[1] ?? command
}

function getPackageManagerCommand(manager: PackageManager, target: string) {
  switch (manager) {
    case 'pnpm':
      return `pnpm dlx shadcn@latest add ${target}`
    case 'npm':
      return `npx shadcn@latest add ${target}`
    case 'yarn':
      return `yarn dlx shadcn@latest add ${target}`
    case 'bun':
      return `bunx shadcn@latest add ${target}`
  }
}

function PropsTable({ sample }: { sample: ComponentSample }) {
  return (
    <ScrollArea
      orientation="horizontal"
      className="custom-scrollbar rounded-xl border border-zinc-200 dark:border-zinc-800"
    >
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left dark:border-zinc-800 dark:bg-zinc-900/70">
            <th className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
              Prop
            </th>
            <th className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
              Type
            </th>
            <th className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
              Default
            </th>
            <th className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {sample.props.map((prop) => (
            <tr
              key={prop.name}
              className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
            >
              <td className="px-3 py-2 font-mono text-xs text-zinc-900 dark:text-zinc-100">
                {prop.name}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                {prop.type}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-zinc-500">
                {prop.defaultValue}
              </td>
              <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}

export function ComponentSection({ sample }: { sample: ComponentSample }) {
  const categoryName = componentCategories.find(
    (category) => category.id === sample.categoryId
  )?.name
  const codeSectionBlock = (
    <CodeBlock
      blockId={`component-${sample.slug}-code`}
      code={sample.usage}
      language="typescript"
    />
  )

  return (
    <article className="pb-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-500">{categoryName}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            {sample.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {sample.description}
          </p>
        </div>
      </div>

      <ComponentExampleTabs sample={sample} />

      <section
        id="installation"
        aria-labelledby="installation-heading"
        className="mt-8"
      >
        <h2
          id="installation-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Installation
        </h2>
        <div className="mt-4">
          <InstallCommand command={sample.installCommand} />
        </div>
      </section>

      <section id="code" aria-labelledby="code-heading" className="mt-8">
        <h2
          id="code-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Code
        </h2>
        <div className="code-section-block-shell mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          {codeSectionBlock}
        </div>
      </section>

      <section id="props" aria-labelledby="props-heading" className="mt-8">
        <h2
          id="props-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Props
        </h2>
        <div className="mt-4">
          <PropsTable sample={sample} />
        </div>
      </section>

      <section id="reference" aria-labelledby="reference-heading" className="mt-8">
        <h2
          id="reference-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Reference
        </h2>
        <a
          href={sample.reference.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-medium text-[var(--theme-accent-current)] underline underline-offset-4 transition-opacity hover:opacity-75"
        >
          {sample.reference.label}
        </a>
      </section>
    </article>
  )
}
