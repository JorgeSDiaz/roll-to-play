import { Shuffle, Loader2 } from 'lucide-preact';
import { canRollSignal } from '../../game-list/game-list.signals';
import { shufflePhaseSignal } from '../shuffle.signals';
import { startShuffle } from '../engine/shuffle.engine';

export default function RollButton() {
  const canRoll = canRollSignal.value;
  const phase = shufflePhaseSignal.value;
  const isShuffling = phase === 'shuffling';
  const disabled = !canRoll || isShuffling;

  return (
    <div class="flex flex-col items-center gap-2">
      <button
        onClick={startShuffle}
        disabled={disabled}
        class={[
          'flex items-center gap-2 px-12 py-4 rounded-xl text-xl font-bold min-w-[200px] justify-center',
          'transition-all duration-150 cursor-pointer',
          'bg-[var(--color-primary)] text-[var(--color-bg-deep)]',
          disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:brightness-110 hover:shadow-[0_0_32px_color-mix(in_srgb,var(--color-primary-soft)_50%,transparent)] active:scale-[0.97]',
        ].join(' ')}
        aria-label="Elegir juego al azar"
      >
        {isShuffling ? <Loader2 size={20} class="animate-spin" /> : <Shuffle size={20} />}
        {isShuffling ? 'Eligiendo...' : 'Roll!'}
      </button>

      {!canRoll && !isShuffling && (
        <p class="text-xs text-[var(--color-text-muted)]">
          Agrega al menos 2 juegos para hacer Roll
        </p>
      )}
    </div>
  );
}
