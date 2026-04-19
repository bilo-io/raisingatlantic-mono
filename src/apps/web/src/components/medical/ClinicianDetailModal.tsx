
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Clinician } from "@/data/clinicians";
import { dummyPractices } from "@/data/practices";
import { Mail, Phone, Stethoscope, Briefcase, Lock } from "lucide-react";
import { RoleAvatar } from "@/components/ui/RoleAvatar";
import { useState } from "react";
import { LoginPromptModal } from "@/components/directory/LoginPromptModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ClinicianDetailModalProps {
  clinician: Clinician | null;
  onClose: () => void;
  isPublic?: boolean;
}

const practiceMap = new Map(dummyPractices.map(p => [p.id, p.name]));

export function ClinicianDetailModal({ clinician, onClose, isPublic = false }: ClinicianDetailModalProps) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (!clinician) return null;

  const handleMaskedClick = (e: React.MouseEvent) => {
    if (isPublic) {
      e.preventDefault();
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <Dialog open={!!clinician} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="items-center text-center pt-4">
            <RoleAvatar
              src={clinician.imageUrl}
              name={clinician.name}
              role={clinician.role}
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
               <TooltipProvider>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <div 
                       className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isPublic ? 'cursor-pointer hover:bg-muted' : ''}`}
                       onClick={handleMaskedClick}
                     >
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        {isPublic ? (
                          <div className="flex items-center gap-2 text-sm text-foreground/50 italic blur-sm select-none">
                            {clinician.email}
                          </div>
                        ) : (
                          <a href={`mailto:${clinician.email}`} className="text-sm text-foreground hover:underline">
                            {clinician.email}
                          </a>
                        )}
                        {isPublic && <Lock className="h-3 w-3 text-muted-foreground/50" />}
                     </div>
                   </TooltipTrigger>
                   {isPublic && <TooltipContent>Click to view contact info</TooltipContent>}
                 </Tooltip>

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <div 
                       className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isPublic ? 'cursor-pointer hover:bg-muted' : ''}`}
                       onClick={handleMaskedClick}
                     >
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        {isPublic ? (
                          <div className="flex items-center gap-2 text-sm text-foreground/50 italic blur-sm select-none">
                            {clinician.phone}
                          </div>
                        ) : (
                          <a href={`tel:${clinician.phone}`} className="text-sm text-foreground hover:underline">
                              {clinician.phone}
                          </a>
                        )}
                        {isPublic && <Lock className="h-3 w-3 text-muted-foreground/50" />}
                     </div>
                   </TooltipTrigger>
                   {isPublic && <TooltipContent>Click to view phone number</TooltipContent>}
                 </Tooltip>
               </TooltipProvider>
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

      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
      />
    </>
  );
}
