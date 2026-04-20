'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    imageUrl: string;
    createdAt: string;
    synopsis: string;
  };
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
    >
      <Link href={`/blog/post/${post.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View post</span>
      </Link>

      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={post.imageUrl || '/assets/images/placeholder.jpg'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>5 min read</span>
          </div>
        </div>

        <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.shortDescription}
        </p>

        <div className="mt-auto flex items-center text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
          Read Full Story
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};
