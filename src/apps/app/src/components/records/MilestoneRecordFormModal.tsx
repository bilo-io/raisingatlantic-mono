
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
import { CalendarIcon, Save, FilePlus, User, Award } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/useToast';
import type { ChildDetail } from '@/data/children';
import { standardMilestonesByAge } from '@/data/milestones';

const milestoneRecordSchema = z.object({
  childId: z.string().nonempty({ message: "You must select a child." }),
  milestoneId: z.string().nonempty({ message: "You must select a milestone." }),
  dateAchieved: z.date({ required_error: "A date is required." }),
  notes: z.string().optional(),
});

type MilestoneRecordFormValues = z.infer<typeof milestoneRecordSchema>;

interface MilestoneRecordFormModalProps {
  childrenList: ChildDetail[];
  onFormSubmit: (data: MilestoneRecordFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneRecordFormModal({ childrenList, onFormSubmit, open, onOpenChange }: MilestoneRecordFormModalProps) {
  const { addToast } = useToast();
  
  const form = useForm<MilestoneRecordFormValues>({
    resolver: zodResolver(milestoneRecordSchema),
    defaultValues: {
        childId: '',
        milestoneId: '',
        dateAchieved: new Date(),
        notes: '',
    },
  });

  const onSubmit = (data: MilestoneRecordFormValues) => {
    onFormSubmit(data);
    const selectedChild = childrenList.find(c => c.id === data.childId);
    addToast({
        title: "Record Added!",
        description: `A new milestone record for ${selectedChild?.name || 'the child'} has been created.`,
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
             Add Milestone Record
          </DialogTitle>
          <DialogDescription>
            Select the child and the milestone they've achieved.
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
                name="milestoneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Award className="mr-2 h-4 w-4 text-muted-foreground" />Milestone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a milestone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {standardMilestonesByAge.map(group => (
                            <SelectGroup key={group.age}>
                                <SelectLabel>{group.age} Milestones</SelectLabel>
                                {group.milestones.map(milestone => (
                                    <SelectItem key={milestone.id} value={milestone.id}>
                                        {milestone.description}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="dateAchieved"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Achieved</FormLabel>
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
                      placeholder="Any additional notes about this milestone..."
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
