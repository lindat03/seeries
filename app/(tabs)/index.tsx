import SearchBar from "@/src/components/SearchBar";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SearchScreen() {
  const handleSearch = (q: string) => {
    router.push(`/search/${encodeURIComponent(q)}`);
  }
  

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <SearchBar
        onSubmit={handleSearch}
      />
      <Text>Search for your favorite tv shows!</Text>
    </View>
  );
}
