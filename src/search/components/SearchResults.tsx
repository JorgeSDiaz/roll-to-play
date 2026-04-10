import { Plus, Gamepad2 } from 'lucide-preact';
import {
  searchResultsSignal,
  isSearchingSignal,
  searchErrorSignal,
  fromCacheSignal,
} from '../search.signals';
import { gameIdsSetSignal, addGame } from '../../game-list/game-list.signals';
import { PLATFORM_LABELS } from '../../shared/types/game.types';
import type { Game } from '../../shared/types/game.types';

function SkeletonItem() {
  return (
    <li class="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] animate-pulse">
      <div class="w-12 h-16 rounded bg-[var(--color-bg-overlay)] shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="h-3 rounded bg-[var(--color-bg-overlay)] w-3/4" />
        <div class="h-3 rounded bg-[var(--color-bg-overlay)] w-1/2" />
      </div>
    </li>
  );
}

function GameCard({ game }: { game: Game }) {
  const alreadyAdded = gameIdsSetSignal.value.has(game.id);
  const primaryPlatform = game.platforms[0];
  const platformLabel = primaryPlatform !== undefined ? PLATFORM_LABELS[primaryPlatform] : null;

  return (
    <li class="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-overlay)] hover:border-[var(--color-border-default)] transition-colors duration-150 group">
      {/* Portada */}
      <div class="w-12 h-16 shrink-0 rounded overflow-hidden bg-[var(--color-bg-overlay)] flex items-center justify-center">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.name}
            loading="lazy"
            class="w-full h-full object-cover"
          />
        ) : (
          <Gamepad2 size={20} class="text-[var(--color-text-muted)]" />
        )}
      </div>

      {/* Info */}
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-[var(--color-text-primary)] leading-snug line-clamp-2">
          {game.name}
        </p>
        {platformLabel && (
          <span class="inline-block mt-1 px-1.5 py-0.5 rounded-sm text-xs font-medium bg-[var(--color-secondary-soft)]/15 text-[var(--color-secondary)]">
            {platformLabel}
          </span>
        )}
      </div>

      {/* Agregar */}
      <button
        onClick={() => addGame(game)}
        disabled={alreadyAdded}
        class={[
          'flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150 cursor-pointer shrink-0',
          alreadyAdded
            ? 'text-[var(--color-secondary)] bg-[var(--color-secondary-soft)]/15 cursor-default'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]',
        ].join(' ')}
        aria-label={alreadyAdded ? `${game.name} ya está en tu lista` : `Agregar ${game.name}`}
        title={alreadyAdded ? 'Ya en tu lista' : 'Agregar a la lista'}
      >
        <Plus size={16} />
      </button>
    </li>
  );
}

export default function SearchResults() {
  const isLoading = isSearchingSignal.value;
  const error = searchErrorSignal.value;
  const results = searchResultsSignal.value;
  const fromCache = fromCacheSignal.value;

  if (isLoading) {
    return (
      <ul class="space-y-2 mt-3">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </ul>
    );
  }

  if (error) {
    return (
      <div class="mt-3 flex items-start gap-2 p-3 rounded-md bg-[var(--color-tertiary-soft)]/10 border border-[var(--color-tertiary-soft)]/30 text-[var(--color-tertiary)] text-sm">
        <span class="shrink-0 mt-0.5">⚠</span>
        <span>{error}</span>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div class="mt-3">
      {fromCache && (
        <div class="flex items-center gap-1.5 mb-2">
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-normal bg-[var(--color-primary-soft)]/15 text-[var(--color-primary)]">
            <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] inline-block" />
            caché
          </span>
        </div>
      )}
      <ul class="space-y-2">
        {results.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </ul>
    </div>
  );
}
