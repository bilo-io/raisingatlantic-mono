import type {
  ClinicianForVerification,
  VerifiableRecord,
  VerifiableRecordType,
} from "@raising-atlantic/types";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import {
  Badge,
  Button,
  Card,
  ChipRow,
  EmptyState,
  ErrorState,
  Screen,
  Skeleton,
  Tabs,
  Text,
} from "../ui";
import {
  useVerificationsClinicians,
  useVerificationsRecords,
} from "../../lib/api/hooks/verifications";
import { useToastBridge } from "../../lib/api/toast-bridge";

type Props = {
  scope: "admin" | "clinician";
};

type QueueTab = "records" | "clinicians";

type RecordTypeFilter = "all" | VerifiableRecordType;
type ClinicianRegFilter = "all" | "hpcsa" | "sanc";

const RECORD_TYPE_OPTIONS: { value: RecordTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Growth", label: "Growth" },
  { value: "Milestone", label: "Milestone" },
  { value: "Vaccination", label: "Vaccination" },
];

const CLINICIAN_REG_OPTIONS: { value: ClinicianRegFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hpcsa", label: "HPCSA (Dr)" },
  { value: "sanc", label: "SANC (Sr)" },
];

export function VerificationsQueue({ scope }: Props) {
  const [tab, setTab] = React.useState<QueueTab>("records");
  const [recordTypeFilter, setRecordTypeFilter] = React.useState<RecordTypeFilter>("all");
  const [clinicianRegFilter, setClinicianRegFilter] = React.useState<ClinicianRegFilter>("all");

  const records = useVerificationsRecords();
  const clinicians = useVerificationsClinicians();
  const toast = useToastBridge();

  const filteredRecords = React.useMemo(() => {
    const data = records.data ?? [];
    if (recordTypeFilter === "all") return data;
    return data.filter((r) => r.type === recordTypeFilter);
  }, [records.data, recordTypeFilter]);

  const filteredClinicians = React.useMemo(() => {
    const data = clinicians.data ?? [];
    if (clinicianRegFilter === "all") return data;
    if (clinicianRegFilter === "hpcsa") {
      return data.filter((c) => c.title === "Dr");
    }
    return data.filter((c) => c.title === "Sr");
  }, [clinicians.data, clinicianRegFilter]);

  const headerTitle = scope === "admin" ? "Verifications" : "Verifications queue";
  const headerBlurb =
    scope === "admin"
      ? "All pending verifications across tenants."
      : "Records and clinicians awaiting your review.";

  const onApprove = (label: string) => toast.success(`Approved · ${label}`);
  const onRequestInfo = (label: string) => toast.info(`More info requested · ${label}`);
  const onReject = (label: string) => toast.error(`Rejected · ${label}`);

  return (
    <Screen scroll>
      <Text variant="label">{scope === "admin" ? "Admin" : "Clinician"}</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        {headerTitle}
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
        {headerBlurb}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Tabs<QueueTab>
          value={tab}
          onChange={setTab}
          options={[
            { value: "records", label: "Records" },
            { value: "clinicians", label: "Clinicians" },
          ]}
        />
      </View>

      {tab === "records" ? (
        <View style={{ marginTop: 16 }}>
          <ChipRow<RecordTypeFilter>
            options={RECORD_TYPE_OPTIONS}
            value={recordTypeFilter}
            onChange={setRecordTypeFilter}
          />
          <View style={{ marginTop: 16, gap: 12 }}>
            {records.isLoading ? (
              <SkeletonList />
            ) : records.error ? (
              <ErrorState
                title="Couldn't load records"
                message={records.error.message}
                onRetry={() => records.refetch()}
              />
            ) : filteredRecords.length === 0 ? (
              <EmptyState
                Icon={ShieldCheck}
                title="No pending records"
                body="All parent-logged records have been reviewed."
              />
            ) : (
              filteredRecords.map((rec) => (
                <RecordRow
                  key={rec.id}
                  record={rec}
                  onApprove={() => onApprove(`${rec.type} ${rec.id.slice(-4)}`)}
                  onRequestInfo={() => onRequestInfo(`${rec.type} ${rec.id.slice(-4)}`)}
                  onReject={() => onReject(`${rec.type} ${rec.id.slice(-4)}`)}
                />
              ))
            )}
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          {scope === "admin" ? (
            <ChipRow<ClinicianRegFilter>
              options={CLINICIAN_REG_OPTIONS}
              value={clinicianRegFilter}
              onChange={setClinicianRegFilter}
            />
          ) : null}
          <View style={{ marginTop: 16, gap: 12 }}>
            {clinicians.isLoading ? (
              <SkeletonList />
            ) : clinicians.error ? (
              <ErrorState
                title="Couldn't load clinicians"
                message={clinicians.error.message}
                onRetry={() => clinicians.refetch()}
              />
            ) : filteredClinicians.length === 0 ? (
              <EmptyState
                Icon={ShieldCheck}
                title="No clinicians pending"
                body="No HPCSA/SANC verifications awaiting review."
              />
            ) : (
              filteredClinicians.map((c) => (
                <ClinicianRow
                  key={c.id}
                  clinician={c}
                  onApprove={() => onApprove(c.name)}
                  onRequestInfo={() => onRequestInfo(c.name)}
                  onReject={() => onReject(c.name)}
                />
              ))
            )}
          </View>
        </View>
      )}
    </Screen>
  );
}

