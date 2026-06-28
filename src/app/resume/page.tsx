import type { Metadata } from 'next'
import { ResumeShell } from '@/features/resume/components/ResumeShell'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: '이력서',
    description:
      '정승룡 프론트엔드 개발자의 경력, 프로젝트, 기술 경험을 정리한 이력서입니다.',
    path: '/resume',
    imageTitle: '정승룡 이력서',
    tags: ['Resume', 'Frontend', 'React', 'Next.js'],
  }),
}

export default function ResumePage() {
  return <ResumeShell />
}
