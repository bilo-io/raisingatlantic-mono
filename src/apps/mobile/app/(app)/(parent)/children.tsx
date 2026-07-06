import { Baby, Trash2 } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { ChildForm } from "../../../components/children/ChildForm";
import {
  hasValidConsent,
  ParentalConsentModal,
  ParentalConsentModalRef,
} from "../../../components/children/ParentalConsentModal";
import {
  Avatar,
  BottomSheet,
  BottomSheetRef,
  EmptyState,
  FAB,
  ListItem,
  Screen,
  Text,
} from "../../../components/ui";
import { useChildArchive, useChildrenList } from "../../../lib/api/hooks/adapter-hooks";
import { useActiveChild } from "../../../lib/active-child";
import type { Child } from "@raising-atlantic/types";
import { useTheme } from "../../../theme/useTheme";

function ageFromDob(dob: string): string {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  if (months < 1) return "Newborn";
  if (months < 24) return `${months} mo`;
  return `${Math.floor(months / 12)} yr`;
}

export default function ParentChildrenScreen() {
  const { user } = useAuth();
  const { tokens } = useTheme();
  const { activeChildId, setActiveChildId } = useActiveChild();
  const childrenQuery = useChildrenList(user?.id ? { parentId: user.id } : undefined);
  const archive = useChildArchive();

  const formSheetRef = useRef<BottomSheetRef>(null);
  const consentRef = useRef<ParentalConsentModalRef>(null);
  const [editing, setEditing] = useState<Child | null>(null);

  async function startAdd() {
    setEditing(null);
    const ok = await hasValidConsent(user?.id);
    if (!ok) {
      consentRef.current?.open();
      return;
    }
    formSheetRef.current?.present();
  }

  function startEdit(child: Child) {
    setEditing(child);
    formSheetRef.current?.present();
  }

  function confirmArchive(child: Child) {
    Alert.alert(
      "Archive child",
      `${child.firstName} will be soft-archived and removed from your active list. You can request a permanent delete from Profile.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: () => archive.mutate(child.id),
        },
      ],
    );
  }

  const list = (childrenQuery.data ?? []).filter((c) => c.status !== "Archived");
  const empty = !childrenQuery.isLoading && list.length === 0;

  return (
    <Screen padding={0} edges={["top"]}>
      <View style={{ padding: 20, paddingTop: 8 }}>
        <Text variant="title">Children</Text>
        <Text variant="muted">Manage your children&apos;s profiles.</Text>
      </View>

      {empty ? (
        <EmptyState
          Icon={Baby}
          title="No children yet"
          body="Add your first child to start tracking growth, milestones and vaccinations."
          actionLabel="Add your first child"
          onAction={startAdd}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 10 }}>
          {list.map((item) => {
            const isActive = item.id === activeChildId;
            return (
              <ListItem
                key={item.id}
                title={`${item.firstName} ${item.lastName}`}
                subtitle={`${ageFromDob(item.dateOfBirth)} · ${item.gender === "female" ? "Female" : "Male"}${isActive ? " · Active" : ""}`}
                leading={<Avatar name={item.name} imageUrl={item.imageUrl} size="md" />}
                onPress={() => setActiveChildId(item.id)}
                trailing={
                  <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                    <Pressable onPress={() => startEdit(item)} hitSlop={8} accessibilityLabel="Edit child">
                      <Text variant="muted" tone="primary">
                        Edit
                      </Text>
                    </Pressable>
                    <Pressable onPress={() => confirmArchive(item)} hitSlop={8} accessibilityLabel="Archive child">
                      <Trash2 size={18} color={tokens.destructive} />
                    </Pressable>
                  </View>
                }
                showChevron={false}
              />
            );
          })}
        </ScrollView>
      )}

      {!empty ? <FAB onPress={startAdd} accessibilityLabel="Add child" testID="parent-add-child-fab" /> : null}

      <BottomSheet ref={formSheetRef} snapPoints={["75%", "95%"]}>
        <ChildForm
          existing={editing ?? undefined}
          onSaved={(child) => {
            setActiveChildId(child.id);
            formSheetRef.current?.dismiss();
          }}
          onCancel={() => formSheetRef.current?.dismiss()}
        />
      </BottomSheet>

      <ParentalConsentModal
        ref={consentRef}
        onConsent={() => formSheetRef.current?.present()}
      />
    </Screen>
  );
}
