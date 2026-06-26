import type { ComponentSample } from './component-data'
import { ComponentPreviewContent } from './component-previews'

export function ComponentExampleTabs({
  sample,
}: {
  sample: ComponentSample
}) {
  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="mt-8"
    >
      <h2
        id="preview-heading"
        className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
      >
        Preview
      </h2>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="min-h-60 p-6">
          <div className="flex min-h-60 items-center justify-center overflow-hidden">
            <ComponentPreviewContent sample={sample} mode="interactive" />
          </div>
        </div>
      </div>
    </section>
  )
}
