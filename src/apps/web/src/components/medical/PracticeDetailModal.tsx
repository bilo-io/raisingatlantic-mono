
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Practice } from "@/data/practices";
import { MapPin, Phone, Globe, User, Building, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoginPromptModal } from "@/components/directory/LoginPromptModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PracticeDetailModalProps {
  practice: Practice | null;
  onClose: () => void;
  isPublic?: boolean;
}

export function PracticeDetailModal({ practice, onClose, isPublic = false }: PracticeDetailModalProps) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (!practice) return null;
  
  const getStatusBadgeVariant = (status: Practice['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Temporarily Closed': return 'destructive';
      default: return 'default';
    }
  };

  const handleMaskedClick = (e: React.MouseEvent) => {
    if (isPublic) {
      e.preventDefault();
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
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
              <div className="flex items-start gap-3 p-2 rounded-lg transition-colors">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                  <p className="text-sm text-foreground">
                      {practice.address}<br/>
                      {practice.city}, {practice.state} {practice.zip}
                  </p>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isPublic ? 'cursor-pointer hover:bg-muted' : ''}`}
                      onClick={handleMaskedClick}
                    >
                        <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                        {isPublic ? (
                          <div className="flex items-center gap-2 text-sm text-foreground/50 italic blur-sm select-none">
                            {practice.phone}
                          </div>
                        ) : (
                          <a href={`tel:${practice.phone}`} className="text-sm text-foreground hover:underline">
                              {practice.phone}
                          </a>
                        )}
                        {isPublic && <Lock className="h-3 w-3 text-muted-foreground/50" />}
                    </div>
                  </TooltipTrigger>
                  {isPublic && <TooltipContent>Click to view phone number</TooltipContent>}
                </Tooltip>
              </TooltipProvider>

              {practice.website && (
                  <div className="flex items-center gap-3 p-2">
                      <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                      <a href={practice.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          Visit Website
                      </a>
                  </div>
              )}
              
              {practice.manager && (
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <div 
                           className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isPublic ? 'cursor-pointer hover:bg-muted' : ''}`}
                           onClick={handleMaskedClick}
                         >
                            <User className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="text-sm text-foreground">
                                <span className="text-muted-foreground">Manager:</span>{' '}
                                {isPublic ? (
                                  <span className="text-foreground/50 italic blur-sm select-none">
                                    {practice.manager}
                                  </span>
                                ) : (
                                  practice.manager
                                )}
                            </div>
                            {isPublic && <Lock className="h-3 w-3 text-muted-foreground/50 ml-auto" />}
                         </div>
                       </TooltipTrigger>
                       {isPublic && <TooltipContent>Click to view manager contact</TooltipContent>}
                     </Tooltip>
                   </TooltipProvider>
              )}
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
