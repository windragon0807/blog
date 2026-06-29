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

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_18px_46px_-36px_rgba(24,24,27,0.42)] dark:border-zinc-700/70 dark:bg-zinc-900/58 dark:shadow-[0_22px_54px_-38px_rgba(2,6,23,0.9)]">
        <div className="min-h-[28rem] rounded-[inherit]">
          <div className="flex min-h-[28rem] items-center justify-center overflow-hidden rounded-[inherit]">
            <ComponentPreviewContent sample={sample} mode="interactive" />
          </div>
        </div>
      </div>
    </section>
  )
}
