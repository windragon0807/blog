import type { Metadata } from 'next'
import { ResumeReadableView } from '@/features/resume/components/ResumeReadableView'

export const metadata: Metadata = {
  title: '읽기용 이력서',
  description: '정승룡 프론트엔드 개발자 읽기용 이력서',
  alternates: {
    canonical: '/resume/readable',
  },
}

export const dynamic = 'force-dynamic'

export default function ResumeReadablePage() {
  return <ResumeReadableView />
}
