
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit3, ArrowLeft, Mail, Phone, CalendarDays, BarChart, Shield } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { dummyUsers, type User as UserType } from "@/data/users";
import { childrenDetails } from "@/data/children";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateStandard, formatDatePretty } from "@/utils/date";
import { RoleAvatar } from "@/components/ui/RoleAvatar";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [user, setUser] = useState<UserType | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = dummyUsers.find(u => u.id === id);
    setUser(currentUser);
  }, [id]);
  
  const associatedChildren = useMemo(() => {
    if (!user) return [];
    if (user.role === UserRole.PARENT) {
      return childrenDetails.filter(child => child.parentId === user.id);
    }
    if (user.role === UserRole.CLINICIAN) {
      return childrenDetails.filter(child => child.clinicianId === user.id);
    }
    return [];
  }, [user]);

  if (!mounted) {
    // Show a skeleton loader while waiting for client-side rendering
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">User Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find a profile for the specified user ID.</p>
        <Button asChild>
          <Link href="/dashboard/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to User List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to User List
        </Button>
        <Button variant="outline">
          <Edit3 className="mr-2 h-4 w-4" /> Edit User
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/20">
                <RoleAvatar 
                    src={user.avatarUrl}
                    name={user.name}
                    role={user.role}
                    aiHint={user.aiHint}
                    avatarClassName="h-32 w-32 shadow-md"
                    fallbackClassName="text-4xl"
                    iconContainerClassName="h-8 w-8 border-4"
                    iconClassName="h-4 w-4"
                />
                <div className="text-center md:text-left">
                    <CardTitle className="text-2xl font-bold">{(user.title ? user.title + ' ' : '') + user.name}</CardTitle>
                    <CardDescription className="text-md text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</CardDescription>
                    <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Joined on: {formatDatePretty(user.joinedDate)}</span>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <Label htmlFor="email" className="flex items-center text-sm font-medium text-muted-foreground"><Mail className="mr-2 h-4 w-4" />Email Address</Label>
                    <Input id="email" type="email" value={user.email} readOnly className="mt-1 bg-background/50" />
                    </div>
                    <div>
                    <Label htmlFor="phone" className="flex items-center text-sm font-medium text-muted-foreground"><Phone className="mr-2 h-4 w-4" />Phone Number</Label>
                    <Input id="phone" type="tel" value={user.phone} readOnly className="mt-1 bg-background/50" />
                    </div>
                </div>
                
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Shield className="mr-2 h-5 w-5 text-primary" />Account Security</h3>
                    <div className="space-y-3">
                    <Button variant="outline" className="w-full md:w-auto">Reset Password</Button>
                    <Button variant="outline" className="w-full md:w-auto">Manage Permissions</Button>
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center"><BarChart className="mr-2 h-5 w-5 text-primary"/>Activity & Associations</CardTitle>
                </CardHeader>
                <CardContent>
                    {associatedChildren.length > 0 ? (
                        <>
                         <p className="text-sm text-muted-foreground mb-4">
                            This user is associated with {associatedChildren.length} child profile(s).
                         </p>
                         <ul className="space-y-3">
                            {associatedChildren.map(child => (
                                <li key={child.id} className="flex items-center gap-3 bg-muted/50 p-2 rounded-md">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={child.avatar} alt={child.name} data-ai-hint={child.aiHint} />
                                        <AvatarFallback>{child.firstName?.[0]}{child.lastName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Link href={`/dashboard/children/${child.id}`} className="font-semibold hover:underline text-sm">{child.name}</Link>
                                        <p className="text-xs text-muted-foreground">{child.age}</p>
                                    </div>
                                </li>
                            ))}
                         </ul>
                        </>
                    ) : (
                         <p className="text-sm text-muted-foreground">No children associated with this user.</p>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
