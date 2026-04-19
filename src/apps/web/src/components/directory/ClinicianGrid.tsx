
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleAvatar } from '@/components/ui/RoleAvatar';

interface ClinicianGridProps {
  clinicians: any[];
  onSelect: (clinician: any) => void;
  practiceNameMap: Map<string, string>;
}

export function ClinicianGrid({ clinicians, onSelect, practiceNameMap }: ClinicianGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {clinicians.map(clinician => (
        <Card key={clinician.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="items-center text-center pb-4">
            <RoleAvatar
              src={clinician.imageUrl}
              name={clinician.name}
              role={clinician.role}
              avatarClassName="h-24 w-24 mb-4"
              fallbackClassName="text-3xl"
              iconContainerClassName="h-7 w-7 border-2"
              iconClassName="h-4 w-4"
            />
            <CardTitle className="font-headline text-lg">{(clinician.title || '') + ' ' + clinician.name}</CardTitle>
            <CardDescription className="text-primary">{clinician.specialty}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow text-sm text-muted-foreground text-center">
            <p className="mb-4 line-clamp-3">{clinician.bio}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {clinician.practiceIds?.map((id: string) => (
                <Badge key={id} variant="secondary">
                  {practiceNameMap.get(id) || 'Unknown Practice'}
                </Badge>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t mt-auto">
            <Button variant="outline" size="sm" className="w-full" onClick={() => onSelect(clinician)}>
              View Profile
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
