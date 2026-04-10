import { Gamepad2 } from 'lucide-preact';
import type { Game } from '../types/game.types';

interface GameCardProps {
  game: Game;
  width: number;
  height: number;
  /** Estilo de borde. Por defecto usa el borde sutil. */
  variant?: 'default' | 'winner';
  style?: Record<string, string | number>;
  class?: string;
}

/**
 * Componente reutilizable para mostrar la portada (background_image) de un juego.
 * Siempre aspect-ratio libre según width/height proporcionados.
 */
export default function GameCard({
  game,
  width,
  height,
  variant = 'default',
  style = {},
  class: className = '',
}: GameCardProps) {
  const border =
    variant === 'winner'
      ? '2px solid var(--color-primary-soft)'
      : '2px solid var(--color-border-subtle)';

  const shadow =
    variant === 'winner'
      ? '0 0 48px color-mix(in srgb, var(--color-primary-soft) 45%, transparent), 0 10px 32px rgba(0,0,0,0.65)'
      : '0 4px 14px rgba(0,0,0,0.45)';

  return (
    <div
      class={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        border,
        boxShadow: shadow,
        flexShrink: 0,
        ...style,
      }}
    >
      {game.coverUrl ? (
        <img
          src={game.coverUrl}
          alt={game.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-elevated)',
          }}
        >
          <Gamepad2 size={Math.min(width, height) / 3} class="text-[var(--color-text-muted)]" />
        </div>
      )}
    </div>
  );
}
