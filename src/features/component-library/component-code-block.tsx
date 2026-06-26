import { HighlightedCodeBlock } from '@/components/code/HighlightedCodeBlock'

export function CodeBlock({
  code,
  language = 'typescript',
  blockId = 'component-code',
}: {
  code: string
  language?: string
  blockId?: string
}) {
  return (
    <HighlightedCodeBlock
      blockId={blockId}
      code={code}
      language={language}
      variant="embedded"
    />
  )
}
