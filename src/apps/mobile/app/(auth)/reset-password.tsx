import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, Card, FormField, Screen, Text, toast } from "../../components/ui";
import { api } from "../../lib/api/client";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "../../lib/forms/schemas/auth";
import { useZodForm } from "../../lib/forms";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const form = useZodForm<ResetPasswordValues>(resetPasswordSchema, {
    defaultValues: { token: token ?? "", newPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    try {
      await api.post("/auth/password-reset", {
        token: values.token,
        newPassword: values.newPassword,
      });
      toast.success("Password updated", {
        description: "Sign in with your new password.",
      });
      router.replace("/(auth)/login" as any);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not reset";
      toast.error("Reset failed", { description: message });
    }
  }

  return (
    <Screen edges={["top", "bottom"]} contentStyle={{ justifyContent: "center", flex: 1 }}>
      <Card padding="lg" elevated>
        <Text variant="subheading">Choose a new password</Text>
        <Text variant="muted" style={{ marginTop: 4, marginBottom: 16 }}>
          {token
            ? "Set the new password for your account."
            : "Paste the token from the reset email, then set a new password."}
        </Text>
        <View style={{ gap: 12 }}>
          {!token ? (
            <FormField
              name="token"
              control={form.control}
              label="Reset token"
              autoCapitalize="none"
            />
          ) : null}
          <FormField
            name="newPassword"
            control={form.control}
            label="New password"
            secureTextEntry
          />
          <Button
            label="Set new password"
            onPress={form.handleSubmit(onSubmit)}
            loading={form.formState.isSubmitting}
          />
          <Button label="Back to sign in" variant="ghost" onPress={() => router.replace("/(auth)/login" as any)} />
        </View>
      </Card>
    </Screen>
  );
}
