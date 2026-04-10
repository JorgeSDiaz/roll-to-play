import { apiKeySignal } from '../../api-key/api-key.signals';
import type { RAWGSearchResponse, RAWGGame } from '../../shared/types/rawg.types';
import { Platform, type Game } from '../../shared/types/game.types';

const BASE_URL = 'https://api.rawg.io/api';
const CACHE_TTL = 3_600_000; // 1 hora en ms
const PAGE_SIZE = 10;

const PLATFORM_IDS = Object.values(Platform).filter((v) => typeof v === 'number') as number[];

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Construye la cache key para una búsqueda.
 * Formato: rtp:cache:{query normalizado}:{platformId o 'all'}
 */
function cacheKey(query: string, platform: Platform | null): string {
  const q = query.trim().toLowerCase();
  const p = platform ?? 'all';
  return `rtp:cache:${q}:${p}`;
}

/**
 * Revisa si hay un resultado cacheado válido.
 * Retorna null si no existe o si expiró.
 */
function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/** Guarda un resultado en caché. */
function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage lleno — falla silenciosamente
  }
}

/** Mapea un juego de RAWG al tipo de dominio Game. */
function mapRAWGGame(rawg: RAWGGame): Game {
  return {
    id: rawg.id,
    name: rawg.name,
    coverUrl: rawg.background_image,
    platforms:
      rawg.platforms
        ?.map((p) => p.platform.id)
        .filter((id): id is Platform => PLATFORM_IDS.includes(id)) ?? [],
    slug: rawg.slug,
  };
}

/**
 * Busca juegos en RAWG API.
 *
 * 1. Verifica caché local
 * 2. Si no hay hit, hace fetch a RAWG
 * 3. Mapea resultados y guarda en caché
 *
 * @throws Error si la API key no está configurada
 * @throws Error si la respuesta HTTP no es 2xx
 */
export async function searchGames(
  query: string,
  platform: Platform | null = null,
): Promise<{ games: Game[]; fromCache: boolean }> {
  const key = apiKeySignal.value;
  if (!key) {
    throw new Error('API key de RAWG no configurada.');
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return { games: [], fromCache: false };
  }

  // 1. Check cache
  const ck = cacheKey(trimmedQuery, platform);
  const cached = getCached<Game[]>(ck);
  if (cached) {
    return { games: cached, fromCache: true };
  }

  // 2. Fetch from RAWG
  const params = new URLSearchParams({
    key,
    search: trimmedQuery,
    page_size: String(PAGE_SIZE),
    search_precise: 'true',
  });

  if (platform !== null) {
    params.set('platforms', String(platform));
  }

  const response = await fetch(`${BASE_URL}/games?${params}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('API key inválida. Verifica tu key en rawg.io/apidocs.');
    }
    if (response.status === 429) {
      throw new Error('Demasiadas búsquedas, espera un momento.');
    }
    throw new Error(`Error de RAWG API: ${response.status} ${response.statusText}`);
  }

  const data: RAWGSearchResponse = await response.json();
  const games = data.results.map(mapRAWGGame);

  // 3. Cache results
  setCache(ck, games);

  return { games, fromCache: false };
}
