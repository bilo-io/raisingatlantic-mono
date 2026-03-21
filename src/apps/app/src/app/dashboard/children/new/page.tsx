
"use client";

import { ChildProfileForm } from "@/components/children/ChildProfileForm";
import { useToast } from "@/hooks/useToast";
import { UserRole } from "@/lib/constants";
import { DUMMY_DEFAULT_USER_ID, dummyUsers, type User as UserType } from "@/data/users";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function NewChildPage() {
  const { addToast } = useToast();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserType | undefined>();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('currentUserId') || DUMMY_DEFAULT_USER_ID;
      const user = dummyUsers.find(u => u.id === storedUserId);
      setCurrentUser(user);
    }
  }, []);

  const parentUsers = useMemo(() => {
    return dummyUsers.filter(u => u.role === UserRole.PARENT);
  }, []);

  const handleSubmit = async (data: any) => {
    // In a real application, you would send this data to your backend
    console.log("New child data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addToast({
      title: "Profile Created!",
      description: `${data.firstName} ${data.lastName}'s profile has been successfully created.`,
      type: "success" 
    });
    // Potentially redirect user or clear form:
    router.push('/dashboard/children');
  };

  if (!mounted || !currentUser) {
    // Optionally return a loading skeleton
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <ChildProfileForm 
        onSubmit={handleSubmit} 
        isEditing={false}
        currentUser={currentUser}
        parentUsers={parentUsers}
      />
    </div>
  );
}
