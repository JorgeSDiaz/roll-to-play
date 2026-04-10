import { RefreshCw, Gamepad2, Shuffle } from 'lucide-preact';
import { shufflePhaseSignal, selectedGameSignal } from '../shuffle.signals';
import { startShuffle, resetShuffle } from '../engine/shuffle.engine';
import { gameListSignal } from '../../game-list/game-list.signals';

const CARD_INSET = '30px 40px';

const BACK_CARDS: { rotate: number; translateX: number; translateY: number; scale: number }[] = [
  { rotate: -8, translateX: -28, translateY: 6, scale: 0.94 },
  { rotate: 5, translateX: 22, translateY: 10, scale: 0.91 },
  { rotate: -3, translateX: -10, translateY: 14, scale: 0.88 },
];

function CardBack({
  coverUrl,
  name,
  rotate,
  translateX,
  translateY,
  scale,
}: {
  coverUrl: string | null;
  name: string;
  rotate: number;
  translateX: number;
  translateY: number;
  scale: number;
}) {
  return (
    <div
      class="absolute rounded-xl overflow-hidden border-2 border-[var(--color-border-subtle)]"
      style={{
        inset: CARD_INSET,
        transform: `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px) scale(${scale})`,
        transformOrigin: 'center bottom',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {coverUrl ? (
        <img src={coverUrl} alt={name} class="w-full h-full object-cover" />
      ) : (
        <div class="w-full h-full flex items-center justify-center bg-[var(--color-bg-elevated)]">
          <Gamepad2 size={40} class="text-[var(--color-text-muted)]" />
        </div>
      )}
    </div>
  );
}

export default function ResultDisplay() {
  const phase = shufflePhaseSignal.value;
  const game = selectedGameSignal.value;
  const allGames = gameListSignal.value;

  if (phase !== 'result' || !game) return null;

  // Primeros N juegos de la lista (excluido el ganador), pseudo-aleatorio pero estable
  const backGames = allGames.filter((g) => g.id !== game.id).slice(0, BACK_CARDS.length);

  return (
    <div class="flex flex-col items-center gap-8 animate-[fade-in_200ms_ease-out_300ms_both]">
      {/* Pila de cartas — contenedor con overflow visible y padding para que las cartas de fondo no se corten */}
      <div
        class="relative"
        style={{ width: '320px', height: '440px', padding: '30px 40px' }}
      >
        {backGames.map((g, i) => (
          <CardBack key={g.id} coverUrl={g.coverUrl} name={g.name} {...BACK_CARDS[i]} />
        ))}

        {/* Carta principal — el juego ganador */}
        <div
          class="absolute rounded-xl overflow-hidden border-2 border-[var(--color-primary-soft)]"
          style={{
            inset: CARD_INSET,
            boxShadow: '0 0 48px color-mix(in srgb, var(--color-primary-soft) 35%, transparent), 0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        >
          {game.coverUrl ? (
            <img src={game.coverUrl} alt={game.name} class="w-full h-full object-cover" />
          ) : (
            <div class="w-full h-full flex items-center justify-center bg-[var(--color-bg-elevated)]">
              <Gamepad2 size={64} class="text-[var(--color-text-muted)]" />
            </div>
          )}
        </div>
      </div>

      <h2 class="text-3xl font-bold text-[var(--color-text-primary)] text-center leading-tight max-w-xs animate-[fade-in_200ms_ease-out_150ms_both]">
        {game.name}
      </h2>

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
