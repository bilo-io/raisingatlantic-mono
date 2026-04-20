"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button, BlogForm, BlogPostFormValues, ManagementToolbar } from '@raising-atlantic/ui';
import { apiClient } from '@/lib/api/api-client';

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSubmit = async (values: BlogPostFormValues) => {
    try {
      setIsSaving(true);
      await apiClient.patch(`/blog/${id}`, values);
      router.push(`/dashboard/admin/blog/post/${id}`);
    } catch (error) {
      console.error('Failed to update blog post:', error);
      alert('Failed to update blog post. Please check your data.');
    } finally {
      setIsSaving(false);
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

  if (loading) return <div className="p-32 text-center text-muted-foreground">Loading editor...</div>;
  if (!post) return null;

  return (
    <div className="p-8 max-w-screen-2xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()} 
            className="rounded-full h-10 w-10 p-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
            <p className="text-muted-foreground text-sm">Update your content and metadata.</p>
          </div>
        </div>
        
        <div className="hidden md:block">
           <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            className="rounded-full px-6 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white"
          >
            Delete Post
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
        <BlogForm 
          initialValues={post} 
          onSubmit={handleSubmit} 
          isSaving={isSaving} 
        />
      </div>
    </div>
  );
}
