import { toast } from "../../components/ui/Toast";

export type ToastBridge = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

export function useToastBridge(): ToastBridge {
  return {
    success: (title, description) => toast.success(title, { description }),
    error: (title, description) => toast.error(title, { description }),
    info: (title, description) => toast.info(title, { description }),
  };
}
