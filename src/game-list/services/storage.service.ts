import type { Game } from '../../shared/types/game.types';

const STORAGE_KEY = 'rtp:game-list';

/**
 * Servicio de persistencia para la lista de juegos.
 * Wrapper tipado sobre localStorage.
 */
export const StorageService = {
  getGameList(): Game[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Game[];
    } catch {
      return [];
    }
  },

  saveGameList(games: Game[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch {
      // localStorage lleno — fail silently
    }
  },
};
