import { HighlightedCodeBlock } from '@/components/code/HighlightedCodeBlock';
import type { RichText } from '@/types/notion';

interface Props {
  blockId: string;
  code: string;
  language: string;
  caption: RichText[];
}

export async function CodeBlock({ blockId, code, language, caption }: Props) {
  return (
    <HighlightedCodeBlock
      blockId={blockId}
      code={code}
      language={language}
      caption={caption}
      variant="post"
    />
  );
}
