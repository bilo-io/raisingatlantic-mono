"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@raising-atlantic/ui';

interface MarkdownContentProps {
  children: string;
  className?: string;
}

/**
 * Single canonical markdown renderer for first-party content (blog posts,
 * legal documents). react-markdown sanitises by default; routing all
 * markdown rendering through this component means no caller can
 * accidentally introduce a dangerouslySetInnerHTML path.
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  if (!children) return null;
  return (
    <div className={cn('prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
