
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/layout/SiteLogo";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
        
        <DialogHeader className="items-center pt-8 pb-4">
          <div className="mb-6 p-4 bg-primary/5 rounded-2xl transform transition-transform hover:scale-105 duration-300">
            <SiteLogo width={200} height={50} />
          </div>
          <DialogTitle className="font-headline text-2xl text-center mb-2">
            Unlock Full Access
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed text-muted-foreground px-4">
            Join the RaisingAtlantic community to view direct contact details, 
            full profiles, and book appointments with our health professionals.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 pb-4 px-6 bg-muted/50">
          <Button variant="ghost" onClick={onClose} className="flex-1 order-2 sm:order-1">
            Browse as Guest
          </Button>
          <Button asChild className="flex-1 order-1 sm:order-2 shadow-lg shadow-primary/20">
            <Link href="/login" className="flex items-center justify-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to View
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 order-1 sm:order-2">
            <Link href="/login/test" className="flex items-center justify-center">
              Login Test
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
