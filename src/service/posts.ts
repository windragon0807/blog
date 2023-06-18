import { readFile } from 'fs/promises';
import path from 'path';
import { cache } from 'react';

export type Post = {
  title: string;
  description: string;
  date: Date;
  category: string;
  path: string;
  featured: boolean;
};

export type PostData = Post & {
  content: string;
  next: Post | null;
  prev: Post | null;
};

// NOTE: Next.js는 fetch는 동일한 요청에 대해 자동으로 중복 제거가 되어 딱 한 번만 요청을 하지만,
// NOTE: fetch가 아닌 DB에 접근하거나 파일을 읽는 함수는 아래와 같이 처리해줘야 한다.
// NOTE: "한 페이지 내에서 렌더링 되는 싸이클에 한해서만" 동일한 인자를 받는다면 캐시된 값을 반환한다.
export const getAllPosts = cache(async () => {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  return readFile(filePath, 'utf-8')
    // NOTE: (data) => JSON.parse(data) 생략 가능
    .then<Post[]>(JSON.parse)
    // NOTE: 오름차순 정렬
    .then((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)));
});

export async function getFeaturedPosts(): Promise<Post[]> {
  return getAllPosts()
    .then((posts) => posts.filter((post) => post.featured));
}

export async function getNonFeaturedPosts(): Promise<Post[]> {
  return getAllPosts()
    .then((posts) => posts.filter((post) => !post.featured));
}

export async function getPostData(fileName: string): Promise<PostData> {
  const posts = await getAllPosts();
  const post = posts.find((post) => post.path === fileName);
  
  if (!post) throw new Error(`${fileName}에 해당하는 포스트를 찾을 수 없음`);
  
  const filePath = path.join(process.cwd(), 'data', 'posts', `${fileName}.md`);
  const content = await readFile(filePath, 'utf-8');

  const index = posts.indexOf(post);
  const next = index > 0 ? posts[index - 1] : null;
  const prev = index < posts.length - 1 ? posts[index + 1] : null;

  return { ...post, content, next, prev };
}
