"use client";

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@raising-atlantic/ui';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Custom Markdown Display for the body
const MarkdownDisplay = ({ markdownContent }: { markdownContent: string }) => {
  if (!markdownContent) return null;
  
  return (
    <div className="markdown-content prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

interface BlogPostViewProps {
  post: any;
  className?: string;
}

export function BlogPostView({ post, className }: BlogPostViewProps) {
  if (!post) return null;

  return (
    <article className={cn("min-h-screen bg-background pb-32", className)}>
      {/* Hero Header */}
      <header className="relative h-[50vh] min-h-[400px] w-full overflow-hidden rounded-3xl">
        <Image
          src={post.imageUrl || '/assets/images/placeholder-blog.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="container relative flex h-full flex-col justify-end pb-12 px-8">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
              <button className="flex items-center gap-2 transition-colors hover:text-white">
                <Share2 className="h-4 w-4" />
                <span>Share Post</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl mt-16 px-4">
        {post.synopsis && (
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 italic text-foreground/80 lg:p-12 mb-16 shadow-inner">
            <p className="text-xl leading-relaxed">
              &quot;{post.synopsis}&quot;
            </p>
          </div>
        )}
        
        <div className="mt-16">
          <MarkdownDisplay markdownContent={post.body} />
        </div>
        
        <hr className="my-20 border-border/30" />
        
        <footer className="flex flex-col gap-8 rounded-3xl bg-card p-8 lg:p-12 border border-border/50 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center p-2">
              <Image 
                src="/assets/images/app-icon.svg" 
                alt="Raising Atlantic Team" 
                width={40} 
                height={40} 
                className="object-contain"
              />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Raising Atlantic Editorial Team</h4>
              <p className="text-muted-foreground text-sm">Clinically-focused insights for modern South African families.</p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
