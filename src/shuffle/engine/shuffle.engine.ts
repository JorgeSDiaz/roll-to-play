import { gameListSignal } from '../../game-list/game-list.signals';
import {
  shufflePhaseSignal,
  selectedGameSignal,
  currentDisplayedGameSignal,
} from '../shuffle.signals';
import type { Game } from '../../shared/types/game.types';

/** Duración total de la animación en ms. */
const TOTAL_DURATION = 3000;

/** Intervalo mínimo entre cambios de portada (ms) — fase rápida inicial. */
const MIN_INTERVAL = 60;

/** Intervalo máximo al final de la desaceleración (ms). */
const MAX_INTERVAL = 500;

let activeTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Selecciona un juego aleatorio de la lista.
 * Usa Math.random() — suficiente para un shuffle casual.
 */
export function pickRandom(games: Game[]): Game {
  const index = Math.floor(Math.random() * games.length);
  return games[index]!;
}

/**
 * Inicia la animación shuffle.
 *
 * 1. Selecciona el juego ganador de antemano
 * 2. Ejecuta la animación de "barajeo" con desaceleración progresiva (easeOutCubic)
 * 3. Al final, muestra el juego ganador
 *
 * Precondición: gameListSignal.value.length >= 2
 */
export function startShuffle(): void {
  const games = gameListSignal.value;
  if (games.length < 2) return;

  if (activeTimerId !== null) {
    clearTimeout(activeTimerId);
    activeTimerId = null;
  }

  const winner = pickRandom(games);

  shufflePhaseSignal.value = 'shuffling';
  selectedGameSignal.value = null;
  currentDisplayedGameSignal.value = games[0]!;

  const startTime = performance.now();

  function animate(now: number): void {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / TOTAL_DURATION, 1);

    if (progress < 1) {
      // Desaceleración easeOutCubic: el intervalo aumenta progresivamente
      const eased = 1 - Math.pow(1 - progress, 3);
      const interval = MIN_INTERVAL + (MAX_INTERVAL - MIN_INTERVAL) * eased;

      // Mostrar un juego aleatorio diferente al actual
      const currentId = currentDisplayedGameSignal.value?.id;
      const candidates = games.length > 1 ? games.filter((g) => g.id !== currentId) : games;
      currentDisplayedGameSignal.value = pickRandom(candidates);

      activeTimerId = setTimeout(() => requestAnimationFrame(animate), interval);
    } else {
      // Animación terminada — mostrar ganador
      activeTimerId = null;
      currentDisplayedGameSignal.value = winner;
      selectedGameSignal.value = winner;
      shufflePhaseSignal.value = 'result';
    }
  }

  requestAnimationFrame(animate);
}

/** Resetea el shuffle al estado idle. */
export function resetShuffle(): void {
  if (activeTimerId !== null) {
    clearTimeout(activeTimerId);
    activeTimerId = null;
  }
  shufflePhaseSignal.value = 'idle';
  selectedGameSignal.value = null;
  currentDisplayedGameSignal.value = null;
}
