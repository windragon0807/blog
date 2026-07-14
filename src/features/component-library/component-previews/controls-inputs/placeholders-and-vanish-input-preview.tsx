import { PlaceholdersAndVanishInput } from '@/components/placeholders-and-vanish-input'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function PlaceholdersAndVanishInputPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Vanish Input"
      subtitle="submit to collapse the search"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.26),transparent_55%)]"
    >
      <PlaceholdersAndVanishInput
        variant="glass"
        className="max-w-md"
        placeholders={['Search components', 'Ask about registry', 'Find animations']}
      />
    </PreviewDemoSurface>
  )
}
