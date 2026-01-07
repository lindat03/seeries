import { getTmdbReadToken } from "@/src/config/env";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbImageUrl(
  path?: string | null,
  size: "w185" | "w342" | "w500" | "original" = "w342"
): string | undefined {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function isValidPosterPath(path?: string | null): boolean {
  return !!path;
}

type TmdbParams = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, params?: TmdbParams): string {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

async function fetchTmdb<T>(url: string, opts?: { signal?: AbortSignal }): Promise<T> {
  const token = getTmdbReadToken();
  const response = await fetch(url, {
    signal: opts?.signal,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`TMDB error ${response.status}: ${text || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/* TYPES */

export type TmdbTvSearchResult = {
  id: number; // TMDB TV ID (use this for details route)
  name: string;
  original_name?: string;
  first_air_date?: string; // "YYYY-MM-DD"
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  origin_country?: string[];
  original_language?: string;
};

export type TmdbSearchResponse<T> = {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
};

export type TmdbTvDetails = {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  last_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
  homepage?: string;
  in_production?: boolean;
  languages?: string[];
  origin_country?: string[];
  original_language?: string;
  original_name?: string;
  popularity?: number;
  status?: string;
  tagline?: string;
  type?: string;
  vote_average?: number;
  vote_count?: number;
};

/* API FUNCTIONS */

export async function searchShows(
  query?: string,
  page: number = 1,
  opts?: { signal?: AbortSignal; language?: string }
): Promise<{ items: TmdbTvSearchResult[]; totalResults: number }> {
  if (!query || query.trim().length < 2) {
    return { items: [], totalResults: 0 };
  }

  const url = buildUrl("/search/tv", {
    query: query.trim(),
    page,
    language: opts?.language ?? "en-US",
    include_adult: false, // safe default
  });

  const data = await fetchTmdb<TmdbSearchResponse<TmdbTvSearchResult>>(url, { signal: opts?.signal });

  return {
    items: data.results ?? [],
    totalResults: data.total_results ?? 0,
  };
}

export async function getShowDetails(
  tvId: number,
  opts?: { signal?: AbortSignal; language?: string; appendToResponse?: string }
): Promise<TmdbTvDetails> {
  if (!tvId || Number.isNaN(tvId)) {
    throw new Error("Missing tvId");
  }

  const url = buildUrl(`/tv/${tvId}`, {
    language: opts?.language ?? "en-US",
    append_to_response: opts?.appendToResponse, // e.g. "credits,videos,external_ids"
  });

  return fetchTmdb<TmdbTvDetails>(url, { signal: opts?.signal });
}