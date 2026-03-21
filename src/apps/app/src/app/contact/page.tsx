
"use client";

import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Send, User, MessageSquare, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useToast } from "@/hooks/useToast";

const PageIcon: LucideIcon = Mail;
const pageTitleKey = 'contactPageTitle';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    console.log("Contact form submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addToast({
      title: t('contactFormSuccessTitle'),
      description: t('contactFormSuccessDescription', { name: data.name }),
      type: 'success',
    });
    form.reset(); // Reset form fields
  };

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <Card className="max-w-2xl mx-auto my-8 shadow-xl">
          <CardHeader className="text-center">
            <div className="inline-flex justify-center items-center mb-4">
              <PageIcon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl md:text-4xl">{t(pageTitleKey)}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              {t('contactPageSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {t('contactFormNameLabel')}
                  </Label>
                  <Input 
                    id="name" 
                    placeholder={t('contactFormNamePlaceholder')} 
                    {...form.register("name")} 
                    className={form.formState.errors.name ? 'border-destructive' : ''}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {t('contactFormEmailLabel')}
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={t('contactFormEmailPlaceholder')} 
                    {...form.register("email")}
                    className={form.formState.errors.email ? 'border-destructive' : ''}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center">
                  <Type className="mr-2 h-4 w-4 text-muted-foreground" />
                  {t('contactFormSubjectLabel')}
                </Label>
                <Input 
                  id="subject" 
                  placeholder={t('contactFormSubjectPlaceholder')} 
                  {...form.register("subject")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  {t('contactFormMessageLabel')}
                </Label>
                <Textarea 
                  id="message" 
                  placeholder={t('contactFormMessagePlaceholder')} 
                  rows={6} 
                  {...form.register("message")}
                  className={`resize-none ${form.formState.errors.message ? 'border-destructive' : ''}`}
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                <Send className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? t('contactFormSubmitting') : t('contactFormSubmitButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
