import { getShowDetails, getTmdbImageUrl } from "@/src/api/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function ShowDetailScreen() {
    const { tvID } = useLocalSearchParams<{ tvID: string }>();

    if (!tvID) {
        throw new Error('Missing tvID');
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['omdb-show', tvID],
        queryFn: async () => {
            const res = await getShowDetails(Number(tvID));
            return res;
        },
        enabled: !!tvID,
        staleTime: 1000 * 60 * 5,
    })

    if (!data) return null;

    const title = data.name;
    const year = data.first_air_date?.slice(0,4);
    const poster = data.poster_path;
    const genre = data.genres?.map(g => g.name).join(', ');
    const totalSeasons = data.number_of_seasons;
    const plot = data.overview;
    const posterUrl = getTmdbImageUrl(poster);

  return (
    <View style={{ flex: 1, padding: 24 }}>
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

        {posterUrl && (
            <Image source={{ uri: posterUrl }} style={{ width: 200, height: 300 }} />
        )}
        <Text style={{ fontSize: 22, fontWeight: "600" }}>{title}</Text>
        <Text style={{ marginTop: 12 }}>Year: {year}</Text>
        <Text style={{ marginTop: 12 }}>{plot}</Text>
        <Text style={{ marginTop: 12 }}>Genre: {genre}</Text>
        <Text style={{ marginTop: 12 }}>Total Seasons: {totalSeasons}</Text>

    </View>
  );
}
