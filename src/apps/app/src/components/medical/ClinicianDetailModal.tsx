
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Clinician } from "@/data/clinicians";
import { dummyPractices } from "@/data/practices";
import { Mail, Phone, Stethoscope, Briefcase } from "lucide-react";
import { RoleAvatar } from "@/components/ui/RoleAvatar";

interface ClinicianDetailModalProps {
  clinician: Clinician | null;
  onClose: () => void;
}

const practiceMap = new Map(dummyPractices.map(p => [p.id, p.name]));

export function ClinicianDetailModal({ clinician, onClose }: ClinicianDetailModalProps) {
  if (!clinician) return null;

  return (
    <Dialog open={!!clinician} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="items-center text-center pt-4">
          <RoleAvatar
            src={clinician.avatarUrl}
            name={clinician.name}
            role={clinician.role}
            aiHint={clinician.aiHint}
            avatarClassName="h-24 w-24 mb-4"
            fallbackClassName="text-3xl"
            iconContainerClassName="h-7 w-7 border-2"
            iconClassName="h-4 w-4"
          />
          <DialogTitle className="font-headline text-2xl">{(clinician.title || '') + ' ' + clinician.name}</DialogTitle>
          <DialogDescription className="flex items-center justify-center text-primary">
            <Stethoscope className="mr-2 h-4 w-4" />
            {clinician.specialty}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-2 space-y-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">{clinician.bio}</p>
          
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${clinician.email}`} className="text-sm text-foreground hover:underline">
                  {clinician.email}
                </a>
             </div>
             <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href={`tel:${clinician.phone}`} className="text-sm text-foreground hover:underline">
                    {clinician.phone}
                </a>
             </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 flex items-center text-sm">
                <Briefcase className="mr-2 h-4 w-4" />
                Practices
            </h4>
            <div className="flex flex-wrap gap-2">
              {clinician.practiceIds.map(id => (
                <Badge key={id} variant="secondary">
                  {practiceMap.get(id) || 'Unknown Practice'}
                </Badge>
              ))}
              {clinician.practiceIds.length === 0 && (
                 <p className="text-sm text-muted-foreground">Not currently affiliated with any practice.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
