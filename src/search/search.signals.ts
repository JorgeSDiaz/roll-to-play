import { signal } from '@preact/signals';
import type { Game, Platform } from '../shared/types/game.types';

/** Query del campo de búsqueda. */
export const searchQuerySignal = signal<string>('');

/** Plataforma seleccionada en el filtro (null = todas). */
export const selectedPlatformSignal = signal<Platform | null>(null);

/** Resultados de búsqueda (juegos mapeados desde RAWG). */
export const searchResultsSignal = signal<Game[]>([]);

/** Estado de loading de la búsqueda. */
export const isSearchingSignal = signal<boolean>(false);

/** Error de la última búsqueda (null = sin error). */
export const searchErrorSignal = signal<string | null>(null);

/** true si el resultado viene del caché local. */
export const fromCacheSignal = signal<boolean>(false);
