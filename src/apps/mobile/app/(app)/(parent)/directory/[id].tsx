import { useLocalSearchParams } from "expo-router";
import { Globe, Mail, MapPin, Phone } from "lucide-react-native";
import React from "react";
import { Linking, Pressable, View } from "react-native";
import {
  Card,
  EmptyState,
  Header,
  Screen,
  SectionHeader,
  Text,
} from "../../../../components/ui";
import { usePracticeDetail } from "../../../../lib/api/hooks/adapter-hooks";
import { useTheme } from "../../../../theme/useTheme";

function ContactRow({
  icon: Icon,
  label,
  value,
  onPress,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon size={18} color={tokens.mutedForeground} />
      <View style={{ flex: 1 }}>
        <Text variant="muted">{label}</Text>
        <Text variant="body" numberOfLines={2}>
          {value}
        </Text>
      </View>
    </Pressable>
  );
}

export default function PracticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = usePracticeDetail(id);

  if (query.isLoading) {
    return (
      <Screen>
        <EmptyState title="Loading practice…" />
      </Screen>
    );
  }
  if (!query.data) {
    return (
      <Screen>
        <Header title="Practice" />
        <EmptyState title="Practice not found" />
      </Screen>
    );
  }

  const p = query.data;
  const addressLine = [p.address, p.city, p.state, p.zip].filter(Boolean).join(", ");

  return (
    <Screen padding={0} edges={["top"]} scroll>
      <Header title={p.name} subtitle={p.city ?? undefined} />
      <View style={{ padding: 20, gap: 16 }}>
        <Card>
          <Text variant="bodyStrong" style={{ marginBottom: 6 }}>
            Contact
          </Text>
          <ContactRow icon={Phone} label="Phone" value={p.phone} onPress={() => Linking.openURL(`tel:${p.phone}`)} />
          {p.email ? (
            <ContactRow icon={Mail} label="Email" value={p.email} onPress={() => Linking.openURL(`mailto:${p.email}`)} />
          ) : null}
          {p.website ? (
            <ContactRow icon={Globe} label="Website" value={p.website} onPress={() => Linking.openURL(p.website!)} />
          ) : null}
        </Card>

        <Card>
          <Text variant="bodyStrong" style={{ marginBottom: 6 }}>
            Location
          </Text>
          <ContactRow
            icon={MapPin}
            label="Address"
            value={addressLine}
            onPress={
              p.latitude && p.longitude
                ? () => Linking.openURL(`https://maps.apple.com/?q=${p.latitude},${p.longitude}`)
                : undefined
            }
          />
        </Card>

        <SectionHeader title="Clinicians" />
        <Text variant="muted">Clinician roster coming soon.</Text>
      </View>
    </Screen>
  );
}
