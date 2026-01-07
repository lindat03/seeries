export function getTmdbReadToken(): string {
    const token = process.env.EXPO_PUBLIC_TMDB_READ_TOKEN;
    if (!token) {
        throw new Error('Missing TMDB read token');
    }
    return token;
}