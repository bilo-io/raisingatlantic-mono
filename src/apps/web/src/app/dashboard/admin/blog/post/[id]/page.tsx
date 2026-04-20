"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ManagementToolbar } from '@raising-atlantic/ui';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { apiClient } from '@/lib/api/api-client';

export default function BlogPostPreviewPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/blog/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      router.push('/dashboard/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiClient.delete(`/blog/${id}`);
      router.push('/dashboard/admin/blog');
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const handleTogglePublish = async () => {
    try {
      const response = await apiClient.patch(`/blog/${id}`, {
        isPublished: !post.isPublished
      });
      setPost(response.data);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-32 text-center text-muted-foreground">Loading preview...</div>;
  if (!post) return null;

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-8">
        <ManagementToolbar 
          onEdit={() => router.push(`/dashboard/admin/blog/post/${id}/edit`)}
          onDelete={handleDelete}
          onPublish={handleTogglePublish}
          onUnpublish={handleTogglePublish}
          onPreview={() => window.open(`/blog/post/${id}`, '_blank')}
          isPublished={post.isPublished}
          className="mb-8"
        />
        
        <div className="bg-card border border-border/50 rounded-[40px] overflow-hidden shadow-2xl shadow-primary/5">
          <BlogPostView post={post} />
        </div>
      </div>
    </div>
  );
}
