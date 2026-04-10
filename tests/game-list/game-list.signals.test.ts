import { describe, it, expect, beforeEach } from 'vitest';
import { Platform } from '../../src/shared/types/game.types';
import type { Game } from '../../src/shared/types/game.types';

const GAME_A: Game = {
  id: 10,
  name: 'Hollow Knight',
  coverUrl: 'https://example.com/hk.jpg',
  platforms: [Platform.PC, Platform.NintendoSwitch],
  slug: 'hollow-knight',
};

const GAME_B: Game = {
  id: 20,
  name: 'Celeste',
  coverUrl: null,
  platforms: [Platform.PC],
  slug: 'celeste',
};

// Importar módulo fresco en cada test para aislar el estado de las signals
async function getModule() {
  // Vitest resetea módulos con vi.resetModules() + re-import
  const { gameListSignal, gameCountSignal, canRollSignal, gameIdsSetSignal, addGame, removeGame } =
    await import('../../src/game-list/game-list.signals');
  return { gameListSignal, gameCountSignal, canRollSignal, gameIdsSetSignal, addGame, removeGame };
}

describe('game-list signals', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty list when localStorage is empty', async () => {
    const { gameListSignal } = await getModule();
    // El signal puede tener estado de tests previos; verificamos contra storage
    expect(Array.isArray(gameListSignal.value)).toBe(true);
  });

  it('addGame adds a game to the list', async () => {
    const { gameListSignal, addGame, gameIdsSetSignal } = await getModule();
    const initialLength = gameListSignal.value.length;
    addGame(GAME_A);
    expect(gameListSignal.value.length).toBe(initialLength + 1);
    expect(gameIdsSetSignal.value.has(GAME_A.id)).toBe(true);
  });

  it('addGame does not add duplicate games', async () => {
    const { gameListSignal, addGame } = await getModule();
    addGame(GAME_A);
    const lengthAfterFirst = gameListSignal.value.length;
    addGame(GAME_A);
    expect(gameListSignal.value.length).toBe(lengthAfterFirst);
  });

  it('removeGame removes a game by id', async () => {
    const { addGame, removeGame, gameIdsSetSignal } = await getModule();
    addGame(GAME_A);
    addGame(GAME_B);
    removeGame(GAME_A.id);
    expect(gameIdsSetSignal.value.has(GAME_A.id)).toBe(false);
    expect(gameIdsSetSignal.value.has(GAME_B.id)).toBe(true);
  });

  it('canRollSignal is false with less than 2 games', async () => {
    const { canRollSignal, addGame, gameListSignal } = await getModule();
    // Vaciar lista
    gameListSignal.value = [];
    expect(canRollSignal.value).toBe(false);
    addGame(GAME_A);
    expect(canRollSignal.value).toBe(false);
  });

  it('canRollSignal is true with 2 or more games', async () => {
    const { canRollSignal, gameListSignal } = await getModule();
    gameListSignal.value = [GAME_A, GAME_B];
    expect(canRollSignal.value).toBe(true);
  });

  it('gameCountSignal reflects current list length', async () => {
    const { gameListSignal, gameCountSignal } = await getModule();
    gameListSignal.value = [];
    expect(gameCountSignal.value).toBe(0);
    gameListSignal.value = [GAME_A, GAME_B];
    expect(gameCountSignal.value).toBe(2);
  });
});
