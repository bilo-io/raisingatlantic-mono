
"use client";

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Practice } from '@/lib/api/adapters/practice.adapter';

interface PracticeListProps {
  practices: Practice[];
  onSelect: (practice: Practice) => void;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

export function PracticeList({ practices, onSelect, getStatusBadgeVariant }: PracticeListProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">City</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {practices.map((practice) => (
            <TableRow key={practice.id}>
              <TableCell>
                <button onClick={() => onSelect(practice)} className="font-medium hover:underline text-left">
                  {practice.name}
                </button>
              </TableCell>
              <TableCell className="hidden md:table-cell">{practice.city}</TableCell>
              <TableCell className="hidden lg:table-cell">{practice.phone}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(practice.status)}>{practice.status}</Badge>
              </TableCell>
              <TableCell>
                 <Button variant="ghost" size="sm" onClick={() => onSelect(practice)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
