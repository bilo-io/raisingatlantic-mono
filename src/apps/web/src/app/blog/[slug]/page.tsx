import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api/api-client';
import { BlogPostView } from '@/components/blog/BlogPostView';

async function getPost(slug: string) {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/v1/blog/slug/' + slug;
  
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `RaisingAtlantic | ${post.title}`,
    description: post.shortDescription,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);

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
