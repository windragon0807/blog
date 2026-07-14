import { CharacterCursor } from '@/components/character-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function CharacterCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="character-cursor"
      title="Character Particle Cursor"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(167,85,194,0.3),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <CharacterCursor disabled={mode === 'thumbnail'}>
          <PreviewDemoSurface
            label="cursor effect"
            title="Characters"
            subtitle="characters under your control"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(167,85,194,0.3),transparent_55%)]"
          />
        </CharacterCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
