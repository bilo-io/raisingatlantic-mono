
"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Building, Mail, Phone, MapPin } from "lucide-react";
import type { Practice } from '@/data/practices';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const practiceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  phone: z.string().min(10, "Phone number seems too short."),
  status: z.enum(['Active', 'Inactive', 'Temporarily Closed']),
});

type PracticeFormValues = z.infer<typeof practiceFormSchema>;

interface PracticeFormModalProps {
  practice?: Practice | null;
  tenantId: string;
  onSubmit: (data: PracticeFormValues & { id?: string; tenantId: string }) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PracticeFormModal({ practice, tenantId, onSubmit, open, onOpenChange }: PracticeFormModalProps) {
  const form = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      phone: '',
      status: 'Active',
    },
  });

  React.useEffect(() => {
    if (practice) {
      form.reset({
        name: practice.name,
        address: practice.address,
        city: practice.city,
        phone: practice.phone,
        status: practice.status,
      });
    } else {
      form.reset({
        name: '',
        address: '',
        city: '',
        phone: '',
        status: 'Active',
      });
    }
  }, [practice, form, open]);

  const handleFormSubmit = (data: PracticeFormValues) => {
    onSubmit({ ...data, id: practice?.id, tenantId });
    onOpenChange(false);
  };

  const isEditing = !!practice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Practice' : 'Add New Practice'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the practice.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Practice Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Atlantic Pediatric Care" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Health St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Cape Town" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(021) 555-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Temporarily Closed">Temporarily Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end pt-4">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create Practice'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
