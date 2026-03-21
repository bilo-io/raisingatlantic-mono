
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Practice } from "@/data/practices";
import { MapPin, Phone, Globe, User, Building } from "lucide-react";
import Link from "next/link";

interface PracticeDetailModalProps {
  practice: Practice | null;
  onClose: () => void;
}

export function PracticeDetailModal({ practice, onClose }: PracticeDetailModalProps) {
  if (!practice) return null;
  
  const getStatusBadgeVariant = (status: Practice['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Temporarily Closed': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Dialog open={!!practice} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pt-4">
            <div className="flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-md">
                    <Building className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                    <DialogTitle className="font-headline text-2xl">{practice.name}</DialogTitle>
                    <DialogDescription className="flex items-center">
                        <Badge variant={getStatusBadgeVariant(practice.status)}>{practice.status}</Badge>
                    </DialogDescription>
                 </div>
            </div>
        </DialogHeader>
        <div className="py-4 px-2 space-y-4">
            <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                <p className="text-sm text-foreground">
                    {practice.address}<br/>
                    {practice.city}, {practice.state} {practice.zip}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                <a href={`tel:${practice.phone}`} className="text-sm text-foreground hover:underline">
                    {practice.phone}
                </a>
            </div>
            {practice.website && (
                <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a href={practice.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        Visit Website
                    </a>
                </div>
            )}
            {practice.manager && (
                 <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">Manager:</span> {practice.manager}
                    </p>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
