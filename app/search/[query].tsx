import { TmdbTvSearchResult, getTmdbImageUrl, searchShows } from '@/src/api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';

export default function SearchResults() {
    const params = useLocalSearchParams<{query: string}>();
    const query = useMemo(() => decodeURIComponent(params.query ?? ""), [params.query]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['tmdb-search', query],
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ResultRow item={item} />}
                ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: "#eee" }} />
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
            />

        </View>
    );
}

function ResultRow({item}: {item: TmdbTvSearchResult}) {
    const posterUrl = getTmdbImageUrl(item.poster_path)

    return (
        <Pressable
            onPress={() => router.push(`/show/${item.id.toString()}`)}
            style={{ paddingVertical: 12 }}
        >
            { posterUrl && (
                <Image source={{ uri: posterUrl }} style={{ width: 100, height: 150, marginBottom: 8 }} />
            )}
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666", marginTop: 2 }}>{item.first_air_date?.slice(0,4)}</Text>
        </Pressable>
    );
}