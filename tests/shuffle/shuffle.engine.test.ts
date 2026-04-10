import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pickRandom } from '../../src/shuffle/engine/shuffle.engine';
import type { Game } from '../../src/shared/types/game.types';
import { Platform } from '../../src/shared/types/game.types';

const GAMES: Game[] = [
  { id: 1, name: 'Game A', coverUrl: null, platforms: [Platform.PC], slug: 'game-a' },
  { id: 2, name: 'Game B', coverUrl: null, platforms: [Platform.PC], slug: 'game-b' },
  { id: 3, name: 'Game C', coverUrl: null, platforms: [Platform.PC], slug: 'game-c' },
];

describe('pickRandom', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an element from the array', () => {
    const result = pickRandom(GAMES);
    expect(GAMES).toContain(result);
  });

  it('returns the only element when array has one item', () => {
    expect(pickRandom([GAMES[0]!])).toBe(GAMES[0]);
  });

  it('respects Math.random boundary at 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(pickRandom(GAMES)).toBe(GAMES[0]);
  });

  it('respects Math.random boundary near 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(pickRandom(GAMES)).toBe(GAMES[2]);
  });

  it('picks different elements over multiple calls (statistical)', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) {
      seen.add(pickRandom(GAMES).id);
    }
    // Con 100 llamadas debería haber visto al menos 2 elementos distintos
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('startShuffle / resetShuffle', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('transitions phase to shuffling when called with 2+ games', async () => {
    // Importar fresco para tener estado limpio
    const { gameListSignal } = await import('../../src/game-list/game-list.signals');
    const { shufflePhaseSignal, selectedGameSignal } =
      await import('../../src/shuffle/shuffle.signals');
    const { startShuffle, resetShuffle } = await import('../../src/shuffle/engine/shuffle.engine');

    gameListSignal.value = [GAMES[0]!, GAMES[1]!];
    resetShuffle();

    expect(shufflePhaseSignal.value).toBe('idle');
    expect(selectedGameSignal.value).toBeNull();

    startShuffle();
    expect(shufflePhaseSignal.value).toBe('shuffling');
  });

  it('does not start shuffle with less than 2 games', async () => {
    const { gameListSignal } = await import('../../src/game-list/game-list.signals');
    const { shufflePhaseSignal } = await import('../../src/shuffle/shuffle.signals');
    const { startShuffle, resetShuffle } = await import('../../src/shuffle/engine/shuffle.engine');

    gameListSignal.value = [GAMES[0]!];
    resetShuffle();
    startShuffle();

    expect(shufflePhaseSignal.value).toBe('idle');
  });

  it('resetShuffle sets phase back to idle', async () => {
    const { gameListSignal } = await import('../../src/game-list/game-list.signals');
    const { shufflePhaseSignal, selectedGameSignal } =
      await import('../../src/shuffle/shuffle.signals');
    const { startShuffle, resetShuffle } = await import('../../src/shuffle/engine/shuffle.engine');

    gameListSignal.value = [GAMES[0]!, GAMES[1]!];
    startShuffle();
    resetShuffle();

    expect(shufflePhaseSignal.value).toBe('idle');
    expect(selectedGameSignal.value).toBeNull();
  });
});
