import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api/api-client';
import { BlogPostView } from '@/components/blog/BlogPostView';

async function getPost(id: string) {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/v1/blog/' + id;
  
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch blog post with ID ${id}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `RaisingAtlantic | ${post.title}`,
    description: post.shortDescription,
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/blog" 
          className="mb-8 flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
        
        <BlogPostView post={post} />
      </div>
    </div>
  );
}
