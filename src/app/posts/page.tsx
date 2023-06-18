import FilterablePosts from '@/components/FilterablePosts';
import { getAllPosts } from '@/service/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Posts',
  description: '풀스택 관련 블로그 글',
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  // NOTE: 중복된 데이터 카테고리를 Set으로 정리
  const categories = [...new Set(posts.map((post) => post.category))];
  return <FilterablePosts posts={posts} categories={categories} />;
}