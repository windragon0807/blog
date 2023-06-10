import FilterablePosts from '@/components/FilterablePosts';
import { getAllPosts } from '@/service/posts';

export default async function PostsPage() {
  const posts = await getAllPosts();
  // NOTE: 중복된 데이터 카테고리를 Set으로 정리
  const categories = [...new Set(posts.map((post) => post.category))];
  return <FilterablePosts posts={posts} categories={categories} />;
}