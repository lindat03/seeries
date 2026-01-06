import { getShowDetails, isValidPosterUrl } from "@/src/api/omdb";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function ShowDetailScreen() {
    const { imdbID } = useLocalSearchParams<{ imdbID: string }>();

    if (!imdbID) {
        throw new Error('Missing imdbID');
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['omdb-show', imdbID],
        queryFn: async () => {
            const res = await getShowDetails(imdbID);
            return res;
        },
        enabled: !!imdbID,
        staleTime: 1000 * 60 * 5,
    })

    if (!data) return null;

    if (data.Response === 'False'){
        return <Text style={{ color: "crimson" }}>{data.Error}</Text>;
    }

    const title = data.Title;
    const year = data.Year;
    const poster = data.Poster;
    const plot = data.Plot;

    const isValidPoster = isValidPosterUrl(poster);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
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

        {isValidPoster && (
            <Image source={{ uri: poster }} style={{ width: 200, height: 300 }} />
        )}
        <Text style={{ fontSize: 22, fontWeight: "600" }}>{title}</Text>
        <Text style={{ marginTop: 12 }}>Year: {year}</Text>
        <Text style={{ marginTop: 12 }}>Plot: {plot}</Text>
    </View>
  );
}
