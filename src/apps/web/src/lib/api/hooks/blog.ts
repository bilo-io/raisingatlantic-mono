'use client';

import { apiClient, createResourceHooks } from '@/lib/api';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  authorId?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const blogResource = createResourceHooks<
  BlogPost,
  void,
  Partial<BlogPost>,
  Partial<BlogPost>
>({
  resource: 'blog',
  baseUrl: '/blog',
  client: apiClient,
  copy: {
    create: { success: 'Post published' },
    update: { success: 'Post updated' },
    delete: { success: 'Post deleted' },
  },
});

export const {
  keys: blogKeys,
  useList: useBlogPosts,
  useGet: useBlogPost,
  useCreate: useCreateBlogPost,
  useUpdate: useUpdateBlogPost,
  useDelete: useDeleteBlogPost,
} = blogResource;
