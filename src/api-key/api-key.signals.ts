import { signal, computed, effect } from '@preact/signals';

const STORAGE_KEY = 'rtp:api-key';

/**
 * Signal reactivo con la API key de RAWG.
 * Se inicializa desde localStorage y se sincroniza con cada cambio.
 */
export const apiKeySignal = signal<string>(
  typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) ?? '') : '',
);

/** true si hay una API key configurada y no está vacía. */
export const hasApiKeySignal = computed(() => apiKeySignal.value.trim().length > 0);

// Persistir cambios en localStorage
if (typeof localStorage !== 'undefined') {
  effect(() => {
    const key = apiKeySignal.value.trim();
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  });
}
