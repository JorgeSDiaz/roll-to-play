/**
 * Respuesta paginada de RAWG API.
 * GET /api/games?search=...&key=...
 */
export interface RAWGSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RAWGGame[];
}

/** Un juego tal como lo devuelve RAWG. */
export interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  platforms: RAWGPlatformEntry[] | null;
}

export interface RAWGPlatformEntry {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

/**
 * Respuesta de la lista de plataformas de RAWG.
 * GET /api/platforms?key=...
 */
export interface RAWGPlatformsResponse {
  count: number;
  results: RAWGPlatformDetail[];
}

export interface RAWGPlatformDetail {
  id: number;
  name: string;
  slug: string;
  games_count: number;
}
