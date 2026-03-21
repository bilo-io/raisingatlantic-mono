
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from 'react-i18next';

export function LeadCaptureForm() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend or email service
    console.log("Lead captured:", { email, message });
    addToast({
      title: t('leadFormSuccessTitle'),
      description: t('leadFormSuccessDescription', { email }),
      type: 'success',
    });
    setEmail('');
    setMessage('');
  };

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-1/2 mx-auto" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm">
      <div>
        <label htmlFor="lead-email" className="sr-only">{t('leadFormEmailLabel')}</label>
        <Input
          id="lead-email"
          type="email"
          placeholder={t('leadFormEmailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background/80 border-white/20 h-12"
        />
      </div>
      <div>
        <label htmlFor="lead-message" className="sr-only">{t('leadFormMessageLabel')}</label>
        <Textarea
          id="lead-message"
          placeholder={t('leadFormMessagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-background/80 border-white/20 min-h-[100px]"
        />
      </div>
      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-[#181D22] text-[#E5E0D8] dark:bg-white dark:text-[#181D22] hover:opacity-90 transition-all font-bold rounded-xl h-14 shadow-md"
      >
        {t('leadFormSubmitButton')}
      </Button>
    </form>
  );
}
