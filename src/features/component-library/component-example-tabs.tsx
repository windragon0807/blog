import type { ComponentPreviewKind, ComponentSample } from './component-data'
import { ComponentPreviewContent } from './component-previews'

const fullBleedPreviewKinds: readonly ComponentPreviewKind[] = [
  'shine-border',
  'meteors',
  'particles',
  'background-boxes',
  'keyboard',
  'placeholders-and-vanish-input',
  'gooey-input',
  '3d-marquee',
  'avatar-group',
  'playful-todolist',
  'slide-arrow-button',
  'flower-menu',
  'text-flip',
  'toggle-theme',
  '3d-image-carousel',
  'sparkle-cursor',
  'mouse-invert-cursor',
  'mouse-trail-cursor',
  'mouse-ripple-cursor',
  'mouse-custom-cursor',
  'fairy-dust-cursor',
  'bubble-cursor',
  'character-cursor',
  'canvas-cursor',
  'fluid-cursor',
]

export function ComponentExampleTabs({
  sample,
}: {
  sample: ComponentSample
}) {
  const isFullBleedPreview = fullBleedPreviewKinds.includes(sample.preview.kind)

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
        <div className={isFullBleedPreview ? 'min-h-60 rounded-[inherit]' : 'min-h-60 p-6'}>
          <div
            className={`flex min-h-60 items-center justify-center overflow-hidden ${
              isFullBleedPreview ? 'rounded-[inherit]' : ''
            }`}
          >
            <ComponentPreviewContent sample={sample} mode="interactive" />
          </div>
        </div>
      </div>
    </section>
  )
}
