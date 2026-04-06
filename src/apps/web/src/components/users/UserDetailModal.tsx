
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { User as UserType } from "@/data/users";
import { Mail, Phone, Briefcase } from "lucide-react";
import { RoleAvatar } from "@/components/ui/RoleAvatar";

interface UserDetailModalProps {
  user: UserType | null;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center pt-4">
          <RoleAvatar
            src={user.imageUrl}
            name={user.name}
            role={user.role}
            avatarClassName="h-24 w-24 mb-4"
            fallbackClassName="text-3xl"
            iconContainerClassName="h-7 w-7 border-2"
            iconClassName="h-4 w-4"
          />
          <DialogTitle className="font-headline text-2xl">{(user.title || '') + ' ' + user.name}</DialogTitle>
          <DialogDescription className="flex items-center justify-center">
            <Briefcase className="mr-2 h-4 w-4" />
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-2 space-y-4">
          <div className="space-y-3">
             <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${user.email}`} className="text-sm text-foreground hover:underline">
                  {user.email}
                </a>
             </div>
             <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href={`tel:${user.phone}`} className="text-sm text-foreground hover:underline">
                    {user.phone}
                </a>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
