import { componentCategories, type ComponentSample } from './component-data'
import { CodeBlock } from './component-code-block'
import { ComponentExampleTabs } from './component-example-tabs'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import {
  InstallCommandTabs,
  type InstallCommandPanel,
  type PackageManager,
} from './install-command-tabs'

function InstallCommand({ command }: { command: string }) {
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

type PropsTableRow = {
  prop: string
  type: string
  defaultValue: string
  description: string
}

const propsTableColumns: readonly DataTableColumn<PropsTableRow>[] = [
  { key: 'prop', header: 'Prop', width: 'minmax(9rem, 0.9fr)' },
  { key: 'type', header: 'Type', width: 'minmax(18rem, 1.3fr)' },
  { key: 'defaultValue', header: 'Default', width: 'minmax(8rem, 0.65fr)' },
  {
    key: 'description',
    header: 'Description',
    width: 'minmax(20rem, 1.65fr)',
  },
]

const propsTableClassName = [
  'component-props-table rounded-[28px] bg-transparent p-0 text-sm dark:bg-transparent',
  '[&_table]:min-w-[880px]',
  '[&_table]:!bg-zinc-100/95 dark:[&_table]:border-zinc-800/90 dark:[&_table]:!bg-zinc-950/88',
  '[&_tbody]:!bg-white/86 dark:[&_tbody]:!bg-zinc-900/68',
  '[&_tbody_tr]:!bg-white/72 [&_tbody_tr:hover]:!bg-zinc-100/90',
  'dark:[&_tbody_tr]:!bg-white/[0.035] dark:[&_tbody_tr:hover]:!bg-white/[0.085]',
  '[&_tbody_td:nth-child(-n+3)]:whitespace-nowrap',
  '[&_tbody_td:nth-child(-n+3)]:font-mono',
  '[&_tbody_td:nth-child(-n+3)]:text-sm',
  '[&_tbody_td]:align-top',
  '[&_tbody_td]:leading-6',
  '[&_tbody_td:first-child]:text-base',
].join(' ')

function PropsTable({ sample }: { sample: ComponentSample }) {
  const rows = sample.props.map((prop) => ({
    prop: prop.name,
    type: prop.type,
    defaultValue: prop.defaultValue,
    description: prop.description,
  }))

  return (
    <DataTable
      columns={propsTableColumns}
      rows={rows}
      className={propsTableClassName}
    />
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
        <div className="code-section-block-shell mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_18px_46px_-36px_rgba(24,24,27,0.42)] dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:shadow-[0_22px_54px_-38px_rgba(2,6,23,0.9)]">
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
