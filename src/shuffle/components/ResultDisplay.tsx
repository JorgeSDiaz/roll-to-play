import { RefreshCw, Shuffle } from 'lucide-preact';
import { shufflePhaseSignal, selectedGameSignal } from '../shuffle.signals';
import { startShuffle, resetShuffle } from '../engine/shuffle.engine';
import { gameListSignal } from '../../game-list/game-list.signals';
import GameCard from '../../shared/ui/GameCard';

const STACK_OFFSET = 14; // px que asoma cada carta trasera por encima de la anterior
const DECK_W = 200;
const DECK_H = 126;
const WIN_W = 320;
const WIN_H = 200;

export default function ResultDisplay() {
  const phase = shufflePhaseSignal.value;
  const game = selectedGameSignal.value;
  const allGames = gameListSignal.value;

  if (phase !== 'result' || !game) return null;

  const deckGames = allGames.filter((g) => g.id !== game.id).slice(0, 4);
  const n = deckGames.length;
  const deckTotalH = DECK_H + STACK_OFFSET * Math.max(n - 1, 0);

  return (
    <div class="flex flex-col items-center gap-8 animate-[fade-in_200ms_ease-out_300ms_both]">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px' }}>
        {/* Mazo apilado con los otros juegos */}
        {n > 0 && (
          <div
            style={{
              position: 'relative',
              width: `${DECK_W}px`,
              height: `${deckTotalH}px`,
              flexShrink: 0,
            }}
          >
            {deckGames.map((g, i) => {
              // i=0 → carta del frente (abajo), i=n-1 → más atrás (arriba)
              const topOffset = (n - 1 - i) * STACK_OFFSET;
              return (
                <div
                  key={g.id}
                  style={{
                    position: 'absolute',
                    top: `${topOffset}px`,
                    left: 0,
                    zIndex: i + 1,
                  }}
                >
                  <GameCard game={g} width={DECK_W} height={DECK_H} variant="default" />
                </div>
              );
            })}
          </div>
        )}

        {/* Carta ganadora */}
        <GameCard game={game} width={WIN_W} height={WIN_H} variant="winner" />
      </div>

      {/* Nombre */}
      <h2 class="text-3xl font-bold text-[var(--color-text-primary)] text-center leading-tight max-w-xl animate-[fade-in_200ms_ease-out_150ms_both]">
        {game.name}
      </h2>

      {/* Acciones */}
      <div class="flex gap-3 animate-[fade-in_200ms_ease-out_300ms_both]">
        <button
          onClick={() => {
            resetShuffle();
            startShuffle();
          }}
          class="flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-overlay)] transition-colors duration-150 cursor-pointer"
        >
          <Shuffle size={14} />
          Roll de nuevo
        </button>
        <button
          onClick={resetShuffle}
          class="flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-overlay)] transition-colors duration-150 cursor-pointer"
        >
          <RefreshCw size={14} />
          Volver
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
