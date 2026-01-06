export function getOmdbKey(): string {
    const key = process.env.EXPO_PUBLIC_OMDB_KEY;
    if (!key) {
        throw new Error('Missing OMDB key');
    }
    return key;
}