import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { Role } from "../../auth/types";
import { Branding } from "../../components/Branding";
import { GradientBlob, GradientBlobBottom } from "../../components/GradientBlob";
import {
  Button,
  Card,
  FormField,
  Screen,
  Separator,
  Text,
  toast,
} from "../../components/ui";
import { useApi } from "../../lib/api/data-source";
import { signInSchema, type SignInValues } from "../../lib/forms/schemas/auth";
import { useZodForm } from "../../lib/forms";
import { consumePendingDeepLink } from "../../lib/linking/pending";

export default function LoginScreen() {
  const { user, signInAs, signInWithPassword } = useAuth();
  const router = useRouter();
  const form = useZodForm<SignInValues>(signInSchema, {
    defaultValues: { email: "", password: "" },
  });

  const goHome = (role: Role) => {
    const pending = consumePendingDeepLink();
    router.replace((pending ?? `/(app)/(${role})/dashboard`) as any);
  };

  // Navigation happens once, from the user-effect below — goHome consumes the
  // pending deep link, so a second call would override the deep-link target.
  const handleRole = async (role: Role) => {
    await signInAs(role);
  };

  async function onSubmit(values: SignInValues) {
    if (!useApi()) {
      // Fixture mode has no credential store — the role buttons below are the
      // supported dev path.
      toast.info("Fixture mode", {
        description: "Use a test sign-in button below.",
      });
      return;
    }
    try {
      const outcome = await signInWithPassword(values.email, values.password);
      if (outcome === "mfa") {
        router.push("/(auth)/mfa" as any);
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      toast.error("Could not sign in", { description: message });
    }
  }

  // Single navigation source: route once the context reflects a session,
  // whether it came from the fixture role buttons or the password flow.
  React.useEffect(() => {
    if (user) goHome(user.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <GradientBlob />
      <GradientBlobBottom />
      <Screen edges={["top", "bottom"]} contentStyle={{ justifyContent: "center", flex: 1 }}>
        <Card padding="lg" elevated>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Branding variant="icon" width={72} height={72} />
          </View>

          <Text variant="subheading" style={{ textAlign: "center" }}>
            Welcome back
          </Text>
          <Text
            variant="muted"
            style={{ textAlign: "center", marginTop: 4, marginBottom: 20 }}
          >
            Sign in to continue
          </Text>

          <View style={{ gap: 12, marginBottom: 12 }}>
            <FormField
              name="email"
              control={form.control}
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <FormField
              name="password"
              control={form.control}
              label="Password"
              secureTextEntry
            />
            <Button
              label="Sign in"
              onPress={form.handleSubmit(onSubmit)}
              loading={form.formState.isSubmitting}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 18 }}>
            <Button
              label="Forgot password?"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={() => router.push("/(auth)/forgot-password" as any)}
            />
            <Button
              label="Verify email"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={() => router.push("/(auth)/verify-email" as any)}
            />
          </View>

          {!useApi() ? (
            <>
              <Separator label="Test sign-in" />
              <View style={{ gap: 10, marginTop: 14 }}>
                <Button
                  label="Continue as Parent"
                  description="Jane Doe"
                  variant="outline"
                  onPress={() => handleRole("parent")}
                />
                <Button
                  label="Continue as Clinician"
                  description="Dr. John Smith"
                  variant="outline"
                  onPress={() => handleRole("clinician")}
                />
                <Button
                  label="Continue as Admin"
                  description="Admin User"
                  variant="outline"
                  onPress={() => handleRole("admin")}
                />
              </View>
            </>
          ) : null}
        </Card>
      </Screen>
    </View>
  );
}
