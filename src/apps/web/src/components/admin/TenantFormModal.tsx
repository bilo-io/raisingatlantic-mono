
"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Building, Mail, Phone, Globe, Edit, ExternalLink, Trash2, PlusCircle } from "lucide-react";
import type { Tenant } from '@/data/tenants';
import type { Practice } from '@/data/practices';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { PracticeFormModal } from './PracticeFormModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


const tenantFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number seems too short."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  logoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface TenantFormModalProps {
  tenant: Tenant | null;
  practices: Practice[];
  onTenantSubmit: (data: TenantFormValues & { id?: string }) => void;
  onPracticesChange: (practices: Practice[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantFormModal({ tenant, practices, onTenantSubmit, onPracticesChange, open, onOpenChange }: TenantFormModalProps) {
  const { addToast } = useToast();
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    mode: 'onChange',
  });

  const [isPracticeModalOpen, setIsPracticeModalOpen] = React.useState(false);
  const [editingPractice, setEditingPractice] = React.useState<Practice | null>(null);

  const tenantPractices = React.useMemo(() => {
    return tenant ? practices.filter(p => p.tenantId === tenant.id) : [];
  }, [practices, tenant]);

  React.useEffect(() => {
    if (open) {
      if (tenant) {
        form.reset({
          name: tenant.name || '',
          email: tenant.email || '',
          phone: tenant.phone || '',
          website: tenant.website || '',
          logoUrl: tenant.logoUrl || '',
        });
      } else {
        form.reset({
          name: '',
          email: '',
          phone: '',
          website: '',
          logoUrl: '',
        });
      }
    }
  }, [tenant, form, open]);

  const handleTenantFormSubmit = (data: TenantFormValues) => {
    onTenantSubmit(tenant ? { id: tenant.id, ...data } : data);
    addToast({
      title: tenant ? "Tenant Updated" : "Tenant Created",
      description: `${data.name} has been successfully ${tenant ? 'updated' : 'created'}.`,
      type: 'success',
    });
    if (!tenant) onOpenChange(false);
  };
  
  const handlePracticeSubmit = (data: any) => {
    let updatedPractices;
    if (data.id) { // Editing existing practice
      updatedPractices = practices.map(p => p.id === data.id ? { ...p, ...data } : p);
    } else { // Adding new practice
      const newPractice: Practice = {
        ...data,
        id: `practice-${Date.now()}`,
        state: 'WC', // Default state for now
        zip: '0000', // Default zip
      };
      updatedPractices = [...practices, newPractice];
    }
    onPracticesChange(updatedPractices);
    addToast({
      title: data.id ? "Practice Updated" : "Practice Created",
      description: `${data.name} has been successfully ${data.id ? 'updated' : 'created'}.`,
      type: 'success'
    });
  };

  const handleDeletePractice = (practiceId: string) => {
    const updatedPractices = practices.filter(p => p.id !== practiceId);
    onPracticesChange(updatedPractices);
    addToast({
      title: "Practice Deleted",
      description: "The practice has been removed.",
      type: 'error'
    });
  };

  const isEditing = !!tenant;
  const Icon = isEditing ? Edit : Building;
  const websiteValue = form.watch('website');
  const isWebsiteValid = !form.formState.errors.website && !!websiteValue;

  return (
    <>
      {isPracticeModalOpen && tenant && (
        <PracticeFormModal
          open={isPracticeModalOpen}
          onOpenChange={setIsPracticeModalOpen}
          onSubmit={handlePracticeSubmit}
          practice={editingPractice}
          tenantId={tenant.id}
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center">
              <Icon className="mr-2 h-6 w-6 text-primary" />
              {isEditing ? `Edit Tenant: ${tenant.name}` : 'Add New Tenant'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details for this tenant and manage associated practices.' : 'Fill in the details for the new tenant.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="practices" disabled={!isEditing}>Practices</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleTenantFormSubmit)} className="space-y-6 pt-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" />Tenant Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Atlantic Health Group" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Contact Email</FormLabel>
                      <FormControl><Input type="email" placeholder="e.g., contact@tenant.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Contact Phone</FormLabel>
                      <FormControl><Input type="tel" placeholder="(021) 555-1234" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Globe className="mr-2 h-4 w-4 text-muted-foreground" />Website (Optional)</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} className={cn('pr-10', form.formState.errors.website ? 'border-destructive focus-visible:ring-destructive' : '', isWebsiteValid && form.formState.dirtyFields.website ? 'border-primary focus-visible:ring-primary' : '')} />
                        </FormControl>
                        <Button type="button" variant="ghost" size="icon" className={cn("absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7", !isWebsiteValid && "pointer-events-none opacity-50")} asChild>
                          <Link href={websiteValue || ''} target="_blank" aria-label="Preview website link"><ExternalLink className="h-4 w-4 text-muted-foreground" /></Link>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex justify-end pt-4">
                    <Button type="submit"><Save className="mr-2 h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create Tenant'}</Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="practices">
              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Associated Practices</h3>
                  <Button size="sm" onClick={() => { setEditingPractice(null); setIsPracticeModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Practice
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenantPractices.length > 0 ? tenantPractices.map(practice => (
                        <TableRow key={practice.id}>
                          <TableCell className="font-medium">{practice.name}</TableCell>
                          <TableCell><Badge variant={practice.status === 'Active' ? 'default' : 'secondary'}>{practice.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the practice. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeletePractice(practice.id)} className={buttonVariants({variant: 'destructive'})}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center h-24">No practices found for this tenant.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Dummy buttonVariants to satisfy TypeScript since it's not exported from button component
const buttonVariants = (opts: any) => "";
