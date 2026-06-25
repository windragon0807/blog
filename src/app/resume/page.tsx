import type { Metadata } from 'next'
import { ResumeShell } from '@/features/resume/components/ResumeShell'

export const metadata: Metadata = {
  title: '이력서',
  description: '정승룡 프론트엔드 개발자 이력서',
  alternates: {
    canonical: '/resume',
  },
}

export default function ResumePage() {
  return <ResumeShell />
}
