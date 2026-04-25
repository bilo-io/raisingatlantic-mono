import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../auth/useAuth";
import { Role } from "../auth/types";
import { useTheme } from "../theme/useTheme";
import { Card, Screen, Text } from "./ui";

const ROLE_LABEL: Record<Role, string> = {
  parent: "Parent",
  clinician: "Clinician",
  admin: "Admin",
};

const ROLE_BLURB: Record<Role, string> = {
  parent: "Track your children's growth, milestones and care, all in one place.",
  clinician: "Stay on top of your patients, verifications and records.",
  admin: "Oversee users, verifications and platform health.",
};

export function DashboardHome() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Screen scroll>
      <Text variant="label">{ROLE_LABEL[user.role]} dashboard</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        Hi, {user.name.split(" ")[0]} 👋
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
        {ROLE_BLURB[user.role]}
      </Text>

      <View style={{ marginTop: 28, gap: 14 }}>
        <PlaceholderCard
          title="Quick stats"
          subtitle="Real numbers will land here soon."
        />
        <PlaceholderCard
          title="Recent activity"
          subtitle="The feed of your most recent items will live here."
        />
        <GradientCard
          title="Quick actions"
          subtitle="One-tap shortcuts coming next."
        />
      </View>
    </Screen>
  );
}

function PlaceholderCard({ title, subtitle }: { title: string; subtitle: string }) {
  const { tokens } = useTheme();
  return (
    <Card>
      <Text variant="title">{title}</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        {subtitle}
      </Text>
      <View
        style={{
          marginTop: 14,
          height: 64,
          borderRadius: 10,
          backgroundColor: tokens.muted,
        }}
      />
    </Card>
  );
}

function GradientCard({ title, subtitle }: { title: string; subtitle: string }) {
  const { tokens } = useTheme();
  return (
    <LinearGradient
      colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 16, padding: 18 }}
    >
      <Text variant="title" tone="onPrimary">
        {title}
      </Text>
      <Text variant="muted" tone="onPrimary" style={{ opacity: 0.9, marginTop: 4 }}>
        {subtitle}
      </Text>
    </LinearGradient>
  );
}
