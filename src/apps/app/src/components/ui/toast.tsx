
"use client";

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        info: "border-blue-500/50 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
        success: "border-green-500/50 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
        warning: "border-yellow-500/50 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
        error: "border-destructive/50 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const typeIcon: { [key: string]: React.ElementType } = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const iconColorClasses: { [key: string]: string } = {
    success: "text-green-500",
    error: "text-destructive",
    warning: "text-yellow-500",
    info: "text-blue-500",
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  id: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose: (id: string) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, id, type, title, description, onClose, ...props }, ref) => {
    const Icon = type ? typeIcon[type] : null;

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant: type as any }), className)}
        {...props}
      >
        {Icon && <Icon className={cn("h-6 w-6 shrink-0", iconColorClasses[type!])} />}
        <div className="grid flex-1 gap-1">
          {title && <p className="font-semibold">{title}</p>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        <button
          onClick={() => onClose(id)}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast, toastVariants }
