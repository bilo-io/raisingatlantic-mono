"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useEffect } from "react";
import { cn } from "../lib/utils";
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Link as LinkIcon, Image as ImageIcon, Undo, Redo 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[400px] p-6 text-foreground",
          className
        ),
      },
    },
  });

  // Update content if value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/50 p-2 rounded-t-xl">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("bold") && "bg-muted text-primary")}
          type="button"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("italic") && "bg-muted text-primary")}
          type="button"
        >
          <Italic size={18} />
        </button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("heading", { level: 1 }) && "bg-muted text-primary")}
          type="button"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("heading", { level: 2 }) && "bg-muted text-primary")}
          type="button"
        >
          <Heading2 size={18} />
        </button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("bulletList") && "bg-muted text-primary")}
          type="button"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("orderedList") && "bg-muted text-primary")}
          type="button"
        >
          <ListOrdered size={18} />
        </button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <button
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={cn("p-2 rounded hover:bg-muted transition-colors", editor.isActive("link") && "bg-muted text-primary")}
          type="button"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-2 rounded hover:bg-muted transition-colors"
          type="button"
        >
          <ImageIcon size={18} />
        </button>
        <div className="flex-grow" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-muted transition-colors"
          type="button"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-muted transition-colors"
          type="button"
        >
          <Redo size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full border border-border rounded-xl bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
      <MenuBar />
      <EditorContent editor={editor} />
    </div>
  );
}
