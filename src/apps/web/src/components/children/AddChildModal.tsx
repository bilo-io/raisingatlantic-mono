"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChildProfileForm } from './ChildProfileForm';
import { UserRole } from '@/lib/constants';
import { dummyUsers, type User as UserType } from '@/data/users';

interface AddChildModalProps {
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: UserType;
}

export function AddChildModal({ onSubmit, open, onOpenChange, currentUser }: AddChildModalProps) {
  const isParent = currentUser.role === UserRole.PARENT;

  const parentUsers = React.useMemo(() => {
    return dummyUsers.filter(u => u.role === UserRole.PARENT);
  }, []);

  const handleChildFormSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Child</DialogTitle>
          <DialogDescription>
            {isParent
              ? "Fill out the form to create a new child profile."
              : "Fill out the form to create a new child profile and assign it to a parent."}
          </DialogDescription>
        </DialogHeader>
        <ChildProfileForm
          onSubmit={handleChildFormSubmit}
          isEditing={false}
          currentUser={currentUser}
          parentUsers={parentUsers}
        />
      </DialogContent>
    </Dialog>
  );
}
