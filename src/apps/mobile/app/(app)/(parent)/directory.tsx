import { Compass } from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { ChipRow, EmptyState, ListItem, Screen, SearchBar, Text } from "../../../components/ui";
import { usePublicPracticesList } from "../../../lib/api/hooks/adapter-hooks";

const CITY_ALL = "__all__" as const;

export default function ParentDirectoryScreen() {
  const router = useRouter();
  const practicesQuery = usePublicPracticesList();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>(CITY_ALL);

  const list = practicesQuery.data ?? [];

  const cities = useMemo(() => {
    const seen = new Set<string>();
    for (const p of list) {
      if (p.city) seen.add(p.city);
    }
    return [
      { value: CITY_ALL, label: "All cities" },
      ...Array.from(seen).map((c) => ({ value: c, label: c })),
    ];
  }, [list]);

  const filtered = list.filter((p) => {
    if (city !== CITY_ALL && p.city !== city) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.city ?? "").toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <Screen padding={0} edges={["top"]}>
      <View style={{ padding: 20, paddingTop: 8, gap: 12 }}>
        <Text variant="title">Directory</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search practices, cities" />
        <ChipRow options={cities} value={city} onChange={setCity} />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          Icon={Compass}
          title="No practices found"
          body={query || city !== CITY_ALL ? "Try clearing your filters." : "Practices will appear here once added."}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 10 }}>
          {filtered.map((item) => (
            <ListItem
              key={item.id}
              title={item.name}
              subtitle={`${item.city}${item.state ? ` · ${item.state}` : ""}`}
              onPress={() => router.push({ pathname: "/(app)/(parent)/directory/[id]", params: { id: item.id } })}
            />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
