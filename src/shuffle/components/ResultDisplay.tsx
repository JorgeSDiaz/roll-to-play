import { RefreshCw, Gamepad2, Shuffle } from 'lucide-preact';
import { shufflePhaseSignal, selectedGameSignal } from '../shuffle.signals';
import { startShuffle, resetShuffle } from '../engine/shuffle.engine';

export default function ResultDisplay() {
  const phase = shufflePhaseSignal.value;
  const game = selectedGameSignal.value;

  if (phase !== 'result' || !game) return null;

  return (
    <div class="flex flex-col items-center gap-6 animate-[fade-in_200ms_ease-out_300ms_both]">
      {/* Portada grande */}
      <div
        class="w-full max-w-[300px] rounded-xl overflow-hidden border-2 border-[var(--color-border-subtle)] result-card"
        style={{
          boxShadow: '0 0 40px color-mix(in srgb, var(--color-primary-soft) 20%, transparent)',
        }}
      >
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.name}
            class="w-full object-cover"
            style={{ aspectRatio: '3/4' }}
          />
        ) : (
          <div
            class="w-full flex items-center justify-center bg-[var(--color-bg-elevated)]"
            style={{ aspectRatio: '3/4' }}
          >
            <Gamepad2 size={64} class="text-[var(--color-text-muted)]" />
          </div>
        )}
      </div>

      {/* Nombre */}
      <h2 class="text-3xl font-bold text-[var(--color-text-primary)] text-center leading-tight max-w-xs animate-[fade-in_200ms_ease-out_150ms_both]">
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
