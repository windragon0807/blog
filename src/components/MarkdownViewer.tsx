'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

// NOTE: 외부 라이브러리를 사용하는 부분은 컴포넌트로 따로 분리해서 관리하자!
export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      // https://tailwindcss.com/docs/typography-plugin
      // NOTE: Tailwind를 사용하면 기본적으로 모든 HTML 요소들이 CSS reset 처리가 되는데, 초기화 이전의 상태를 적용하려면 'prose' 속성을 추가해야 한다.
      className='prose max-w-none'
      remarkPlugins={[remarkGfm]}
      components={{
        // NOTE: (코드 복사) https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag='div'
              // NOTE: Markdown에서 사용하는 props과 SyntaxHighlighter에서 사용하는 prop이 달라서 발생하는 문제 => 정의되는 순서를 바꿔준다.
              {...props}
              style={materialDark}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // NOTE: markdown 이미지를 img 태그가 아닌 Next.js 이미지로 사용
        img: (image) => (
          <Image
            className='w-full max-h-60 object-cover'
            src={image.src || ''}
            alt={image.alt || ''}
            width={500}
            height={350}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}