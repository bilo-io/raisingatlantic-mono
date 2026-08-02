import type { ClinicianForVerification, VerifiableRecord } from "@raising-atlantic/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { useApi } from "../data-source";
import { useToastBridge } from "../toast-bridge";
import { verificationKeys } from "./verifications";

export type VerificationDecision = {
  outcome: "APPROVED" | "REJECTED" | "MORE_INFO";
  notes?: string;
};

export type RecordDecisionVars = { id: string; decision: VerificationDecision };
export type ClinicianDecisionVars = { id: string; decision: VerificationDecision };

type Activity = {
  id: string;
  at: string;
  kind: "record" | "clinician";
  outcome: VerificationDecision["outcome"];
  subject: string;
};

const RING_BUFFER: Activity[] = [];

export function recentVerificationActivity(): readonly Activity[] {
  return RING_BUFFER;
}

function record(activity: Activity) {
  RING_BUFFER.unshift(activity);
  if (RING_BUFFER.length > 5) RING_BUFFER.length = 5;
}

export function useDecideRecordVerification() {
  const qc = useQueryClient();
  const toastBridge = useToastBridge();

  return useMutation<{ id: string }, Error, RecordDecisionVars>({
    mutationFn: async (vars) => {
      if (useApi()) {
        await api.patch(`/verifications/records/${vars.id}`, vars.decision);
      }
      return { id: vars.id };
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: verificationKeys.records() });
      const previous = qc.getQueryData<VerifiableRecord[]>(verificationKeys.records());
      qc.setQueryData<VerifiableRecord[]>(verificationKeys.records(), (old) =>
        old ? old.filter((r) => r.id !== id) : old,
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      const previous = (ctx as { previous?: VerifiableRecord[] } | undefined)?.previous;
      if (previous) {
        qc.setQueryData(verificationKeys.records(), previous);
      }
      toastBridge.error("Could not record decision", err.message);
    },
    onSuccess: (_data, vars) => {
      const subject = vars.id;
      record({
        id: `${Date.now()}-${vars.id}`,
        at: new Date().toISOString(),
        kind: "record",
        outcome: vars.decision.outcome,
        subject,
      });
      toastBridge.success(decisionToastLabel(vars.decision.outcome));
    },
  });
}

export function useDecideClinicianVerification() {
  const qc = useQueryClient();
  const toastBridge = useToastBridge();

  return useMutation<{ id: string }, Error, ClinicianDecisionVars>({
    mutationFn: async (vars) => {
      if (useApi()) {
        await api.patch(`/verifications/clinicians/${vars.id}`, vars.decision);
      }
      return { id: vars.id };
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: verificationKeys.clinicians() });
      const previous = qc.getQueryData<ClinicianForVerification[]>(
        verificationKeys.clinicians(),
      );
      qc.setQueryData<ClinicianForVerification[]>(verificationKeys.clinicians(), (old) =>
        old ? old.filter((c) => c.id !== id) : old,
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      const previous = (ctx as { previous?: ClinicianForVerification[] } | undefined)?.previous;
      if (previous) {
        qc.setQueryData(verificationKeys.clinicians(), previous);
      }
      toastBridge.error("Could not record decision", err.message);
    },
    onSuccess: (_data, vars) => {
      record({
        id: `${Date.now()}-${vars.id}`,
        at: new Date().toISOString(),
        kind: "clinician",
        outcome: vars.decision.outcome,
        subject: vars.id,
      });
      toastBridge.success(decisionToastLabel(vars.decision.outcome));
    },
  });
}

function decisionToastLabel(outcome: VerificationDecision["outcome"]) {
  if (outcome === "APPROVED") return "Approved";
  if (outcome === "REJECTED") return "Rejected";
  return "More info requested";
}
