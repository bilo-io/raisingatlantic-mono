"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./input";
import { Button } from "./button";
import { RichTextEditor } from "./RichTextEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Columns, Eye, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../lib/utils";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  shortDescription: z.string().min(1, "Short description is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  synopsis: z.string().min(1, "Synopsis is required"),
  body: z.string().min(1, "Body content is required"),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  initialValues?: Partial<BlogPostFormValues>;
  onSubmit: (values: BlogPostFormValues) => void;
  className?: string;
  isSaving?: boolean;
}

export function BlogForm({ initialValues, onSubmit, className, isSaving }: BlogFormProps) {
  const [viewMode, setViewMode] = React.useState<'editor' | 'split' | 'preview'>('split');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialValues?.title || "",
      slug: initialValues?.slug || "",
      shortDescription: initialValues?.shortDescription || "",
      imageUrl: initialValues?.imageUrl || "",
      synopsis: initialValues?.synopsis || "",
      body: initialValues?.body || "",
    },
  });

  const bodyValue = watch("body");
  const titleValue = watch("title");

  // Auto-generate slug from title if slug is empty
  React.useEffect(() => {
    if (titleValue && !initialValues?.slug) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, setValue, initialValues?.slug]);

  const showEditor = viewMode === 'editor' || viewMode === 'split';
  const showPreview = viewMode === 'preview' || viewMode === 'split';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col h-full", className)}>
      <Tabs defaultValue="meta" className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="meta" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-sm font-bold">
              Metadata
            </TabsTrigger>
            <TabsTrigger value="content" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-sm font-bold">
              Content Editor
            </TabsTrigger>
          </TabsList>
          
          <Button 
            type="submit" 
            disabled={isSaving} 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full font-bold transition-all shadow-lg shadow-primary/20"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <TabsContent value="meta" className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card/30 p-8 rounded-3xl border border-border/50">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Post Title</label>
              <Input 
                {...register("title")} 
                placeholder="e.g. The Future of Pediatric Health" 
                className="bg-muted/30 border-border/50 focus-visible:ring-primary/20 h-12"
              />
              {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Slug (URL Identifier)</label>
              <Input 
                {...register("slug")} 
                placeholder="the-future-of-pediatric-health" 
                className="bg-muted/30 border-border/50 focus-visible:ring-primary/20 h-12 font-mono text-sm"
              />
              {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="bg-card/30 p-8 rounded-3xl border border-border/50 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Featured Image URL</label>
              <Input 
                {...register("imageUrl")} 
                placeholder="https://images.unsplash.com/..." 
                className="bg-muted/30 border-border/50 focus-visible:ring-primary/20 h-12"
              />
              {errors.imageUrl && <p className="text-xs text-red-500 font-medium">{errors.imageUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Card Description</label>
              <textarea
                {...register("shortDescription")}
                className="w-full min-h-[100px] rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-sans"
                placeholder="A short punchy summary for the blog list cards..."
              />
              {errors.shortDescription && <p className="text-xs text-red-500 font-medium">{errors.shortDescription.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Article Synopsis (Intro Block)</label>
              <textarea
                {...register("synopsis")}
                className="w-full min-h-[120px] rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all italic text-foreground/80 leading-relaxed font-sans"
                placeholder="The opening statement that hooks the reader..."
              />
              {errors.synopsis && <p className="text-xs text-red-500 font-medium">{errors.synopsis.message}</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="flex-grow min-h-[700px] animate-in fade-in slide-in-from-right-4 duration-300 outline-none">
          <div className="flex items-center justify-end gap-2 mb-4 bg-muted/30 p-1.5 rounded-lg w-fit ml-auto">
            <button 
              type="button"
              onClick={() => setViewMode('editor')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'editor' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title="Editor Only"
            >
              <PenLine size={18} />
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('split')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'split' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title="Split View"
            >
              <Columns size={18} />
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('preview')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'preview' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title="Preview Only"
            >
              <Eye size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full relative overflow-hidden">
            <AnimatePresence mode="popLayout">
              {showEditor && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={cn(
                    "flex flex-col gap-2 overflow-hidden h-full",
                    viewMode === 'editor' ? "col-span-2" : "col-span-1"
                  )}
                >
                  <label className="text-sm font-bold text-foreground px-1 uppercase tracking-wider text-[10px]">Editor</label>
                  <RichTextEditor 
                    value={bodyValue} 
                    onChange={(val) => setValue("body", val, { shouldValidate: true })} 
                    placeholder="Unleash your creativity..."
                    className="flex-grow h-full min-h-[500px]"
                  />
                  {errors.body && <p className="text-xs text-red-500 font-medium px-1">{errors.body.message}</p>}
                </motion.div>
              )}

              {showPreview && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={cn(
                    "flex flex-col gap-2 overflow-hidden h-full",
                    viewMode === 'preview' ? "col-span-2" : "col-span-1"
                  )}
                >
                  <label className="text-sm font-bold text-foreground px-1 flex items-center justify-between uppercase tracking-wider text-[10px]">
                    Live Preview
                    <span className="text-[9px] text-muted-foreground bg-muted p-1 px-2 rounded font-mono">GFM Renderer</span>
                  </label>
                  <div className="flex-grow border border-border/50 rounded-xl bg-card/50 p-8 overflow-y-auto min-h-[500px] prose prose-lg dark:prose-invert max-w-none shadow-inner border-dashed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {bodyValue || "_Preview will appear here..._"}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
