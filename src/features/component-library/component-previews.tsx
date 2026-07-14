'use client'

import type { ComponentSample } from './component-data'
import { renderComponentPreview } from './component-previews/registry'
import type { PreviewMode } from './component-previews/types'

function BasePreviewContent({
  sample,
  mode,
}: {
  sample: ComponentSample
  mode: PreviewMode
}) {
  const content = renderComponentPreview(sample.preview.kind, mode)

  return content
}

export function ComponentPreviewContent({
  sample,
  mode,
}: {
  sample: ComponentSample
  mode: PreviewMode
}) {
  return <BasePreviewContent sample={sample} mode={mode} />
}
