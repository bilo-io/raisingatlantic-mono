"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";
import { Edit, Eye, Save, X, Trash2, Send, RotateCcw } from "lucide-react";

interface ManagementToolbarProps {
  className?: string;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onPreview?: () => void;
  isEditing?: boolean;
  isPublished?: boolean;
  isSaving?: boolean;
}

export function ManagementToolbar({
  className,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onPublish,
  onUnpublish,
  onPreview,
  isEditing,
  isPublished,
  isSaving,
}: ManagementToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-4 z-50 flex items-center justify-between rounded-2xl border border-white/20 bg-black/40 p-4 shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {isEditing ? (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-none"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="bg-white/10 text-white hover:bg-white/20 border-border/50"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Button>
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreview}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Public
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isEditing && (
          <>
            {isPublished ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onUnpublish}
                className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Unpublish
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onPublish}
                className="bg-blue-600 hover:bg-blue-700 text-white border-none"
              >
                <Send className="mr-2 h-4 w-4" />
                Publish
              </Button>
            )}
          </>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border-red-500/30"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
