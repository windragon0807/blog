import { Meteors } from '@/components/meteors'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function MeteorsPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="ambient effect"
        title="Meteor Background"
        subtitle="streaks pass across the stage"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.28),transparent_55%)]"
        overlay={
          <Meteors
            number={mode === 'thumbnail' ? 8 : 22}
            className="text-sky-300 shadow-[0_0_0_1px_rgba(125,211,252,0.2)]"
          />
        }
      />
    </OuterEffectSurface>
  )
}
