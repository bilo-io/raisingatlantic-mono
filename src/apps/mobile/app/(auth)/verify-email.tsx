import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Card, FormField, Input, Screen, Text, toast } from "../../components/ui";
import { api } from "../../lib/api/client";
import {
  verifyEmailSchema,
  type VerifyEmailValues,
} from "../../lib/forms/schemas/auth";
import { useZodForm } from "../../lib/forms";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [resendEmail, setResendEmail] = useState("");
  const form = useZodForm<VerifyEmailValues>(verifyEmailSchema, {
    defaultValues: { token: token ?? "" },
  });

  async function onSubmit(values: VerifyEmailValues) {
    try {
      await api.post("/auth/verify-email", { token: values.token });
      toast.success("Email verified", { description: "You can sign in now." });
      router.replace("/(auth)/login" as any);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      toast.error("Could not verify", { description: message });
    }
  }

  // Deep-linked tokens verify immediately — no manual step.
  useEffect(() => {
    if (token) void form.handleSubmit(onSubmit)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Screen edges={["top", "bottom"]} contentStyle={{ justifyContent: "center", flex: 1 }}>
      <Card padding="lg" elevated>
        <Text variant="subheading">Verify your email</Text>
        <Text variant="muted" style={{ marginTop: 4, marginBottom: 16 }}>
          Open the link in your verification email on this device, or paste the
          token below.
        </Text>
        <View style={{ gap: 12 }}>
          <FormField
            name="token"
            control={form.control}
            label="Verification token"
            autoCapitalize="none"
          />
          <Button
            label="Verify"
            onPress={form.handleSubmit(onSubmit)}
            loading={form.formState.isSubmitting}
          />
        </View>
        <View style={{ marginTop: 18, gap: 8 }}>
          <Text variant="muted">Didn&apos;t get the email?</Text>
          <Input
            placeholder="Account email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={resendEmail}
            onChangeText={setResendEmail}
          />
          <Button
            label="Resend verification email"
            variant="outline"
            onPress={async () => {
              if (!resendEmail.includes("@")) {
                toast.error("Enter your account email first");
                return;
              }
              await api
                .post("/auth/verify-email/request", { email: resendEmail })
                .catch(() => undefined);
              toast.success("Sent", {
                description: "If that address has an unverified account, a new link is on its way.",
              });
            }}
          />
          <Button label="Back to sign in" variant="ghost" onPress={() => router.replace("/(auth)/login" as any)} />
        </View>
      </Card>
    </Screen>
  );
}
