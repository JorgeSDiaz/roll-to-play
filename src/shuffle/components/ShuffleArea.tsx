import { useEffect, useRef, useState } from 'preact/hooks';
import { Gamepad2 } from 'lucide-preact';
import { shufflePhaseSignal, currentDisplayedGameSignal } from '../shuffle.signals';
import { gameListSignal } from '../../game-list/game-list.signals';
import type { Game } from '../../shared/types/game.types';

export default function ShuffleArea() {
  const phase = shufflePhaseSignal.value;
  const currentGame = currentDisplayedGameSignal.value;
  const games = gameListSignal.value;

  type CardClass = 'shuffle-card--active' | 'shuffle-card--exiting' | 'shuffle-card--entering';

  // Estado local para la transición CSS entre portadas
  const [displayGame, setDisplayGame] = useState<Game | null>(currentGame);
  const [cardClass, setCardClass] = useState<CardClass>('shuffle-card--active');
  const prevGameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (currentGame && currentGame !== prevGameRef.current) {
      prevGameRef.current = currentGame;

      if (phase === 'shuffling') {
        // Transición: salida → entrada
        setCardClass('shuffle-card--exiting');
        const timerId = setTimeout(() => {
          setDisplayGame(currentGame);
          setCardClass('shuffle-card--entering');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setCardClass('shuffle-card--active');
            });
          });
        }, 50);
        return () => clearTimeout(timerId);
      } else {
        setDisplayGame(currentGame);
        setCardClass('shuffle-card--active');
      }
    }
  }, [currentGame, phase]);

  // Estado idle — grid de portadas de la lista
  if (phase === 'idle') {
    return (
      <div class="flex flex-col items-center gap-6 w-full max-w-sm">
        {games.length === 0 ? (
          <div class="flex flex-col items-center gap-3 py-12 text-center">
            <Gamepad2 size={48} class="text-[var(--color-text-muted)] opacity-40" />
            <p class="text-[var(--color-text-muted)] text-sm max-w-xs">
              Busca juegos en el sidebar y agrégalos a tu lista para poder hacer Roll!
            </p>
          </div>
        ) : (
          <>
            <div class="grid grid-cols-3 gap-2 opacity-60">
              {games.slice(0, 6).map((game) => (
                <div
                  key={game.id}
                  class="aspect-[3/4] rounded-lg overflow-hidden bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]"
                >
                  {game.coverUrl ? (
                    <img
                      src={game.coverUrl}
                      alt={game.name}
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div class="w-full h-full flex items-center justify-center">
                      <Gamepad2 size={24} class="text-[var(--color-text-muted)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {games.length > 1 && (
              <p class="text-xs text-[var(--color-text-muted)]">
                Presiona Roll! para elegir entre {games.length} juegos
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  // Estados shuffling / result
  return (
    <div class="relative w-56 h-80 flex items-center justify-center">
      {/* Glow de fondo */}
      {phase === 'shuffling' && (
        <div class="absolute inset-0 rounded-2xl bg-[var(--color-primary-soft)]/10 blur-xl animate-pulse" />
      )}

      {displayGame && (
        <div
          class={`shuffle-card ${cardClass} ${phase === 'result' ? 'result-card' : ''}`}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            class="w-48 h-64 rounded-xl overflow-hidden border border-[var(--color-border-subtle)] shadow-lg"
            style={
              phase === 'result'
                ? {
                    boxShadow:
                      '0 0 40px color-mix(in srgb, var(--color-primary-soft) 25%, transparent)',
                  }
                : {}
            }
          >
            {displayGame.coverUrl ? (
              <img
                src={displayGame.coverUrl}
                alt={displayGame.name}
                class="w-full h-full object-cover"
              />
            ) : (
              <div class="w-full h-full flex items-center justify-center bg-[var(--color-bg-elevated)]">
                <Gamepad2 size={48} class="text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
