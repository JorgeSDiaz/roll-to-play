import { Gamepad2 } from 'lucide-preact';
import { gameListSignal } from '../game-list.signals';
import GameListItem from './GameListItem';

export default function GameList() {
  const games = gameListSignal.value;

  return (
    <section class="mt-2">
      {/* Título */}
      <h2 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 tabular-nums">
        Mi lista ({games.length})
      </h2>

      {games.length === 0 ? (
        /* Estado vacío */
        <div class="flex flex-col items-center gap-2 py-6 text-center">
          <Gamepad2 size={32} class="text-[var(--color-text-muted)]" />
          <p class="text-sm text-[var(--color-text-muted)]">Agrega juegos desde la búsqueda</p>
        </div>
      ) : (
        <ul class="space-y-0">
          {games.map((game) => (
            <GameListItem key={game.id} game={game} />
          ))}
        </ul>
      )}
    </section>
  );
}
