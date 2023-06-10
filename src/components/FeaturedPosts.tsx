import { getFeaturedPosts } from '@/service/posts';
import PostsGrid from './PostsGrid';

export default async function FeaturedPosts() {
  const posts = await getFeaturedPosts();
  return (
    // NOTE: div 대신 section 사용
    <section className='m-4'>
      <h2 className='text-2xl font-bold my-2'>Featured Posts</h2>
      <PostsGrid posts={posts} />
    </section>
  );
}