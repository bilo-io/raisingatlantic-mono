import { bucketVaccine, epiSchedule } from "@raising-atlantic/clinical";
import { useRouter } from "expo-router";
import { Baby, ClipboardList, MessageSquare, Plus, Syringe } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { Avatar, Button, Card, EmptyState, Screen, Text } from "../ui";
import { useChildRecordsAll } from "../../lib/api/hooks/adapter-hooks";
import { useActiveChild } from "../../lib/active-child";
import { useConversationsList } from "../../lib/api/hooks/messages";
import { useTheme } from "../../theme/useTheme";

function ageFromDob(dob: string): string {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const months = (Date.now() - d.getTime()) / (30.44 * 86_400_000);
  if (months < 1) return "Newborn";
  if (months < 24) return `${Math.floor(months)} mo`;
  return `${Math.floor(months / 12)} yr`;
}

function QuickAction({
  icon: Icon,
  label,
  onPress,
}: {
  icon: typeof Plus;
  label: string;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: "center",
        gap: 6,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: tokens.border,
        borderRadius: 14,
        backgroundColor: tokens.card,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon size={22} color={tokens.primary} />
      <Text variant="bodyStrong" style={{ fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function DashboardHomeParent() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeChild, childrenList } = useActiveChild();
  const recordsQuery = useChildRecordsAll(activeChild?.id ?? null);
  const conversationsQuery = useConversationsList();

  if (!user) return null;

  const unread = (conversationsQuery.data ?? []).reduce((sum, c) => sum + c.unreadCount, 0);

  if (childrenList.length === 0) {
    return (
      <Screen scroll>
        <Text variant="label">Parent dashboard</Text>
        <Text variant="heading" style={{ marginTop: 4 }}>
          Hi, {user.name.split(" ")[0]} 👋
        </Text>
        <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
          Track your children&apos;s growth, milestones and care, all in one place.
        </Text>
        <View style={{ marginTop: 28 }}>
          <EmptyState
            Icon={Baby}
            title="Add your first child"
            body="Children are the centre of Raising Atlantic. Add one to start tracking growth, milestones and vaccinations."
            actionLabel="Add a child"
            onAction={() => router.push("/(app)/(parent)/children")}
          />
        </View>
      </Screen>
    );
  }

  const completedVaxIds = new Set((recordsQuery.data?.vaccinations ?? []).map((v) => v.vaccineId));
  const nextDueVaccine = activeChild
    ? epiSchedule.find(
        (v) => bucketVaccine(v, activeChild.dateOfBirth, completedVaxIds) === "due",
      )
    : undefined;
  const overdueVaccine = activeChild
    ? epiSchedule.find(
        (v) => bucketVaccine(v, activeChild.dateOfBirth, completedVaxIds) === "overdue",
      )
    : undefined;

  const latestGrowth = (recordsQuery.data?.growth ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <Screen scroll>
      <Text variant="label">Parent dashboard</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        Hi, {user.name.split(" ")[0]} 👋
      </Text>

      <View style={{ marginTop: 20, gap: 14 }}>
        {activeChild ? (
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Avatar name={activeChild.name} imageUrl={activeChild.imageUrl} size="lg" />
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">
                  {activeChild.firstName} {activeChild.lastName}
                </Text>
                <Text variant="muted">
                  {ageFromDob(activeChild.dateOfBirth)} ·{" "}
                  {activeChild.gender === "female" ? "Female" : "Male"}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}

        <Card>
          <Text variant="bodyStrong">Vaccinations</Text>
          {overdueVaccine ? (
            <Text variant="body" tone="destructive" style={{ marginTop: 6 }}>
              Overdue: {overdueVaccine.name} ({overdueVaccine.doseInfo})
            </Text>
          ) : nextDueVaccine ? (
            <Text variant="body" style={{ marginTop: 6 }}>
              Next due: {nextDueVaccine.name} ({nextDueVaccine.doseInfo})
            </Text>
          ) : (
            <Text variant="muted" style={{ marginTop: 6 }}>
              All up to date.
            </Text>
          )}
        </Card>

        <Card>
          <Text variant="bodyStrong">Latest growth</Text>
          {latestGrowth ? (
            <Text variant="body" style={{ marginTop: 6 }}>
              {latestGrowth.weight ? `${latestGrowth.weight} kg` : ""}
              {latestGrowth.weight && latestGrowth.height ? " · " : ""}
              {latestGrowth.height ? `${latestGrowth.height} cm` : ""}
              {" · "}
              {new Date(latestGrowth.date).toLocaleDateString()}
            </Text>
          ) : (
            <Text variant="muted" style={{ marginTop: 6 }}>
              No entries yet.
            </Text>
          )}
        </Card>

        <Card>
          <Text variant="bodyStrong">Messages</Text>
          <Text variant="body" style={{ marginTop: 6 }}>
            {unread > 0 ? `${unread} unread message${unread > 1 ? "s" : ""}` : "All caught up."}
          </Text>
        </Card>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <QuickAction icon={ClipboardList} label="Log growth" onPress={() => router.push("/(app)/(parent)/records")} />
          <QuickAction icon={Syringe} label="Log vaccine" onPress={() => router.push("/(app)/(parent)/records")} />
          <QuickAction icon={MessageSquare} label="Messages" onPress={() => router.push("/(app)/(parent)/messages")} />
        </View>

        <Button label="Manage children" variant="outline" onPress={() => router.push("/(app)/(parent)/children")} />
      </View>
    </Screen>
  );
}
