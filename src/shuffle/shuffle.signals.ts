import { signal } from '@preact/signals';
import type { Game } from '../shared/types/game.types';
import type { ShufflePhase } from './shuffle.types';

/** Fase actual de la animación. */
export const shufflePhaseSignal = signal<ShufflePhase>('idle');

/** Juego seleccionado tras el roll (null si no se ha hecho roll). */
export const selectedGameSignal = signal<Game | null>(null);

/**
 * Juego actualmente visible durante la animación shuffle.
 * Cambia rápidamente durante la fase 'shuffling'.
 */
export const currentDisplayedGameSignal = signal<Game | null>(null);
