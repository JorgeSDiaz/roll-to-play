import { useState } from 'preact/hooks';
import { Search, X, Key, ExternalLink, Loader2 } from 'lucide-preact';
import { hasApiKeySignal } from '../../api-key/api-key.signals';
import {
  searchQuerySignal,
  selectedPlatformSignal,
  searchResultsSignal,
  isSearchingSignal,
  searchErrorSignal,
  fromCacheSignal,
} from '../search.signals';
import { searchGames } from '../services/rawg.service';
import PlatformFilter from './PlatformFilter';
import SearchResults from './SearchResults';

export default function SearchPanel() {
  const [inputValue, setInputValue] = useState('');

  async function handleSearch() {
    const query = inputValue.trim();
    if (!query) return;

    searchQuerySignal.value = query;
    isSearchingSignal.value = true;
    searchErrorSignal.value = null;
    fromCacheSignal.value = false;

    try {
      const { games, fromCache } = await searchGames(query, selectedPlatformSignal.value);
      searchResultsSignal.value = games;
      fromCacheSignal.value = fromCache;
    } catch (err) {
      searchErrorSignal.value = err instanceof Error ? err.message : 'Error al buscar juegos.';
      searchResultsSignal.value = [];
    } finally {
      isSearchingSignal.value = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleClear() {
    setInputValue('');
  }

  const hasKey = hasApiKeySignal.value;
  const isSearching = isSearchingSignal.value;

  return (
    <div class="space-y-3">
      {/* Filtro de plataforma */}
      <PlatformFilter />

      {/* Aviso sin API key */}
      {!hasKey && (
        <div class="flex items-start gap-2 p-3 rounded-md bg-[var(--color-tertiary-soft)]/10 border border-[var(--color-tertiary-soft)]/30 text-[var(--color-tertiary)] text-sm">
          <Key size={14} class="shrink-0 mt-0.5" />
          <span>
            Configura tu{' '}
            <button
              onClick={() => {
                // Dispara el modal desde el header — emite evento personalizado
                document.dispatchEvent(new CustomEvent('rtp:open-api-key'));
              }}
              class="underline cursor-pointer font-medium"
            >
              API key de RAWG
            </button>{' '}
            para buscar juegos.{' '}
            <a
              href="https://rawg.io/apidocs"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 underline"
            >
              Obtener gratis <ExternalLink size={11} />
            </a>
          </span>
        </div>
      )}

      {/* Campo de búsqueda */}
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search
            size={14}
            class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          />
          <input
            type="text"
            value={inputValue}
            onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar juego..."
            disabled={!hasKey || isSearching}
            class="w-full h-9 pl-8 pr-8 rounded-md text-sm bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] border border-[var(--color-border-default)] focus:outline-none focus:border-2 focus:border-[var(--color-border-focus)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={!hasKey || isSearching || !inputValue.trim()}
          class="h-9 px-4 rounded-md text-sm font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-overlay)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer flex items-center gap-1.5"
        >
          {isSearching ? <Loader2 size={14} class="animate-spin" /> : null}
          Buscar
        </button>
      </div>

      {/* Resultados */}
      <SearchResults />
    </div>
  );
}
