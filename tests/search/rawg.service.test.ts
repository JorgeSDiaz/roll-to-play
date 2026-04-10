import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Platform } from '../../src/shared/types/game.types';
import type { RAWGSearchResponse } from '../../src/shared/types/rawg.types';

// El mock de api-key se declara antes de cualquier import del módulo bajo test.
// vi.mock se eleva (hoisted) automáticamente por Vitest.
vi.mock('../../src/api-key/api-key.signals', () => ({
  apiKeySignal: { value: 'test-api-key-123' },
  hasApiKeySignal: { value: true },
}));

// Importar después del mock
import { searchGames } from '../../src/search/services/rawg.service';

const MOCK_RAWG_RESPONSE: RAWGSearchResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      slug: 'zelda-botw',
      name: 'The Legend of Zelda: Breath of the Wild',
      released: '2017-03-03',
      background_image: 'https://media.rawg.io/zelda.jpg',
      rating: 4.8,
      platforms: [
        { platform: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' } },
        { platform: { id: 10, name: 'Wii U', slug: 'wii-u' } },
      ],
    },
    {
      id: 2,
      slug: 'zelda-totk',
      name: 'The Legend of Zelda: Tears of the Kingdom',
      released: '2023-05-12',
      background_image: null,
      rating: 4.9,
      platforms: [{ platform: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' } }],
    },
  ],
};

describe('RAWGService.searchGames', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns empty array for blank query', async () => {
    const result = await searchGames('   ');
    expect(result.games).toEqual([]);
    expect(result.fromCache).toBe(false);
  });

  it('fetches and maps games from RAWG API', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_RAWG_RESPONSE,
    } as Response);

    const { games, fromCache } = await searchGames('zelda');

    expect(fromCache).toBe(false);
    expect(games).toHaveLength(2);
    expect(games[0]!.id).toBe(1);
    expect(games[0]!.name).toBe('The Legend of Zelda: Breath of the Wild');
    expect(games[0]!.coverUrl).toBe('https://media.rawg.io/zelda.jpg');
    expect(games[0]!.platforms).toContain(Platform.NintendoSwitch);
    expect(games[0]!.platforms).toContain(Platform.NintendoWiiU);
    expect(games[1]!.coverUrl).toBeNull();
  });

  it('returns cached result on second call (no extra fetch)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_RAWG_RESPONSE,
    } as Response);

    // Primera llamada — va a la red
    await searchGames('zelda-cache-test');
    // Segunda llamada — debe venir del caché
    const { games, fromCache } = await searchGames('zelda-cache-test');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fromCache).toBe(true);
    expect(games).toHaveLength(2);
  });

  it('applies platform filter in URL params', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...MOCK_RAWG_RESPONSE, results: [] }),
    } as Response);

    await searchGames('mario-platform-filter', Platform.NintendoSwitch);

    const calledUrl = vi.mocked(fetch).mock.calls[0]![0] as string;
    expect(calledUrl).toContain(`platforms=${Platform.NintendoSwitch}`);
  });

  it('throws on 401 with friendly message', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Response);

    await expect(searchGames('zelda-401')).rejects.toThrow('API key inválida');
  });

  it('throws on 429 with friendly message', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    await expect(searchGames('zelda-429')).rejects.toThrow('Demasiadas búsquedas');
  });

  it('throws on 5xx with generic message', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(searchGames('zelda-500')).rejects.toThrow('Error de RAWG API: 500');
  });
});
