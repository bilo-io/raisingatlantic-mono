
"use client";

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoleAvatar } from '@/components/ui/RoleAvatar';

interface ClinicianListProps {
  clinicians: any[];
  onSelect: (clinician: any) => void;
  practiceNameMap: Map<string, string>;
}

export function ClinicianList({ clinicians, onSelect, practiceNameMap }: ClinicianListProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead className="hidden lg:table-cell">Practices</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinicians.map(clinician => (
            <TableRow key={clinician.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <RoleAvatar
                    src={clinician.imageUrl}
                    name={clinician.name}
                    role={clinician.role}
                    avatarClassName="h-10 w-10"
                    iconContainerClassName="h-5 w-5 border-2"
                    iconClassName="h-3 w-3"
                  />
                  <span className="font-medium">{(clinician.title || '') + ' ' + clinician.name}</span>
                </div>
              </TableCell>
              <TableCell>{clinician.specialty}</TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {clinician.practiceIds?.map((id: string) => (
                    <Badge key={id} variant="secondary">{practiceNameMap.get(id) || 'N/A'}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onSelect(clinician)}>
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
