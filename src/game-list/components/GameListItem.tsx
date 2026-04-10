import { X, Gamepad2 } from 'lucide-preact';
import type { Game } from '../../shared/types/game.types';
import { PLATFORM_LABELS } from '../../shared/types/game.types';
import { removeGame } from '../game-list.signals';

interface GameListItemProps {
  game: Game;
}

export default function GameListItem({ game }: GameListItemProps) {
  const primaryPlatform = game.platforms[0];
  const platformLabel = primaryPlatform !== undefined ? PLATFORM_LABELS[primaryPlatform] : null;

  return (
    <li class="flex items-center gap-3 py-2 border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-bg-elevated)]/50 rounded-md px-1 transition-colors duration-150 group">
      {/* Portada miniatura */}
      <div class="w-10 h-10 shrink-0 rounded overflow-hidden bg-[var(--color-bg-elevated)] flex items-center justify-center">
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
        <p class="text-sm font-medium text-[var(--color-text-primary)] truncate leading-tight">
          {game.name}
        </p>
        {platformLabel && (
          <span class="inline-block mt-0.5 px-1.5 py-0.5 rounded-sm text-xs font-medium bg-[var(--color-secondary-soft)]/15 text-[var(--color-secondary)]">
            {platformLabel}
          </span>
        )}
      </div>

      {/* Eliminar */}
      <button
        onClick={() => removeGame(game.id)}
        class="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-tertiary-soft)]/20 hover:text-[var(--color-tertiary)] transition-colors duration-150 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Eliminar ${game.name}`}
      >
        <X size={14} />
      </button>
    </li>
  );
}
