import AsyncStorage from "@react-native-async-storage/async-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, View } from "react-native";
import { z } from "zod";
import { useAuth } from "../../auth/useAuth";
import {
  Button,
  Card,
  FormField,
  FormSelect,
  Text,
  toast,
} from "../ui";
import { useUserUpdate } from "../../lib/api/hooks/adapter-hooks";
import { useTheme } from "../../theme/useTheme";
import { ProfileScreenBase } from "./ProfileScreenBase";

const NOTIF_KEY = "@ra/notif-prefs";
const POPIA_KEY = "@ra/popia-requests";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  preferredLanguage: z.enum(["en", "af", "zu"]),
});

type ProfileForm = z.infer<typeof profileSchema>;

type NotifPrefs = {
  vaccineReminders: boolean;
  growthCheckIns: boolean;
  messages: boolean;
};

type PopiaRequest = {
  type: "data-export" | "account-deletion";
  timestamp: string;
  userId: string;
  status: "submitted";
};

const DEFAULT_NOTIFS: NotifPrefs = {
  vaccineReminders: true,
  growthCheckIns: true,
  messages: true,
};

export function ProfileScreenParent() {
  const { user } = useAuth();
  const { tokens } = useTheme();
  const updateUser = useUserUpdate();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: user?.name ?? "",
      phone: "",
      preferredLanguage: "en",
    },
  });

  const [notifs, setNotifs] = useState<NotifPrefs>(DEFAULT_NOTIFS);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then((raw) => {
      if (raw) {
        try {
          setNotifs({ ...DEFAULT_NOTIFS, ...(JSON.parse(raw) as Partial<NotifPrefs>) });
        } catch {
          // ignore corrupted store
        }
      }
    });
  }, []);

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      phone: "",
      preferredLanguage: "en",
    });
  }, [user?.id, user?.name, form]);

  function toggleNotif(key: keyof NotifPrefs) {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(next)).catch(() => undefined);
  }

  async function onSubmit(values: ProfileForm) {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        patch: { name: values.name, phone: values.phone },
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

  async function recordPopiaRequest(type: PopiaRequest["type"]) {
    if (!user) return;
    const raw = await AsyncStorage.getItem(POPIA_KEY);
    const list: PopiaRequest[] = raw ? JSON.parse(raw) : [];
    list.push({ type, timestamp: new Date().toISOString(), userId: user.id, status: "submitted" });
    await AsyncStorage.setItem(POPIA_KEY, JSON.stringify(list));
    toast.success(
      type === "data-export" ? "Data export requested" : "Account deletion requested",
      { description: "We'll be in touch within 30 days as required by POPIA." },
    );
  }

  function confirmDataExport() {
    Alert.alert(
      "Request data export",
      "You will receive an export of all personal information held about you and your children. POPIA gives us up to 30 days to respond.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Request export", onPress: () => recordPopiaRequest("data-export") },
      ],
    );
  }

  function confirmAccountDeletion() {
    Alert.alert(
      "Request account deletion",
      "Your account and all records will be soft-archived for 30 days, then permanently deleted. You can revoke this within the 30-day grace period by signing in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request deletion",
          style: "destructive",
          onPress: () => recordPopiaRequest("account-deletion"),
        },
      ],
    );
  }

  function NotifRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
    return (
      <Pressable
        onPress={onToggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
        }}
      >
        <Text variant="body">{label}</Text>
        <View
          style={{
            width: 48,
            height: 28,
            borderRadius: 14,
            backgroundColor: value ? tokens.primary : tokens.muted,
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#fff",
              alignSelf: value ? "flex-end" : "flex-start",
            }}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <ProfileScreenBase>
      <Text variant="label" style={{ marginBottom: 10 }}>
        Personal details
      </Text>
      <Card style={{ gap: 12, marginBottom: 22 }}>
        <FormField name="name" control={form.control} label="Display name" autoCapitalize="words" />
        <FormField name="phone" control={form.control} label="Phone" keyboardType="phone-pad" />
        <FormSelect
          name="preferredLanguage"
          control={form.control}
          label="Preferred language"
          options={[
            { value: "en", label: "English" },
            { value: "af", label: "Afrikaans" },
            { value: "zu", label: "isiZulu" },
          ]}
        />
        <Button
          label="Save changes"
          onPress={form.handleSubmit(onSubmit)}
          loading={updateUser.isPending}
        />
      </Card>

      <Text variant="label" style={{ marginBottom: 10 }}>
        Notifications
      </Text>
      <Card style={{ marginBottom: 22 }}>
        <NotifRow
          label="Vaccine reminders"
          value={notifs.vaccineReminders}
          onToggle={() => toggleNotif("vaccineReminders")}
        />
        <NotifRow
          label="Growth check-ins"
          value={notifs.growthCheckIns}
          onToggle={() => toggleNotif("growthCheckIns")}
        />
        <NotifRow
          label="Messages from care team"
          value={notifs.messages}
          onToggle={() => toggleNotif("messages")}
        />
      </Card>

      <Text variant="label" style={{ marginBottom: 10 }}>
        Privacy &amp; POPIA
      </Text>
      <Card style={{ gap: 8, marginBottom: 22 }}>
        <Pressable
          onPress={confirmDataExport}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 12,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Download size={20} color={tokens.primary} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">Request data export</Text>
            <Text variant="muted">Receive a copy of all information held about your family.</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={confirmAccountDeletion}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 12,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Trash2 size={20} color={tokens.destructive} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" tone="destructive">
              Request account deletion
            </Text>
            <Text variant="muted">Soft-archived for 30 days, then permanently deleted.</Text>
          </View>
        </Pressable>
      </Card>
    </ProfileScreenBase>
  );
}
