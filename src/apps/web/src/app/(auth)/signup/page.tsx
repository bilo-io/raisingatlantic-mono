"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Stethoscope, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function SignupHubPage() {
  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mb-8 block">
              <div className="flex justify-center h-[162px]">
                <img src="/assets/images/app-branding-light.svg" alt="Raising Atlantic" className="h-full dark:hidden" />
                <img src="/assets/images/app-branding-dark.svg" alt="Raising Atlantic" className="h-full hidden dark:block" />
              </div>
            </Link>
            <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
            <CardDescription>Choose your account type to proceed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Link href="/signup/member" className="block w-full group">
                <div className="w-full h-auto p-6 flex items-start justify-between border border-white/10 bg-background/50 rounded-xl transition-all duration-300 text-left group-active:scale-[0.98] group-hover-gradient-border">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover:bg-primary/20">
                      <User className="h-6 w-6 transition-all duration-300 group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 transition-all duration-300 group-hover:text-primary-gradient">Member</h3>
                      <p className="text-muted-foreground text-sm font-normal text-wrap">
                        For parents, guardians, and patients seeking access to services.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground self-center transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                </div>
              </Link>

              <Link href="/signup/clinician" className="block w-full group">
                <div className="w-full h-auto p-6 flex items-start justify-between border border-white/10 bg-background/50 rounded-xl transition-all duration-300 text-left group-active:scale-[0.98] group-hover-gradient-border">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover:bg-primary/20">
                      <Stethoscope className="h-6 w-6 transition-all duration-300 group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 transition-all duration-300 group-hover:text-primary-gradient">Clinician</h3>
                      <p className="text-muted-foreground text-sm font-normal text-wrap">
                        For doctors, therapists, practitioners, and other providers.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground self-center transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </CardContent>
          <div className="mt-2 p-6 text-center text-sm border-t">
            Already have an account?{" "}
            <Link href="/login/test" className="underline text-primary font-semibold">
              Log in
            </Link>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
