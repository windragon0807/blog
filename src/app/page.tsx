import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import CarouselPosts from '@/components/CarouselPosts';

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Next.js <-> TypeScript 간 호환성 문제 해결을 위한 주석처리 */}
      {/* @ts-expect-error Server Component */}
      <FeaturedPosts />
      {/* @ts-expect-error Server Component */}
      <CarouselPosts />
    </>
  );
}