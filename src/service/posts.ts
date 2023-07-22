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

// 한 페이지 내 렌더링 되는 사이클에서 동일한 인자를 받으면 캐시된 값을 반환
export const getAllPosts = cache(async () => {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  return readFile(filePath, 'utf-8')
    // (data) => JSON.parse(data) 축약
    .then<Post[]>(JSON.parse)
    // 오름차순 정렬
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
