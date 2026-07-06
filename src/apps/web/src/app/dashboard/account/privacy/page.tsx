"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Download, FileText, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/useToast";
import { downloadMyDataJson, downloadMyDataPdf, requestErasure } from "@/lib/api/privacy";
import { logout } from "@/lib/auth";

export default function PrivacyPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState<"json" | "pdf" | "delete" | null>(null);

  const runExport = async (kind: "json" | "pdf", fn: () => Promise<void>) => {
    setBusy(kind);
    try {
      await fn();
      addToast({
        type: "success",
        title: "Export started",
        description: `Your data export (${kind.toUpperCase()}) is downloading.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Export failed",
        description: (err as { message?: string })?.message ?? "Please try again.",
      });
    } finally {
      setBusy(null);
    }
  };

  const handleErasure = async () => {
    setBusy("delete");
    try {
      const result = await requestErasure();
      addToast({
        type: "success",
        title: "Account scheduled for deletion",
        description: `Your account is now deactivated. All data is permanently erased on ${new Date(
          result.scheduledHardDeleteAt,
        ).toLocaleDateString()} unless you contact support to cancel.`,
      });
      await logout();
      router.push("/");
    } catch (err) {
      addToast({
        type: "error",
        title: "Error",
        description: (err as { message?: string })?.message ?? "Could not process the request.",
      });
      setBusy(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
        <h1 className="font-headline text-3xl font-bold tracking-tight">Privacy &amp; Your Data</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Download className="mr-2 h-5 w-5 text-primary" />Download your data
          </CardTitle>
          <CardDescription>
            Under POPIA you can request a copy of all personal information we hold about you and your
            children. The export includes profiles, growth records, milestones, vaccinations, allergies,
            medical conditions, appointments and reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => runExport("json", downloadMyDataJson)} disabled={busy !== null}>
            <Download className="mr-2 h-4 w-4" />
            {busy === "json" ? "Preparing…" : "Download JSON"}
          </Button>
          <Button
            variant="outline"
            onClick={() => runExport("pdf", downloadMyDataPdf)}
            disabled={busy !== null}
          >
            <FileText className="mr-2 h-4 w-4" />
            {busy === "pdf" ? "Preparing…" : "Download PDF"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-destructive">
            <Trash2 className="mr-2 h-5 w-5" />Delete your account
          </CardTitle>
          <CardDescription>Exercise your POPIA right to erasure.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your account is deactivated immediately and permanently erased after a 30-day grace period.
            During that window, contact support to cancel. Clinical records recorded by a clinician are
            retained where the law requires, with your identifying details removed.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={busy !== null}>
                Delete my account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This deactivates your account now and schedules permanent deletion of your data —
                  including your children&apos;s profiles and records — after 30 days.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleErasure}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
