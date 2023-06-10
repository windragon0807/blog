import { Post } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';

type Props = { post: Post };
export default function PostCard({
  post: { title, description, date, category, path },
}: Props) {
  return (
    <Link href={`/posts/${path}`}>
      {/* NOTE: 같은 의미 단위 묶음 => <article> 사용 */}
      <article className='rounded-md overflow-hidden shadow-md hover:shadow-xl'>
        <Image
          className='w-full'
          src={`/images/posts/${path}.png`}
          alt={title}
          width={300}
          height={200}
        />
        <div className='flex flex-col items-center p-4'>
          {/* NOTE: 시간 및 일자 표현 => <time> 사용 */}
          <time className='self-end text-gray-700'>{date.toString()}</time>
          {/* NOTE: 제목 => <h3> 사용 */}
          <h3 className='text-lg font-bold'>{title}</h3>
          {/* NOTE: 메인 설명 => <p> 사용 */}
          <p className='w-full truncate text-center'>{description}</p>
          {/* NOTE: 꾸며진 단어 단위 => <span> 사용 */}
          <span className='text-sm rounded-lg bg-green-100 px-2 my-2'>
            {category}
          </span>
        </div>
      </article>
    </Link>
  );
}