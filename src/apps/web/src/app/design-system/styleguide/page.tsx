
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/useToast';
import { DesignSystemLayout } from '@/components/layout/DesignSystemLayout';

const ColorSwatch = ({ color, name, hex }: { color: string; name: string; hex: string }) => (
  <div className="flex flex-col items-center">
    <div className={`w-24 h-24 rounded-lg shadow-md ${color} border`}></div>
    <div className="text-center mt-2">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground">{hex}</p>
    </div>
  </div>
);

export default function StyleguidePage() {
    const { addToast } = useToast();

    const handleToast = (type: 'info' | 'success' | 'warning' | 'error') => {
        addToast({
            type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
            description: "This is a sample toast notification.",
        });
    };

  return (
    <DesignSystemLayout>
        <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <Palette className="mr-3 h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-tight">Styleguide</h1>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Application Styleguide</CardTitle>
            <CardDescription>
                This page displays the application's color palette, typography, component styles, and other UI elements.
            </CardDescription>
            </CardHeader>
        </Card>

        {/* Typography Section */}
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center"><Type className="mr-2 h-5 w-5 text-primary" />Typography</CardTitle>
            <CardDescription>Defines the typographic scale and styles used across the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <h1 className="font-headline text-4xl font-bold">Headline 1 (font-headline)</h1>
            <h2 className="font-headline text-3xl font-semibold">Headline 2 (font-headline)</h2>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <h4 className="text-xl font-medium">Heading 4</h4>
            <p className="text-base">This is a standard paragraph (p). It uses the default body font and size. Ideal for descriptive text and general content. <a href="#" className="text-primary underline">This is a link.</a></p>
            <p className="text-sm text-muted-foreground">This is a smaller paragraph with muted foreground text, useful for descriptions or subtitles.</p>
            <blockquote className="border-l-4 pl-4 italic">This is a blockquote, perfect for highlighting a quote or important piece of information.</blockquote>
            </CardContent>
        </Card>
        
        {/* Colors Section */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Colors</CardTitle>
                <CardDescription>The primary color palette for the application theme.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <ColorSwatch color="bg-primary" name="Primary" hex="#605BFF" />
                <ColorSwatch color="bg-secondary" name="Secondary" hex="#F1F5F9" />
                <ColorSwatch color="bg-accent" name="Accent" hex="#FF00AA" />
                <ColorSwatch color="bg-destructive" name="Destructive" hex="#F43F5E" />
                <ColorSwatch color="bg-background" name="Background" hex="#E8F4F8" />
                <ColorSwatch color="bg-foreground" name="Foreground" hex="#333D47" />
                <ColorSwatch color="bg-card" name="Card" hex="#FFFFFF" />
                <ColorSwatch color="bg-muted" name="Muted" hex="#E5EBF2" />
            </CardContent>
        </Card>

        {/* Components Section */}
        <Card>
            <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>A showcase of common UI components available in the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
                {/* Buttons */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Buttons</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button size="lg">Large Button</Button>
                        <Button size="sm">Small Button</Button>
                        <Button size="icon"><Palette className="h-4 w-4" /></Button>
                    </div>
                </section>
                
                {/* Badges */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Badges</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </section>
                
                {/* Toasts */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Toasts</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button variant="outline" onClick={() => handleToast('info')}>Info Toast</Button>
                        <Button variant="outline" onClick={() => handleToast('success')}>Success Toast</Button>
                        <Button variant="outline" onClick={() => handleToast('warning')}>Warning Toast</Button>
                        <Button variant="outline" onClick={() => handleToast('error')}>Error Toast</Button>
                    </div>
                </section>

                {/* Form Elements */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Form Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="styleguide-input">Text Input</Label>
                            <Input id="styleguide-input" placeholder="Enter text..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="styleguide-select">Select Menu</Label>
                            <Select>
                                <SelectTrigger id="styleguide-select">
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Option 1</SelectItem>
                                    <SelectItem value="2">Option 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="styleguide-switch" />
                            <Label htmlFor="styleguide-switch">Toggle Switch</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="styleguide-textarea">Text Area</Label>
                            <Textarea id="styleguide-textarea" placeholder="Type your message here." />
                        </div>
                    </div>
                </section>

                {/* Modals & Dialogs */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Modals & Dialogs</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild><Button variant="outline">Open Dialog</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dialog Title</DialogTitle>
                                    <DialogDescription>This is a standard dialog component.</DialogDescription>
                                </DialogHeader>
                                <p>You can put any content you want inside a dialog.</p>
                            </DialogContent>
                        </Dialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="destructive">Open Alert Dialog</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Continue</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </section>

                {/* Interactive Displays */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Interactive Displays</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-medium mb-2">Tabs</h4>
                            <Tabs defaultValue="account">
                                <TabsList><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="password">Password</TabsTrigger></TabsList>
                                <TabsContent value="account" className="p-4 border rounded-b-md">Account details would go here.</TabsContent>
                                <TabsContent value="password" className="p-4 border rounded-b-md">Password change form would go here.</TabsContent>
                            </Tabs>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Accordion</h4>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                                    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                                    <AccordionContent>Yes. It comes with default styles that match the rest of the components.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>
                
                {/* Other Components */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Other Components</h3>
                    <div className="flex flex-wrap items-center gap-8">
                        <div>
                            <h4 className="font-medium mb-2">Avatar</h4>
                            <Avatar>
                                <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="person face" />
                                <AvatarFallback name="John Doe">JD</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Alert</h4>
                            <Alert>
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>You can use alerts to notify the user of important information.</AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
        </div>
    </DesignSystemLayout>
  );
}
