import React from 'react';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogCard } from '@/components/blog/BlogCard';
import { apiClient } from '@/lib/api/api-client';

async function getPosts() {
  try {
    const response = await apiClient.get('/blog');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export const metadata = {
  title: 'RaisingAtlantic | Blog',
  description: 'Expert insights into child development and digitized healthcare for South African families.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="flex-grow flex flex-col">
      <BlogHero />
      
      <section className="container mx-auto pb-32 px-4 max-w-screen-2xl">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border py-32 text-center">
            <h2 className="text-2xl font-semibold text-muted-foreground">No stories yet.</h2>
            <p className="mt-2 text-muted-foreground">Check back soon for new insights.</p>
          </div>
        )}
      </section>
    </div>
  );
}
