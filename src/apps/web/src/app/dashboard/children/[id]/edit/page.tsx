
"use client";

import { ChildProfileForm } from "@/components/children/ChildProfileForm";
import { useToast } from "@/hooks/useToast";
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { childrenDetails } from "@/data/children";
import { dummyUsers, DUMMY_DEFAULT_USER_ID } from "@/data/users";
import { UserRole } from "@/lib/constants";
import React from 'react';

const getChildDataForEdit = (id: string) => {
  const child = childrenDetails.find(c => c.id === id);
  if (!child) return undefined;
  
  // The form expects a specific shape, which matches a subset of ChildDetail
  return {
    id: child.id,
    firstName: child.firstName,
    lastName: child.lastName,
    dateOfBirth: new Date(child.dateOfBirth),
    gender: child.gender,
    notes: child.notes,
    imageUrl: child.imageUrl,
  };
};

export default function EditChildPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const childData = getChildDataForEdit(id);

  const currentUser = React.useMemo(() => {
    if (typeof window === 'undefined') return dummyUsers.find(u => u.id === DUMMY_DEFAULT_USER_ID)!;
    const userId = (typeof window !== 'undefined' && localStorage.getItem('currentUserId')) || DUMMY_DEFAULT_USER_ID;
    return dummyUsers.find(u => u.id === userId) || dummyUsers.find(u => u.id === DUMMY_DEFAULT_USER_ID)!;
  }, []);

  const parentUsers = React.useMemo(() => {
    return dummyUsers.filter(u => u.role === UserRole.PARENT);
  }, []);

  const handleSubmit = async (data: any) => {
    console.log("Updated child data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addToast({
      title: "Profile Updated!",
      description: `${data.firstName} ${data.lastName}'s profile has been successfully updated.`,
      type: 'success',
    });
    router.push(`/dashboard/children/${id}`); // Redirect to profile view
  };

  if (!childData) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Child Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">Cannot edit a profile that does not exist.</p>
        <Button asChild>
          <Link href="/dashboard/children">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Children List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/children/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Edit
          </Link>
        </Button>
      </div>
      <ChildProfileForm 
        onSubmit={handleSubmit} 
        initialData={childData} 
        isEditing={true} 
        currentUser={currentUser}
        parentUsers={parentUsers}
      />
    </div>
  );
}
