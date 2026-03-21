
"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDatePretty } from "@/utils/date";
import { CalendarIcon, Save, FilePlus, User, ShieldPlus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/useToast';
import type { ChildDetail } from '@/data/children';
import { standardVaccinationSchedule } from '@/data/vaccinations';

const vaccinationRecordSchema = z.object({
  childId: z.string().nonempty({ message: "You must select a child." }),
  vaccineId: z.string().nonempty({ message: "You must select a vaccine." }),
  dateAdministered: z.date({ required_error: "A date is required." }),
  notes: z.string().optional(),
});

type VaccinationRecordFormValues = z.infer<typeof vaccinationRecordSchema>;

interface VaccinationRecordFormModalProps {
  childrenList: ChildDetail[];
  onFormSubmit: (data: VaccinationRecordFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VaccinationRecordFormModal({ childrenList, onFormSubmit, open, onOpenChange }: VaccinationRecordFormModalProps) {
  const { addToast } = useToast();
  
  const form = useForm<VaccinationRecordFormValues>({
    resolver: zodResolver(vaccinationRecordSchema),
    defaultValues: {
        childId: '',
        vaccineId: '',
        dateAdministered: new Date(),
        notes: '',
    },
  });

  const onSubmit = (data: VaccinationRecordFormValues) => {
    onFormSubmit(data);
    const selectedChild = childrenList.find(c => c.id === data.childId);
    addToast({
        title: "Record Added!",
        description: `A new vaccination record for ${selectedChild?.name || 'the child'} has been created.`,
        type: 'success',
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center">
             <FilePlus className="mr-2 h-6 w-6 text-primary" />
             Add Vaccination Record
          </DialogTitle>
          <DialogDescription>
            Select the child and the vaccine administered.
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="vaccineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ShieldPlus className="mr-2 h-4 w-4 text-muted-foreground" />Vaccine</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vaccine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {standardVaccinationSchedule.map(vaccine => (
                            <SelectItem key={vaccine.id} value={vaccine.id}>
                                {vaccine.name} ({vaccine.doseInfo})
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="dateAdministered"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Administered</FormLabel>
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Lot number, site of administration..."
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
