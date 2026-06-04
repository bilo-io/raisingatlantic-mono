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
  // TODO: source HPCSA/SANC, verification status, and clinical role from the API once
  // ClinicianProfile carries these fields. See MOBILE_PHASE_M2_TODO.md (G-CLIN-01).
  const extension = findClinicianExtension(user?.id);

  return (
    <ProfileScreenBase>
      <Text variant="label" style={{ marginBottom: 10 }}>
        Practitioner
      </Text>
      <Card style={{ marginBottom: 22 }}>
        <KeyValueRow
          label={extension ? extension.registry : "HPCSA / SANC"}
          value={extension?.registryNumber ?? "Not set"}
        />
        <KeyValueRow
          label="Clinical role"
          value={extension?.clinicalRole ?? "Not set"}
        />
        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10 }}>
          <Text variant="muted" style={{ flex: 1 }}>
            Verification
          </Text>
          {extension?.verificationStatus === "verified" ? (
            <Badge label="Verified" variant="primary" />
          ) : extension?.verificationStatus === "rejected" ? (
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
