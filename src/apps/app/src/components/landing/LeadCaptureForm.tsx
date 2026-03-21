
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-background/10 p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="lead-email" className="sr-only">{t('leadFormEmailLabel')}</label>
        <Input
          id="lead-email"
          type="email"
          placeholder={t('leadFormEmailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background text-foreground placeholder:text-muted-foreground/80"
        />
      </div>
      <div>
        <label htmlFor="lead-message" className="sr-only">{t('leadFormMessageLabel')}</label>
        <Textarea
          id="lead-message"
          placeholder={t('leadFormMessagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-background text-foreground placeholder:text-muted-foreground/80"
        />
      </div>
      <Button type="submit" size="lg" variant="default" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {t('leadFormSubmitButton')}
      </Button>
    </form>
  );
}
