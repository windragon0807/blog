import { getFeaturedPosts } from '@/service/posts';
import PostsGrid from './PostsGrid';

export default async function FeaturedPosts() {
  const posts = await getFeaturedPosts();
  return (
    // NOTE_1
    <section className='my-4'>
      <h2 className='text-2xl font-bold my-2'>Featured Posts</h2>
      <PostsGrid posts={posts} />
    </section>
  );
}

/** [ NOTE_1 ]
 * div 대신 section 사용
 */