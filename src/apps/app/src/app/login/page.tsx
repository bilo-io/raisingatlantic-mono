
"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, Shield, User, Stethoscope } from "lucide-react";
import { SITE_NAME, UserRole } from "@/lib/constants";
import { PublicLayout } from "@/components/layout/PublicLayout";
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { dummyUsers } from "@/data/users";
import { SiteLogo } from "@/components/layout/SiteLogo";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.411-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.022,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const usersForRole = useMemo(() => {
    if (!selectedRole) return [];
    return dummyUsers.filter(user => user.role === selectedRole);
  }, [selectedRole]);

  const selectedUser = useMemo(() => {
    return dummyUsers.find(user => user.id === selectedUserId);
  }, [selectedUserId]);
  
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setSelectedUserId(''); // Reset user selection when role changes
  }

  const handleUserLogin = () => {
    if (selectedUserId) {
      localStorage.setItem('currentUserId', selectedUserId);
      router.push('/dashboard');
    }
  };

  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mb-4 inline-block">
              <SiteLogo className="mx-auto" />
            </Link>
            <CardTitle className="font-headline text-3xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline text-primary">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-5 w-5" /> Login
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Login with Google
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or login as test user
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={selectedRole} onValueChange={(value: UserRole) => handleRoleChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).filter(role => role !== UserRole.SUPER_ADMIN).map(role => (
                      <SelectItem key={role} value={role}>
                        {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={!selectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersForRole.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleUserLogin}
                disabled={!selectedUserId}
              >
                {selectedUser ? (
                  <>
                    <User className="mr-2 h-5 w-5" /> Login as {selectedUser.name}
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>


          </CardContent>
          <div className="mt-4 p-6 text-center text-sm border-t">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary font-semibold">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
