import { Post } from '@/service/posts';
import PostCard from './PostCard';

type Props = { posts: Post[] };
export default function PostsGrid({ posts }: Props) {
  return (
    // NOTE_1, NOTE_2
    <ul className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {posts.map((post) => (
        <li key={post.path}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

/** [ NOTE_1 ]
 * map을 이용한 반복되는 컴포넌트 구조 => <ul>, <li> 사용
 */

/** [ NOTE_2 ]
 * Tailwind를 사용한 손쉬운 미디어쿼리 적용(sm, dm, lg)
 */