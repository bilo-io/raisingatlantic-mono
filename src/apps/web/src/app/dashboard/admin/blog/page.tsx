"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Button, ManagementToolbar, cn } from '@raising-atlantic/ui';
import { apiClient } from '@/lib/api/api-client';
import { format } from 'date-fns';

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/blog/admin/all');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch admin blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'published' && post.isPublished) || 
      (statusFilter === 'draft' && !post.isPublished);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiClient.delete(`/blog/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const togglePublish = async (post: any) => {
    try {
      const response = await apiClient.patch(`/blog/${post.id}`, {
        isPublished: !post.isPublished
      });
      setPosts(posts.map(p => p.id === post.id ? response.data : p));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage your clinical insights.</p>
        </div>
        <Link href="/dashboard/admin/blog/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 flex items-center gap-2">
            <Plus size={18} />
            Write New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 flex items-center gap-4 bg-card border border-border/50 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search posts by title..." 
            className="flex-grow bg-transparent border-none outline-none text-sm py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/50 rounded-2xl px-4 py-2">
          <Filter className="text-muted-foreground" size={18} />
          <select 
            className="bg-transparent border-none outline-none text-sm py-2 flex-grow cursor-pointer"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="group relative bg-card border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/dashboard/admin/blog/post/${post.id}/edit`}>
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm">
                    <Edit size={14} />
                  </Button>
                </Link>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    post.isPublished 
                      ? "bg-green-500/10 text-green-600" 
                      : "bg-amber-500/10 text-amber-600"
                  )}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow mb-6">
                  {post.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <Link href={`/dashboard/admin/blog/post/${post.id}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <Eye size={14} />
                    Preview
                  </Link>
                  <button 
                    onClick={() => togglePublish(post)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {post.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border py-32 text-center bg-muted/20">
          <h2 className="text-2xl font-semibold text-muted-foreground">No posts found.</h2>
          <p className="mt-2 text-muted-foreground">Try adjusting your filters or create a new post.</p>
          <Link href="/dashboard/admin/blog/new">
            <Button variant="outline" className="mt-6 rounded-full">Write your first post</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
