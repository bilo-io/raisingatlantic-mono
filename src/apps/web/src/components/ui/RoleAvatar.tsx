"use client";

import React from 'react';
import { User, Stethoscope, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/constants';

const roleIcons: Partial<Record<UserRole, React.FC<React.SVGProps<SVGSVGElement>>>> = {
  [UserRole.PARENT]: User,
  [UserRole.CLINICIAN]: Stethoscope,
  [UserRole.ADMIN]: Shield,
  [UserRole.SUPER_ADMIN]: Shield,
};

interface RoleAvatarProps {
  src?: string | null;
  name: string;
  role: UserRole;
  avatarClassName?: string;
  fallbackClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
}

export function RoleAvatar({
  src,
  name,
  role,
  avatarClassName,
  fallbackClassName,
  iconContainerClassName,
  iconClassName,
}: RoleAvatarProps) {
  const nameInitials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
    
  const RoleIcon = roleIcons[role];

  return (
    <div className="relative group w-fit h-fit">
      <Avatar className={cn('border-2 border-primary', avatarClassName)}>
        <AvatarImage src={src || undefined} alt={name} />
        <AvatarFallback name={name} className={fallbackClassName}>
          {nameInitials}
        </AvatarFallback>
      </Avatar>
      {RoleIcon && (
        <div
          className={cn(
            'absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-primary',
            iconContainerClassName
          )}
        >
          <RoleIcon className={cn('text-primary-foreground', iconClassName)} />
        </div>
      )}
    </div>
  );
}
