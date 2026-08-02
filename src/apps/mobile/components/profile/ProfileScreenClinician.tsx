import React from "react";
import { View } from "react-native";
import { findClinicianExtension } from "../../auth/clinician-extensions";
import { useAuth } from "../../auth/useAuth";
import { useActivePractice } from "../../context/ActivePracticeContext";
import { Badge, Card, KeyValueRow, Text } from "../ui";
import { ProfileScreenBase } from "./ProfileScreenBase";

export function ProfileScreenClinician() {
  const { user } = useAuth();
  const { practice, practices } = useActivePractice();
  // Prefer the API-sourced ClinicianProfile (HPCSA/SANC + verification status);
  // fall back to the mock-only fixture shim when the profile isn't populated
  // (e.g. EXPO_PUBLIC_USE_API=false). See MOBILE_PHASE_M2_TODO.md (G-CLIN-01).
  const profile = user?.clinicianProfile;
  const extension = findClinicianExtension(user?.id);

  const registryLabel = profile?.hpcsaNumber
    ? "HPCSA"
    : profile?.sancNumber
      ? "SANC"
      : extension?.registry ?? "HPCSA / SANC";
  const registryNumber =
    profile?.hpcsaNumber ?? profile?.sancNumber ?? extension?.registryNumber ?? "Not set";
  const verificationStatus = profile?.verificationStatus ?? extension?.verificationStatus;

  return (
    <ProfileScreenBase>
      <Text variant="label" style={{ marginBottom: 10 }}>
        Practitioner
      </Text>
      <Card style={{ marginBottom: 22 }}>
        <KeyValueRow label={registryLabel} value={registryNumber} />
        <KeyValueRow
          label="Clinical role"
          value={extension?.clinicalRole ?? "Not set"}
        />
        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10 }}>
          <Text variant="muted" style={{ flex: 1 }}>
            Verification
          </Text>
          {verificationStatus === "verified" ? (
            <Badge label="Verified" variant="primary" />
          ) : verificationStatus === "rejected" ? (
            <Badge label="Rejected" variant="destructive" />
          ) : (
            <Badge label="Pending" variant="muted" />
          )}
        </View>
      </Card>

      <Text variant="label" style={{ marginBottom: 10 }}>
        Practices
      </Text>
      <Card style={{ marginBottom: 22 }}>
        {practices.length === 0 ? (
          <Text variant="muted">No practice affiliations on file.</Text>
        ) : (
          practices.map((p) => (
            <KeyValueRow
              key={p.id}
              label={p.city}
              value={`${p.name}${p.id === practice?.id ? " (active)" : ""}`}
            />
          ))
        )}
      </Card>
    </ProfileScreenBase>
  );
}
