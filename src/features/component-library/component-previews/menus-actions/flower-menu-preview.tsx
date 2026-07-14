import {
  Copy,
  Download,
  Heart,
  PenLine,
  Settings,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react'
import { FlowerMenu } from '@/components/flower-menu'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

const actionItems = [
  { label: 'Edit', icon: <PenLine className="h-4 w-4" /> },
  { label: 'Copy', icon: <Copy className="h-4 w-4" /> },
  { label: 'Share', icon: <Share2 className="h-4 w-4" /> },
  { label: 'Save', icon: <Heart className="h-4 w-4" /> },
  { label: 'Upload', icon: <Upload className="h-4 w-4" /> },
  { label: 'Download', icon: <Download className="h-4 w-4" /> },
  { label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  { label: 'Delete', icon: <Trash2 className="h-4 w-4" /> },
]

export function FlowerMenuPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Radial Action Menu"
      subtitle="open radial actions"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.24),transparent_55%)]"
    >
      <FlowerMenu
        items={actionItems}
        variant="glass"
      />
    </PreviewDemoSurface>
  )
}
