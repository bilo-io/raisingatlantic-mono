
"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Save, UserCircle, CalendarIcon, Mars, Venus, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDatePretty } from "@/utils/date";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { User as UserType } from '@/data/users';
import { UserRole } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const profileFormSchema = z.object({
  parentId: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  dateOfBirth: z.date({ required_error: "Date of birth is required."}),
  gender: z.enum(['male', 'female'], { required_error: "Please select a gender." }),
  notes: z.string().optional(),
  imageUrl: z.string().url("Invalid URL for image.").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ChildProfileFormProps {
  initialData?: Partial<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isEditing?: boolean;
  currentUser: UserType;
  parentUsers: UserType[];
}

export function ChildProfileForm({ initialData, onSubmit, isEditing = false, currentUser, parentUsers }: ChildProfileFormProps) {
  
  const getParentLastName = React.useCallback((userId: string | undefined): string => {
    if (!userId) return '';
    const parent = parentUsers.find(p => p.id === userId);
    return parent ? parent.name.split(' ').slice(-1)[0] : '';
  }, [parentUsers]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...initialData,
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || (currentUser.role === UserRole.PARENT ? getParentLastName(currentUser.id) : ""),
      notes: initialData?.notes || "",
      imageUrl: initialData?.imageUrl || "",
      gender: initialData?.gender || undefined,
      parentId: initialData?.parentId || (currentUser.role === UserRole.PARENT ? currentUser.id : ''),
    },
  });

  const [avatarPreview, setAvatarPreview] = React.useState<string | undefined>(initialData?.imageUrl);

  const parentId = form.watch("parentId");

  React.useEffect(() => {
    if (currentUser.role !== UserRole.PARENT && !isEditing) {
      const parentLastName = getParentLastName(parentId);
      if (parentLastName) {
        form.setValue("lastName", parentLastName, { shouldValidate: true });
      }
    }
  }, [parentId, currentUser.role, form, isEditing, getParentLastName]);


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // In a real app, you'd upload this file and set form.setValue('imageUrl', uploadedUrl)
      };
      reader.readAsDataURL(file);
    }
  };

  const fullName = `${form.watch("firstName") || ''} ${form.watch("lastName") || ''}`.trim();
  const showParentSelector = currentUser.role !== UserRole.PARENT && !isEditing;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-none">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <UserCircle className="mr-2 h-6 w-6 text-primary" />
          {isEditing ? `Edit ${initialData?.firstName || 'Child'}'s Profile` : "Create New Child Profile"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update the details for this child." : "Fill in the details to add a new child to your records."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={avatarPreview || "https://placehold.co/200x200.png"} alt="Child avatar" />
                <AvatarFallback name={fullName}>{`${form.getValues("firstName")?.[0] || 'A'}${form.getValues("lastName")?.[0] || 'B'}`}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Avatar
              </Button>
              <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            
            {showParentSelector && (
              <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Parent/Guardian</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a parent..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parentUsers.map(user => (
                              <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                            <Mars className="h-4 w-4 text-blue-500" /> Male
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                            <Venus className="h-4 w-4 text-pink-500" /> Female
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                      placeholder="Any relevant notes about the child (e.g., allergies, preferences, initial observations)..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These notes are confidential and will only be shared with authorized clinicians if you choose to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" /> {isEditing ? "Save Changes" : "Create Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
