import Link from 'next/link'
import {
  componentCategories,
  componentSamples,
  type ComponentSample,
} from './component-data'

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-[13px] leading-6 text-zinc-100 shadow-sm dark:border-zinc-800"
    >
      <code>{code}</code>
    </pre>
  )
}

function CopyButtonLabel() {
  return (
    <span className="ml-auto rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
      Copy
    </span>
  )
}

export function PreviewFrame({ sample }: { sample: ComponentSample }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_34%),linear-gradient(180deg,#fafafa,#f4f4f5)] p-6 dark:border-zinc-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.14),transparent_34%),linear-gradient(180deg,#111113,#09090b)]">
      <div className="flex min-h-60 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/72 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-950/58">
        <PreviewContent sample={sample} />
      </div>
    </div>
  )
}

function PreviewContent({ sample }: { sample: ComponentSample }) {
  switch (sample.preview.kind) {
    case 'button':
      return (
        <button
          type="button"
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-[0_16px_28px_-20px_rgba(24,24,27,0.8)] transition hover:-translate-y-0.5 dark:bg-zinc-100 dark:text-zinc-950"
        >
          {sample.preview.label}
        </button>
      )
    case 'surface':
      return (
        <div className="w-full max-w-sm rounded-xl border border-zinc-200/85 bg-white/82 p-4 shadow-sm backdrop-blur-md dark:border-zinc-700/70 dark:bg-zinc-900/70">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            Queue
          </p>
          <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {sample.preview.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Three component notes ready for review.
          </p>
        </div>
      )
    case 'navigation':
      return (
        <nav
          aria-label={sample.preview.label}
          className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          {['Action Button', 'Glass Surface', 'Status Notice'].map(
            (item, index) => (
              <a
                key={item}
                href="#preview"
                className={`block rounded-lg px-3 py-2 text-sm ${
                  index === 0
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                }`}
              >
                {item}
              </a>
            )
          )}
        </nav>
      )
    case 'feedback':
      return (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
          {sample.preview.label}
        </p>
      )
    case 'typography':
      return (
        <p className="bg-gradient-to-r from-zinc-950 via-indigo-600 to-rose-500 bg-clip-text text-5xl font-semibold tracking-normal text-transparent dark:from-zinc-50 dark:via-indigo-300 dark:to-rose-300">
          {sample.preview.label}
        </p>
      )
    case 'effect':
      return (
        <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
          />
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            Effect
          </p>
          <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {sample.preview.label}
          </p>
        </div>
      )
  }
}

export function ComponentSidebar() {
  return (
    <aside className="lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pr-4">
      <nav aria-label="Component categories" className="space-y-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Getting Started
          </p>
          <div className="mt-2 space-y-1">
            <Link
              href="/components"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Introduction
            </Link>
          </div>
        </div>

        {componentCategories.map((category) => {
          const samples = componentSamples.filter(
            (sample) => sample.categoryId === category.id
          )

          return (
            <div key={category.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                {category.name}
              </p>
              <div className="mt-2 space-y-1">
                {samples.map((sample) => (
                  <Link
                    key={sample.slug}
                    href={`/components/${sample.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    {sample.title}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export function InstallCommand({ command }: { command: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">
          &gt;_
        </span>
        <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          pnpm
        </span>
        <span className="text-sm font-medium text-zinc-500">npm</span>
        <span className="text-sm font-medium text-zinc-500">yarn</span>
        <span className="text-sm font-medium text-zinc-500">bun</span>
        <CopyButtonLabel />
      </div>
      <pre
        tabIndex={0}
        className="overflow-x-auto p-4 text-sm text-zinc-900 dark:text-zinc-100"
      >
        <code>{command}</code>
      </pre>
    </div>
  )
}

function PropsTable({ sample }: { sample: ComponentSample }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
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
    </div>
  )
}

export function ComponentSection({ sample }: { sample: ComponentSample }) {
  const categoryName = componentCategories.find(
    (category) => category.id === sample.categoryId
  )?.name

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
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {sample.status}
        </span>
      </div>

      <section id="preview" aria-labelledby="preview-heading" className="mt-8">
        <h2
          id="preview-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Preview
        </h2>
        <div className="mt-4">
          <PreviewFrame sample={sample} />
        </div>
      </section>

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
        <div className="flex items-center justify-between gap-3">
          <h2
            id="code-heading"
            className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
          >
            Code
          </h2>
          <p className="text-sm text-zinc-500">{sample.filePath}</p>
        </div>
        <div className="mt-4">
          <CodeBlock code={sample.code} />
        </div>
      </section>

      <section id="usage" aria-labelledby="usage-heading" className="mt-8">
        <h2
          id="usage-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Usage
        </h2>
        <div className="mt-4">
          <CodeBlock code={sample.usage} />
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
    </article>
  )
}
