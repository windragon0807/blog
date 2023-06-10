import { Post } from '@/service/posts';
import PostCard from './PostCard';

type Props = { posts: Post[] };
export default function PostsGrid({ posts }: Props) {
  return (
    <ul className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {/* NOTE: map을 이용한 반복되는 컴포넌트 구조 => <ul>, <li> 사용 */}
      {posts.map((post) => (
        <li key={post.path}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}