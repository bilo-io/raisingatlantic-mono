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

export default function ClinicianSignupPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: 'Dr.',
    specialty: '',
    license: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    {
      id: 'professional-info',
      title: 'Professional Profile',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select 
                value={formData.title} 
                onValueChange={(v) => setFormData({ ...formData, title: v })}
              >
                <SelectTrigger id="title">
                  <SelectValue placeholder="Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Smith" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Primary Specialty</Label>
            <Input 
              id="specialty" 
              placeholder="e.g. Pediatrics, Occupational Therapy" 
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            />
          </div>
        </div>
      )
    },
    {
      id: 'credentials',
      title: 'Contact & Credentials',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="dr.smith@clinician.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">Medical License Number</Label>
            <Input 
              id="license" 
              placeholder="HPCSA / PMC Number" 
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
            />
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Secure Account',
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
            Your credentials will be verified by our administration team before full access is granted.
          </p>
        </div>
      )
    }
  ];

  const handleComplete = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.specialty) {
      addToast({
        title: "Missing Info",
        description: "Please fill in all required professional fields.",
        type: "error"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      addToast({
        title: "Invalid Email",
        description: "Please enter a valid work email.",
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
        role: UserRole.CLINICIAN,
        title: formData.title,
      });
      setIsSuccess(true);
      addToast({
        title: "Registration Successful",
        description: "Your professional account has been created.",
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
    return <SignupSuccessScreen message="Your professional account has been created and is pending verification." />;
  }

  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl relative">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg">
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
            <CardTitle className="font-headline text-2xl">Clinician Signup</CardTitle>
            <CardDescription>Join our network of healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Wizard 
              steps={steps} 
              onComplete={handleComplete}
              submitLabel="Submit for Verification"
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
