
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { PublicLayout } from "@/components/layout/PublicLayout";
import Image from 'next/image';


export default function SignupPage() {
  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/assets/images/app-logo.svg" 
                alt={SITE_NAME}
                width={175} 
                height={40}
                className="mx-auto"
              />
            </Link>
            <CardTitle className="font-headline text-3xl">Join {SITE_NAME}</CardTitle>
            <CardDescription>Create your account to start supporting child development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <Select>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent / Guardian</SelectItem>
                  <SelectItem value="clinician">Clinician / Educator</SelectItem>
                  <SelectItem value="admin">Administrator (Demo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" size="lg">
              <UserPlus className="mr-2 h-5 w-5" /> Sign Up
            </Button>
          </CardContent>
          <div className="mt-4 p-6 text-center text-sm border-t">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary font-semibold">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
