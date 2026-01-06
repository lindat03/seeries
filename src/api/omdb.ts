import { getOmdbKey } from "@/src/config/env";

const OMDB_BASE_URL = "https://www.omdbapi.com/";


export function isValidPosterUrl(poster?: string | null): boolean {
    if (!poster || poster === 'N/A') {
        return false;
    }
    return true;
}

type OmdbParams = Record<string, string | number | boolean | undefined | null>;

export type OmdbSearchItem = {
    Title: string;
    Year: string;
    imdbID: string;
    Type: "series" | string;
    Poster: string;
}

export type OmdbSearchResponse = 
    | { Response: 'True'; Search: OmdbSearchItem[]; totalResults: string; }
    | { Response: 'False'; Error: string; };

export type OmdbRating = {
    Source: string;
    Value: string;
}

export type ShowDetails = 
    | ({
        Title: string;
        Year?: string;
        Rated?: string;
        Released?: string;
        Genre?: string;
        Director?: string;
        Writer?: string;
        Actors?: string;
        Plot?: string;
        Language?: string;
        Country?: string;
        Awards?: string;
        Poster?: string;
        Ratings?: OmdbRating[];
        imdbRating?: string;
        imdbID: string;
        Type: "series";
        totalSeasons?: string;
        Response: "True";
    } & Record<string, unknown>)
    | {
        Response: "False";
        Error: string;
    };

function buildUrl(params: OmdbParams): string {
    const apiKey = getOmdbKey();
    const url = new URL(OMDB_BASE_URL);

    url.searchParams.set('apikey', apiKey);
    url.searchParams.set('type', 'series');
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
            url.searchParams.set(k, String(v));
        }
    }
    return url.toString();
}

async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function searchShows(query?: string, page: number = 1, opts?: { signal?: AbortSignal }): Promise<{items: OmdbSearchItem[]; totalResults: number}> {
    if (!query || query.trim().length < 2) {
        return { items: [], totalResults: 0 };
    }

    const url = buildUrl({
        s: query,
        type: 'series',
        page,
    });

    const data = await fetchData<OmdbSearchResponse>(url, opts?.signal);
    if (data.Response === 'False') {
        if (data.Error.toLowerCase().includes("not found")) {
            return { items: [], totalResults: 0 };
        }
        throw new Error(data.Error);
    }
        
    return {
        items: data.Search,
        totalResults: Number(data.totalResults)
    };

}

export async function getShowDetails(imdbID: string, opts?: { plot?: 'short' | 'full'; signal?: AbortSignal}): Promise<ShowDetails> {
    if (!imdbID) {
        throw new Error('Missing imdbID');
    }
    
    const url = buildUrl({
        i: imdbID,
        plot: opts?.plot ?? "full",
    });

    const data = await fetchData<ShowDetails>(url, opts?.signal);
    if (data.Response === 'False') {
        throw new Error(data.Error);
    }

    return data;
}
