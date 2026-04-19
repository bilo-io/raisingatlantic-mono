
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import type { Practice } from '@/lib/api/adapters/practice.adapter';

interface PracticeGridProps {
  practices: Practice[];
  onSelect: (practice: Practice) => void;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

export function PracticeGrid({ practices, onSelect, getStatusBadgeVariant }: PracticeGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {practices.map(practice => (
        <Card key={practice.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
             <div className="flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-md">
                    <Building className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                    <CardTitle className="font-headline text-lg">{practice.name}</CardTitle>
                    <CardDescription>{practice.city}</CardDescription>
                 </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow text-sm">
            <p className="text-muted-foreground line-clamp-2">{practice.address}</p>
            <Badge variant={getStatusBadgeVariant(practice.status)} className="mt-3">{practice.status}</Badge>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => onSelect(practice)}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
