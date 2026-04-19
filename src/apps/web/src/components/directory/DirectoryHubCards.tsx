
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DirectorySection {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface DirectoryHubCardsProps {
  sections: DirectorySection[];
  className?: string;
}

export function DirectoryHubCards({ sections, className }: DirectoryHubCardsProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {sections.map((section) => (
        <Link href={section.href} key={section.title} className="group">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-primary">
            <CardHeader className="items-center text-center">
              <section.icon className="h-12 w-12 text-primary mb-3 transition-transform group-hover:scale-110" />
              <CardTitle className="font-headline text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-center">
                {section.description}
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
