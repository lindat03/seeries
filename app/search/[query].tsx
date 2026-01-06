import { OmdbSearchItem, searchShows } from '@/src/api/omdb';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

export default function SearchResults() {
    const params = useLocalSearchParams<{query: string}>();
    const query = useMemo(() => decodeURIComponent(params.query ?? ""), [params.query]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['omdb-search', query],
        queryFn: async () => {
            const res = await searchShows(query);
            return res.items;
        },
        enabled: !!query,
        staleTime: 1000 * 60 * 5,
    })

    const items = data ?? [];

    return (
        <View>
            <Text>Search Results for {query}</Text>

            {isLoading && (
                <View style={{ paddingTop: 20 }}>
                <ActivityIndicator />
                </View>
            )}

            {!!error && (
                <Text style={{ color: "crimson" }}>
                {(error as Error).message || "Something went wrong."}
                </Text>
            )}

            {!isLoading && !error && items.length === 0 && (
                <Text style={{ color: "#666" }}>No results.</Text>
            )}

            <FlatList
                data={items}
                keyExtractor={(item) => item.imdbID}
                renderItem={({ item }) => <ResultRow item={item} />}
                ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: "#eee" }} />
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
            />

        </View>
    );
}

function ResultRow({item}: {item: OmdbSearchItem}) {
    return (
        <Pressable
            onPress={() => router.push(`/show/${item.imdbID}`)}
            style={{ paddingVertical: 12 }}
        >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.Title}</Text>
            <Text style={{ color: "#666", marginTop: 2 }}>{item.Year}</Text>
        </Pressable>
    );
}