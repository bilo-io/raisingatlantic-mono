import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import type { MfaSetupInfo } from "../../auth/provider";
import { Button, Card, FormField, Screen, Text, toast } from "../../components/ui";
import { mfaCodeSchema, type MfaCodeValues } from "../../lib/forms/schemas/auth";
import { useZodForm } from "../../lib/forms";
import { consumePendingDeepLink } from "../../lib/linking/pending";

export default function MfaScreen() {
  const { user, pendingMfa, completeMfaSignIn, startMfaSetup } = useAuth();
  const router = useRouter();
  const [setupInfo, setSetupInfo] = useState<MfaSetupInfo | null>(null);
  const form = useZodForm<MfaCodeValues>(mfaCodeSchema, {
    defaultValues: { code: "" },
  });

  const setupRequired = pendingMfa?.setupRequired ?? false;

  useEffect(() => {
    if (!pendingMfa && !user) {
      router.replace("/(auth)/login" as any);
      return;
    }
    if (setupRequired && !setupInfo) {
      startMfaSetup()
        .then(setSetupInfo)
        .catch((err: unknown) => {
          toast.error("Could not start MFA setup", {
            description: err instanceof Error ? err.message : undefined,
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMfa, setupRequired]);

  useEffect(() => {
    if (user) {
      const pending = consumePendingDeepLink();
      router.replace((pending ?? `/(app)/(${user.role})/dashboard`) as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function onSubmit(values: MfaCodeValues) {
    try {
      await completeMfaSignIn(values.code);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid code";
      toast.error("Verification failed", { description: message });
    }
  }

  return (
    <Screen edges={["top", "bottom"]} contentStyle={{ justifyContent: "center", flex: 1 }}>
      <Card padding="lg" elevated>
        <Text variant="subheading">
          {setupRequired ? "Set up two-factor authentication" : "Two-factor authentication"}
        </Text>
        <Text variant="muted" style={{ marginTop: 4, marginBottom: 16 }}>
          {setupRequired
            ? "Your role requires an authenticator app. Add the secret below to Google Authenticator, 1Password, or similar, then enter the 6-digit code."
            : "Enter the 6-digit code from your authenticator app."}
        </Text>

        {setupRequired ? (
          <View style={{ marginBottom: 16, gap: 6 }}>
            <Text variant="label">Authenticator secret</Text>
            <Text variant="bodyStrong" selectable accessibilityLabel="Authenticator secret">
              {setupInfo?.secret ?? "Loading…"}
            </Text>
            {setupInfo?.otpauthUrl ? (
              <Text variant="muted" selectable numberOfLines={2}>
                {setupInfo.otpauthUrl}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ gap: 12 }}>
          <FormField
            name="code"
            control={form.control}
            label="6-digit code"
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button
            label={setupRequired ? "Enable and sign in" : "Verify"}
            onPress={form.handleSubmit(onSubmit)}
            loading={form.formState.isSubmitting}
          />
          <Button
            label="Back to sign in"
            variant="ghost"
            onPress={() => router.replace("/(auth)/login" as any)}
          />
        </View>
      </Card>
    </Screen>
  );
}