function RecordRow({
  record,
  onApprove,
  onRequestInfo,
  onReject,
}: {
  record: VerifiableRecord;
  onApprove: () => void;
  onRequestInfo: () => void;
  onReject: () => void;
}) {
  const date =
    record.type === "Growth"
      ? record.date
      : record.type === "Milestone"
        ? record.dateAchieved
        : record.dateAdministered;
  const detail =
    record.type === "Growth"
      ? `Weight ${record.weight ?? "—"}kg · Height ${record.height ?? "—"}cm`
      : record.type === "Milestone"
        ? record.milestoneId
        : `Vaccine ${record.vaccineId}`;

  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Badge label={record.type} variant="primary" />
        <Text variant="caption" tone="muted">
          {date}
        </Text>
      </View>
      <Text variant="bodyStrong" style={{ marginTop: 8 }}>
        {detail}
      </Text>
      <Text variant="caption" tone="muted" style={{ marginTop: 4 }}>
        Record ID · {record.id.slice(-8)}
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <Button
          label="Approve"
          size="sm"
          fullWidth={false}
          leftIcon={CheckCircle2}
          onPress={onApprove}
        />
        <Button
          label="Request info"
          size="sm"
          variant="outline"
          fullWidth={false}
          onPress={onRequestInfo}
        />
        <Button
          label="Reject"
          size="sm"
          variant="destructive"
          fullWidth={false}
          leftIcon={XCircle}
          onPress={onReject}
        />
      </View>
    </Card>
  );
}

function ClinicianRow({
  clinician,
  onApprove,
  onRequestInfo,
  onReject,
}: {
  clinician: ClinicianForVerification;
  onApprove: () => void;
  onRequestInfo: () => void;
  onReject: () => void;
}) {
  const regBoard = clinician.title === "Sr" ? "SANC" : "HPCSA";
  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Badge label={regBoard} variant="primary" />
        <Text variant="caption" tone="muted">
          Awaiting verification
        </Text>
      </View>
      <Text variant="bodyStrong" style={{ marginTop: 8 }}>
        {clinician.title ? `${clinician.title} ` : ""}
        {clinician.name}
      </Text>
      <Text variant="caption" tone="muted" style={{ marginTop: 4 }}>
        {clinician.email}
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <Button
          label="Approve"
          size="sm"
          fullWidth={false}
          leftIcon={CheckCircle2}
          onPress={onApprove}
        />
        <Button
          label="Request info"
          size="sm"
          variant="outline"
          fullWidth={false}
          onPress={onRequestInfo}
        />
        <Button
          label="Reject"
          size="sm"
          variant="destructive"
          fullWidth={false}
          leftIcon={XCircle}
          onPress={onReject}
        />
      </View>
    </Card>
  );
}

function SkeletonList() {
  return (
    <View style={{ gap: 12 }}>
      <Skeleton height={120} />
      <Skeleton height={120} />
      <Skeleton height={120} />
    </View>
  );
}
