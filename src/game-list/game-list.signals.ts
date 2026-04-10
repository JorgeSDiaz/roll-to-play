import { signal, computed, effect } from '@preact/signals';
import type { Game } from '../shared/types/game.types';
import { StorageService } from './services/storage.service';

/**
 * Signal con la lista de juegos del usuario.
 * Se inicializa desde localStorage al cargar la app.
 */
export const gameListSignal = signal<Game[]>(StorageService.getGameList());

/** Cantidad de juegos en la lista. */
export const gameCountSignal = computed(() => gameListSignal.value.length);

/** true si hay al menos 2 juegos (mínimo para hacer roll). */
export const canRollSignal = computed(() => gameListSignal.value.length >= 2);

/** Set de IDs de juegos en la lista (para verificar duplicados rápido). */
export const gameIdsSetSignal = computed(() => new Set(gameListSignal.value.map((g) => g.id)));

// Persistir cambios en localStorage
if (typeof localStorage !== 'undefined') {
  effect(() => {
    StorageService.saveGameList(gameListSignal.value);
  });
}

// ── Acciones ────────────────────────────────────────────────

/** Agrega un juego a la lista. No agrega duplicados. */
export function addGame(game: Game): void {
  if (gameIdsSetSignal.value.has(game.id)) return;
  gameListSignal.value = [...gameListSignal.value, game];
}

/** Elimina un juego de la lista por ID. */
export function removeGame(gameId: number): void {
  gameListSignal.value = gameListSignal.value.filter((g) => g.id !== gameId);
}
