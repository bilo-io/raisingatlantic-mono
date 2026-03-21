
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Edit3, Shield, Mail, Phone, User, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DUMMY_DEFAULT_USER_ID, dummyUsers, type User as UserType } from "@/data/users";
import { formatDateStandard } from "@/utils/date";
import { UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils";


const RoleIcon = ({ role, className }: { role: UserRole, className?: string }) => {
    const iconProps = { className: cn("h-4 w-4", className) };
    switch (role) {
      case UserRole.PARENT:
        return <User {...iconProps} />;
      case UserRole.CLINICIAN:
        return <Stethoscope {...iconProps} />;
      case UserRole.ADMIN:
        return <Shield {...iconProps} />;
      default:
        return null;
    }
};

export default function UserProfilePage() {
  const [user, setUser] = useState<UserType | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUserId = localStorage.getItem('currentUserId') || DUMMY_DEFAULT_USER_ID;
    const currentUser = dummyUsers.find(u => u.id === storedUserId);
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  if (!mounted || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/20">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 text-center md:text-left">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full md:w-40" />
                <Skeleton className="h-10 w-full md:w-64" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center">
          <UserCircle className="mr-3 h-8 w-8 text-primary" />
          My Profile
        </h1>
        <Button variant="outline">
          <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/20">
           <div className="relative group">
              <Avatar className="h-32 w-32 border-2 border-primary/50 group-hover:border-primary/100 transition-colors shadow-md">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.aiHint} />
                <AvatarFallback className="text-4xl" name={user.name}>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground border-4 border-background">
                <RoleIcon role={user.role} />
              </div>
            </div>
          <div className="text-center md:text-left">
            <CardTitle className="text-2xl font-bold">{(user.title ? user.title + ' ' : '') + user.name}</CardTitle>
            <CardDescription className="text-md text-muted-foreground">{user.role}</CardDescription>
            <p className="text-sm text-muted-foreground mt-1">Joined on: {formatDateStandard(user.joinedDate)}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
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
          
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center"><Shield className="mr-2 h-5 w-5 text-primary" />Security Settings</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full md:w-auto">Change Password</Button>
              <Button variant="outline" className="w-full md:w-auto">Enable Two-Factor Authentication</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
