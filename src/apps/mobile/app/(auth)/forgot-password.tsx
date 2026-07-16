import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, Card, FormField, Screen, Text, toast } from "../../components/ui";
import { api } from "../../lib/api/client";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../../lib/forms/schemas/auth";
import { useZodForm } from "../../lib/forms";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const form = useZodForm<ForgotPasswordValues>(forgotPasswordSchema, {
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    try {
      await api.post("/auth/password-reset/request", { email: values.email });
    } catch {
      // Same messaging on failure — the response must not reveal whether the
      // address is registered.
    }
    toast.success("Check your inbox", {
      description: "If that address has an account, a reset link is on its way.",
    });
    router.push("/(auth)/reset-password" as any);
  }

  return (
    <Screen edges={["top", "bottom"]} contentStyle={{ justifyContent: "center", flex: 1 }}>
      <Card padding="lg" elevated>
        <Text variant="subheading">Reset your password</Text>
        <Text variant="muted" style={{ marginTop: 4, marginBottom: 16 }}>
          We&apos;ll email you a reset link valid for one hour.
        </Text>
        <View style={{ gap: 12 }}>
          <FormField
            name="email"
            control={form.control}
            label="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
          <Button
            label="Send reset link"
            onPress={form.handleSubmit(onSubmit)}
            loading={form.formState.isSubmitting}
          />
          <Button label="Back to sign in" variant="ghost" onPress={() => router.back()} />
        </View>
      </Card>
    </Screen>
  );
}
