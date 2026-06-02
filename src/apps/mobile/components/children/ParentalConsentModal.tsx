import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { BottomSheet, Button, Text, toast } from "../ui";
import { useTheme } from "../../theme/useTheme";

const STORAGE_KEY = "@ra/parental-consent";
const CONSENT_VERSION = "1.0";

export type ParentalConsentRecord = {
  version: string;
  userId: string;
  grantedAt: string;
};

export async function readConsent(): Promise<ParentalConsentRecord | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParentalConsentRecord;
  } catch {
    return null;
  }
}

export async function hasValidConsent(userId: string | undefined | null): Promise<boolean> {
  if (!userId) return false;
  const record = await readConsent();
  return !!record && record.userId === userId && record.version === CONSENT_VERSION;
}

export type ParentalConsentModalRef = {
  open: () => void;
};

type Props = {
  onConsent: () => void;
};

export const ParentalConsentModal = forwardRef<ParentalConsentModalRef, Props>(
  function ParentalConsentModal({ onConsent }, ref) {
    const sheetRef = useRef<BottomSheetModal>(null);
    const { user } = useAuth();
    const { tokens } = useTheme();
    const [checked, setChecked] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setChecked(false);
        sheetRef.current?.present();
      },
    }));

    async function grant() {
      if (!user) return;
      const record: ParentalConsentRecord = {
        version: CONSENT_VERSION,
        userId: user.id,
        grantedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      sheetRef.current?.dismiss();
      toast.success("Consent recorded");
      onConsent();
    }

    return (
      <BottomSheet ref={sheetRef} snapPoints={["75%", "95%"]}>
        <Text variant="heading" style={{ marginBottom: 12 }}>
          Parental consent
        </Text>
        <Text variant="body" tone="muted" style={{ marginBottom: 16 }}>
          South Africa&apos;s Protection of Personal Information Act (POPIA) treats children&apos;s
          health information as Special Personal Information.
        </Text>
        <Text variant="body" style={{ marginBottom: 16 }}>
          By recording a child on Raising Atlantic, you confirm:
        </Text>
        <View style={{ gap: 10, marginBottom: 20 }}>
          <Text variant="body">• You are the parent or legal guardian of the child.</Text>
          <Text variant="body">
            • You consent to the secure storage and processing of the child&apos;s growth,
            milestone, and immunisation records to provide paediatric care services.
          </Text>
          <Text variant="body">
            • You understand records may be shared with verified clinicians and your selected
            practice for care delivery.
          </Text>
          <Text variant="body">
            • You may withdraw consent and request data export or deletion at any time from
            Profile.
          </Text>
        </View>
        <Pressable
          onPress={() => setChecked((v) => !v)}
          style={{ flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 24 }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: checked ? tokens.primary : tokens.border,
              backgroundColor: checked ? tokens.primary : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            {checked ? (
              <Text variant="bodyStrong" tone="onPrimary" style={{ fontSize: 14 }}>
                ✓
              </Text>
            ) : null}
          </View>
          <Text variant="body" style={{ flex: 1 }}>
            I am the parent or legal guardian and I consent to processing my child&apos;s health
            information under POPIA.
          </Text>
        </Pressable>
        <Button
          label="Grant consent"
          onPress={grant}
          disabled={!checked}
          fullWidth
        />
      </BottomSheet>
    );
  },
);
