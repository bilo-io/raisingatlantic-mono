"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button, BlogForm, BlogPostFormValues } from '@raising-atlantic/ui';
import { apiClient } from '@/lib/api/api-client';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: BlogPostFormValues) => {
    try {
      setIsSaving(true);
      const response = await apiClient.post('/blog', values);
      router.push(`/dashboard/admin/blog/post/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create blog post:', error);
      alert('Failed to create blog post. Please check your data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-screen-2xl mx-auto space-y-8 pb-32">
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
          <h1 className="text-3xl font-bold text-foreground">Write New Post</h1>
          <p className="text-muted-foreground text-sm">Share your expertise with the Raising Atlantic community.</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
        <BlogForm onSubmit={handleSubmit} isSaving={isSaving} />
      </div>
    </div>
  );
}
