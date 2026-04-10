import { useEffect, useRef, useState } from 'preact/hooks';
import { Gamepad2 } from 'lucide-preact';
import { shufflePhaseSignal, currentDisplayedGameSignal } from '../shuffle.signals';
import { gameListSignal } from '../../game-list/game-list.signals';
import type { Game } from '../../shared/types/game.types';
import GameCard from '../../shared/ui/GameCard';

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

  // Estado idle — pila de portadas
  if (phase === 'idle') {
    const IDLE_W = 320;
    const IDLE_H = 200;
    const IDLE_OFFSET = 10;
    // Mostrar hasta 5 cartas en la pila; el resto no cambia el visual
    // Último agregado al frente → invertir y tomar los primeros 5
    const visibleGames = [...games].reverse().slice(0, 5);
    const n = visibleGames.length;
    // El contenedor crece hacia arriba: altura = carta + offsets de las cartas traseras
    const stackH = IDLE_H + IDLE_OFFSET * Math.max(n - 1, 0);

    return (
      <div class="flex flex-col items-center gap-6">
        {games.length === 0 ? (
          <div class="flex flex-col items-center gap-3 py-12 text-center">
            <Gamepad2 size={48} class="text-[var(--color-text-muted)] opacity-40" />
            <p class="text-[var(--color-text-muted)] text-sm max-w-xs">
              Busca juegos en el sidebar y agrégalos a tu lista para poder hacer Roll!
            </p>
          </div>
        ) : (
          <>
            {/* Pila apilada: i=0 es la carta del frente (último agregado) */}
            <div
              style={{
                position: 'relative',
                width: `${IDLE_W}px`,
                height: `${stackH}px`,
                opacity: 0.85,
              }}
            >
              {visibleGames.map((game, i) => {
                // i=0 → frente (abajo del contenedor), i=n-1 → más atrás (arriba)
                // top decrece con i: la carta de más atrás tiene top=0, la del frente top=(n-1)*offset
                const topOffset = (n - 1 - i) * IDLE_OFFSET;
                return (
                  <div
                    key={game.id}
                    style={{
                      position: 'absolute',
                      top: `${topOffset}px`,
                      left: 0,
                      zIndex: n - i, // i=0 frente → zIndex=n (máximo)
                    }}
                  >
                    <GameCard game={game} width={IDLE_W} height={IDLE_H} variant="default" />
                  </div>
                );
              })}
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
    <div
      class="relative flex items-center justify-center"
      style={{ width: '320px', height: '200px' }}
    >
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
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GameCard
            game={displayGame}
            width={320}
            height={200}
            variant={phase === 'result' ? 'winner' : 'default'}
          />
        </div>
      )}
    </div>
  );
}
