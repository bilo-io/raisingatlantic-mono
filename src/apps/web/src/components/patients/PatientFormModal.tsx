
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChildProfileForm } from '../children/ChildProfileForm';
import { UserRole } from '@/lib/constants';
import { dummyUsers, type User as UserType } from '@/data/users';

interface PatientFormModalProps {
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: UserType;
}

export function PatientFormModal({ onSubmit, open, onOpenChange, currentUser }: PatientFormModalProps) {

  const parentUsers = React.useMemo(() => {
    return dummyUsers.filter(u => u.role === UserRole.PARENT);
  }, []);

  const handleChildFormSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new patient profile. This involves creating a child profile and assigning it to a parent.
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
