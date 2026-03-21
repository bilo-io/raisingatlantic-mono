
"use client";

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '@/components/ui/toast';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: React.ReactNode;
  description?: React.ReactNode;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000); // Auto-dismiss after 5 seconds
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-0 z-[100] p-4 w-full max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="mb-4"
            >
              <Toast
                id={toast.id}
                type={toast.type}
                title={toast.title}
                description={toast.description}
                onClose={removeToast}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
