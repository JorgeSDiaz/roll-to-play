import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../../src/game-list/services/storage.service';
import type { Game } from '../../src/shared/types/game.types';
import { Platform } from '../../src/shared/types/game.types';

const MOCK_GAME: Game = {
  id: 1,
  name: 'The Legend of Zelda',
  coverUrl: 'https://example.com/zelda.jpg',
  platforms: [Platform.NintendoSwitch],
  slug: 'the-legend-of-zelda',
};

const MOCK_GAME_2: Game = {
  id: 2,
  name: 'Super Mario Odyssey',
  coverUrl: null,
  platforms: [Platform.NintendoSwitch],
  slug: 'super-mario-odyssey',
};

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getGameList', () => {
    it('returns empty array when localStorage is empty', () => {
      expect(StorageService.getGameList()).toEqual([]);
    });

    it('returns stored games', () => {
      localStorage.setItem('rtp:game-list', JSON.stringify([MOCK_GAME]));
      expect(StorageService.getGameList()).toEqual([MOCK_GAME]);
    });

    it('returns empty array on invalid JSON', () => {
      localStorage.setItem('rtp:game-list', 'not-valid-json{{{');
      expect(StorageService.getGameList()).toEqual([]);
    });
  });

  describe('saveGameList', () => {
    it('persists a list of games', () => {
      StorageService.saveGameList([MOCK_GAME, MOCK_GAME_2]);
      const stored = JSON.parse(localStorage.getItem('rtp:game-list')!);
      expect(stored).toHaveLength(2);
      expect(stored[0].id).toBe(1);
      expect(stored[1].id).toBe(2);
    });

    it('persists an empty list', () => {
      StorageService.saveGameList([]);
      const stored = JSON.parse(localStorage.getItem('rtp:game-list')!);
      expect(stored).toEqual([]);
    });

    it('overwrites existing data', () => {
      StorageService.saveGameList([MOCK_GAME]);
      StorageService.saveGameList([MOCK_GAME_2]);
      expect(StorageService.getGameList()).toHaveLength(1);
      expect(StorageService.getGameList()[0]!.id).toBe(2);
    });
  });
});
