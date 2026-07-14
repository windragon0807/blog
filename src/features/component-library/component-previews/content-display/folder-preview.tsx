import { Folder } from '@/components/folder'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { folderPreviewColor } from '../shared/preview-tokens'

export function FolderPreview() {
  return (
    <PreviewDemoSurface
      label="content stack"
      title="Expandable Folder"
      subtitle="click to open stacked items"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.2),transparent_55%)]"
    >
      <div className="mt-16 md:mt-20">
        <Folder
          color={folderPreviewColor}
          paperVariant="glass"
          size={1.2}
          items={[
            <div key="one" className="h-full rounded-md border border-white/15 bg-white/[0.08]" />,
            <div key="two" className="h-full rounded-md border border-white/15 bg-white/[0.08]" />,
            <div key="three" className="h-full rounded-md border border-white/15 bg-white/[0.08]" />,
          ]}
        />
      </div>
    </PreviewDemoSurface>
  )
}
