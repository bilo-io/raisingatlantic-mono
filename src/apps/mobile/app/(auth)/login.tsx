import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { Role } from "../../auth/types";
import { Branding } from "../../components/Branding";
import { GradientBlob, GradientBlobBottom } from "../../components/GradientBlob";
import { Button, Card, Input, Screen, Separator, Text } from "../../components/ui";

export default function LoginScreen() {
  const { signInAs } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRole = async (role: Role) => {
    await signInAs(role);
    router.replace(`/(app)/(${role})/dashboard` as any);
  };

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

          <View style={{ gap: 12, marginBottom: 18 }}>
            <Input
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button label="Sign in" onPress={() => handleRole("parent")} />
          </View>

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
        </Card>
      </Screen>
    </View>
  );
}
