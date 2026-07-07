"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useToast } from "@/hooks/useToast";
import { login } from "@/lib/auth";

const googleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      addToast({
        type: "error",
        title: "Sign in failed",
        description:
          (err as { message?: string })?.message ?? "Unable to sign in. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleError = (message: string) =>
    addToast({ type: "error", title: "Sign in failed", description: message });

  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center p-4 min-h-[80vh]">
        <Card className="w-full max-w-md shadow-2xl overflow-hidden border-border/50">
          <CardHeader className="text-center pb-2">
            <Link href="/" className="mb-8 block">
              <div className="flex justify-center h-[162px]">
                <img src="/assets/images/app-branding-light.svg" alt="Raising Atlantic" className="h-full dark:hidden" />
                <img src="/assets/images/app-branding-dark.svg" alt="Raising Atlantic" className="h-full hidden dark:block" />
              </div>
            </Link>
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline font-semibold">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-white font-bold" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {googleEnabled && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
                  </div>
                </div>

                <GoogleSignInButton onError={handleGoogleError} />
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-border pt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PublicLayout>
  );
}
