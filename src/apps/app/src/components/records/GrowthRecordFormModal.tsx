
"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDatePretty } from "@/utils/date";
import { CalendarIcon, Save, FilePlus, User, Weight, Ruler } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/useToast';
import type { ChildDetail } from '@/data/children';

const growthRecordSchema = z.object({
  childId: z.string().nonempty({ message: "You must select a child." }),
  date: z.date({ required_error: "A date is required." }),
  weight: z.string().optional(),
  height: z.string().optional(),
  headCircumference: z.string().optional(),
  notes: z.string().optional(),
});

type GrowthRecordFormValues = z.infer<typeof growthRecordSchema>;

interface GrowthRecordFormModalProps {
  childrenList: ChildDetail[];
  onFormSubmit: (data: GrowthRecordFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialChildId?: string;
}

export function GrowthRecordFormModal({ childrenList, onFormSubmit, open, onOpenChange, initialChildId }: GrowthRecordFormModalProps) {
  const { addToast } = useToast();
  
  const form = useForm<GrowthRecordFormValues>({
    resolver: zodResolver(growthRecordSchema),
    defaultValues: {
        childId: initialChildId || '',
        date: new Date(),
        weight: '',
        height: '',
        headCircumference: '',
        notes: '',
    },
  });

  React.useEffect(() => {
    if (initialChildId) {
      form.setValue('childId', initialChildId);
    }
  }, [initialChildId, form]);

  const onSubmit = (data: GrowthRecordFormValues) => {
    onFormSubmit(data);
    const selectedChild = childrenList.find(c => c.id === data.childId);
    addToast({
        title: "Record Added!",
        description: `A new growth record for ${selectedChild?.name || 'the child'} has been created.`,
        type: 'success',
    });
    form.reset({
        childId: initialChildId || '',
        date: new Date(),
        weight: '',
        height: '',
        headCircumference: '',
        notes: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
             <FilePlus className="mr-2 h-6 w-6 text-primary" />
             Add Growth Record
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new growth measurement.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
             <FormField
                control={form.control}
                name="childId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Child</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={initialChildId} disabled={!!initialChildId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a child" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {childrenList.map(child => (
                            <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Measurement</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? formatDatePretty(field.value) : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Weight className="mr-2 h-4 w-4 text-muted-foreground" />Weight (kg)</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 8.5" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Ruler className="mr-2 h-4 w-4 text-muted-foreground" />Height (cm)</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 70" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this measurement..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
                 <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Record
                 </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
