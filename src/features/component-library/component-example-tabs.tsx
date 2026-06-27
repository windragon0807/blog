import type { ComponentSample } from './component-data'
import { ComponentPreviewContent } from './component-previews'

export function ComponentExampleTabs({
  sample,
}: {
  sample: ComponentSample
}) {
  const flushPreview =
    sample.preview.kind === 'shine-border' ||
    sample.preview.kind === 'meteors' ||
    sample.preview.kind === 'confetti' ||
    sample.preview.kind === 'particles' ||
    sample.preview.kind === 'video-text' ||
    sample.preview.kind === 'stack' ||
    sample.preview.kind === 'background-boxes' ||
    sample.preview.kind === 'click-spark' ||
    sample.preview.kind === 'keyboard' ||
    sample.preview.kind === '3d-marquee' ||
    sample.preview.kind === 'sparkle-cursor' ||
    sample.preview.kind === 'mouse-invert-cursor' ||
    sample.preview.kind === 'mouse-trail-cursor' ||
    sample.preview.kind === 'mouse-ripple-cursor' ||
    sample.preview.kind === 'mouse-custom-cursor' ||
    sample.preview.kind === 'fairy-dust-cursor' ||
    sample.preview.kind === 'bubble-cursor' ||
    sample.preview.kind === 'character-cursor' ||
    sample.preview.kind === 'canvas-cursor' ||
    sample.preview.kind === 'fluid-cursor' ||
    sample.preview.kind === '3d-image-carousel' ||
    sample.preview.kind === 'data-table'

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
        <div className={flushPreview ? 'min-h-60 rounded-[inherit]' : 'min-h-60 p-6'}>
          <div
            className={`flex min-h-60 items-center justify-center overflow-hidden ${
              flushPreview ? 'rounded-[inherit]' : ''
            }`}
          >
            <ComponentPreviewContent sample={sample} mode="interactive" />
          </div>
        </div>
      </div>
    </section>
  )
}
