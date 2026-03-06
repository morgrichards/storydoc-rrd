import { StatusBar, StyleSheet, Text, View } from "react-native";
import ConvexClientProvider from "./ConvexClientProvider";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function StoryDoctorNativePlaceholder() {
  const categories = useQuery(api.categories.listActiveCategories, {});

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Story Doctor (Native Placeholder)</Text>
      <Text style={styles.subtitle}>
        Convex connection is active. Categories loaded:
      </Text>
      {(categories ?? []).map((category) => (
        <Text key={category._id} style={styles.item}>
          • {category.title}
        </Text>
      ))}
      {!categories && <Text style={styles.loading}>Loading categories...</Text>}
    </View>
  );
}

export default function App() {
  const barStyle = "dark-content";

  return (
    <ConvexClientProvider>
      <View style={styles.container}>
        <StatusBar barStyle={barStyle} />
        <StoryDoctorNativePlaceholder />
      </View>
    </ConvexClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#13253a",
  },
  subtitle: {
    fontSize: 14,
    color: "#334e68",
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
    color: "#243b53",
  },
  loading: {
    fontSize: 14,
    color: "#627d98",
  },
});
