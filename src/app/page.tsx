import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* NOTE_1 */}
      {/* @ts-expect-error Server Component */}
      <FeaturedPosts />
    </>
  );
}

/** [ NOTE_1 ]
 * Next.js <-> TypeScript 간 호환성 문제 해결을 위한 주석처리
 */