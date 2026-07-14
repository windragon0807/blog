import { IconCloud } from '@/components/icon-cloud'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

const iconCloudSlugs = [
  'typescript',
  'javascript',
  'react',
  'nextdotjs',
  'html5',
  'css3',
  'nodedotjs',
  'amazonaws',
  'postgresql',
  'firebase',
  'vercel',
  'testinglibrary',
  'jest',
  'cypress',
  'docker',
  'git',
  'github',
  'visualstudiocode',
  'figma',
]

const iconCloudImages = iconCloudSlugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
)

export function IconCloudPreview() {
  return (
    <PreviewDemoSurface
      label="content display"
      title="Rotating Icon Cloud"
      subtitle="drag the cloud of icons"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.24),transparent_55%)]"
    >
      <div className="relative flex size-72 items-center justify-center overflow-hidden">
        <IconCloud images={iconCloudImages} />
      </div>
    </PreviewDemoSurface>
  )
}
