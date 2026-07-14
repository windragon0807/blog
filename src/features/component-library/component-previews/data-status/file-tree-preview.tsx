import { Tree, type TreeViewElement } from '@/components/file-tree'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

const fileTreeElements: TreeViewElement[] = [
  {
    id: 'app',
    name: 'app',
    children: [
      {
        id: 'app-components',
        name: 'components',
        children: [
          { id: 'app-components-page', name: 'page.tsx' },
          { id: 'app-components-layout', name: 'layout.tsx' },
        ],
      },
      { id: 'app-globals', name: 'globals.css' },
    ],
  },
  {
    id: 'components',
    name: 'components',
    children: [
      { id: 'ripple-button', name: 'ripple-button.tsx' },
      { id: 'file-tree', name: 'file-tree.tsx' },
      { id: 'shiny-button', name: 'shiny-button.tsx' },
    ],
  },
  {
    id: 'lib',
    name: 'lib',
    children: [{ id: 'lib-utils', name: 'utils.ts' }],
  },
]

export function FileTreePreview() {
  return (
    <PreviewDemoSurface
      label="data structure"
      title="Collapsible File Tree"
      subtitle="browse nested files"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_55%)]"
    >
      <div className="relative h-[28rem] w-[min(34rem,90vw)] rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left text-base text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.26)] backdrop-blur">
        <Tree
          elements={fileTreeElements}
          initialSelectedId="file-tree"
          initialExpandedItems={['app', 'components']}
          className="h-full text-base"
        />
      </div>
    </PreviewDemoSurface>
  )
}
