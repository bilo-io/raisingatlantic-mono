"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Wizard } from '@/components/wizard/wizard';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signup, validateEmail } from "@/lib/auth";
import { UserRole } from "@/lib/constants";
import { SignupSuccessScreen } from "@/components/auth/SignupSuccessScreen";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useToast } from "@/hooks/useToast";

export default function MemberSignupPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    relation: 'parent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    {
      id: 'basic-info',
      title: 'Member Details',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      )
    },
    {
      id: 'role-details',
      title: 'Additional Info',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="(+1) 123-4567" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relation">Relationship to Patient</Label>
            <Select 
              value={formData.relation} 
              onValueChange={(v) => setFormData({ ...formData, relation: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="self">Patient (Self)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Secure Your Account',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            By clicking Submit, you agree to our terms and conditions.
          </p>
        </div>
      )
    }
  ];

  const handleComplete = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      addToast({
        title: "Missing Info",
        description: "Please fill in all required fields.",
        type: "error"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      addToast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: UserRole.PARENT, // Use parent by default for member flow
        phone: formData.phone
      });
      setIsSuccess(true);
      addToast({
        title: "Welcome aboard!",
        description: "Your account has been successfully created.",
        type: "success"
      });
    } catch (error: any) {
      addToast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SignupSuccessScreen />;
  }

  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl relative">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
               <div className="p-1.5 bg-primary/20 rounded-full animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               </div>
            </div>
          )}
          <CardHeader className="text-center pb-2">
            <Link href="/" className="mb-8 block">
              <div className="flex justify-center h-24">
                <img src="/assets/images/app-branding-light.svg" alt="Raising Atlantic" className="h-full dark:hidden" />
                <img src="/assets/images/app-branding-dark.svg" alt="Raising Atlantic" className="h-full hidden dark:block" />
              </div>
            </Link>
            <CardTitle className="font-headline text-2xl">Member Signup</CardTitle>
            <CardDescription>Join our platform as a parent or patient member</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Wizard 
              steps={steps} 
              onComplete={handleComplete}
              submitLabel="Complete Signup"
            />
          </CardContent>
          <div className="mt-2 p-6 text-center text-sm border-t">
            <p>Already have an account? <Link href="/login/test" className="underline text-primary font-semibold">Log in</Link></p>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
