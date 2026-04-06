
"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, UserPlus, Mail, Phone, Briefcase, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserRole } from '@/lib/constants';
import type { User } from '@/data/users';

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number seems too short.").optional(),
  title: z.string().optional(),
  role: z.nativeEnum(UserRole, { required_error: "A role must be selected." }),
  imageUrl: z.string().url().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormModalProps {
  user: User | null;
  onSubmit: (data: UserFormValues & { id?: string }) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormModal({ user, onSubmit, open, onOpenChange }: UserFormModalProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        title: user.title || '',
        imageUrl: user.imageUrl || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        role: undefined,
        title: '',
        imageUrl: '',
      });
    }
  }, [user, form, open]); // Re-run effect when `open` changes to reset the form

  const handleFormSubmit = (data: UserFormValues) => {
    onSubmit(user ? { id: user.id, ...data } : data);
    onOpenChange(false);
  };
  
  const isEditing = !!user;
  const Icon = isEditing ? Edit : UserPlus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
             <Icon className="mr-2 h-6 w-6 text-primary" />
             {isEditing ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this user.' : 'Fill in the details for the new user account.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(021) 555-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.PARENT}>Parent</SelectItem>
                        <SelectItem value={UserRole.CLINICIAN}>Clinician</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            <div className="flex justify-end pt-4">
                 <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create User'}
                 </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
