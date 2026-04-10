import { useState } from 'preact/hooks';
import { Key, X, ExternalLink } from 'lucide-preact';
import { apiKeySignal, hasApiKeySignal } from '../api-key.signals';

interface ApiKeyInputProps {
  /** Controla si el modal está abierto (controlado externamente). */
  open: boolean;
  onClose: () => void;
}

export default function ApiKeyInput({ open, onClose }: ApiKeyInputProps) {
  const [draft, setDraft] = useState(apiKeySignal.value);
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  function handleSave() {
    apiKeySignal.value = draft.trim();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  }

  return (
    /* Overlay */
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div class="relative w-full max-w-md mx-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-base)] p-6 shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-[modal-in_200ms_ease-out]">
        {/* Header */}
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2 text-[var(--color-text-primary)]">
            <Key size={16} />
            <span class="text-lg font-semibold">API Key de RAWG</span>
          </div>
          <button
            onClick={onClose}
            class="flex items-center justify-center w-8 h-8 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-overlay)] transition-colors duration-150 cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Descripción */}
        <p class="text-sm text-[var(--color-text-secondary)] mb-4">
          RollToPlay usa la API gratuita de RAWG para buscar juegos y portadas. Regístrate gratis en{' '}
          <a
            href="https://rawg.io/apidocs"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            rawg.io/apidocs
            <ExternalLink size={12} />
          </a>{' '}
          y pega tu key aquí.
        </p>

        {/* Input */}
        <input
          type="text"
          value={draft}
          onInput={(e) => setDraft((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          placeholder="Pega tu API key de RAWG aquí"
          class="w-full h-9 px-3 rounded-md text-sm bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] border border-[var(--color-border-default)] focus:outline-none focus:border-[var(--color-border-focus)] focus:border-2 transition-colors duration-150"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />

        {/* Estado de la key actual */}
        {hasApiKeySignal.value && !saved && (
          <p class="mt-2 text-xs text-[var(--color-secondary)]">
            Key configurada. Puedes reemplazarla.
          </p>
        )}

        {/* Acciones */}
        <div class="flex gap-2 mt-4 justify-end">
          <button
            onClick={onClose}
            class="h-9 px-4 rounded-md text-sm font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-overlay)] transition-colors duration-150 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!draft.trim()}
            class="h-9 px-4 rounded-md text-sm font-bold bg-[var(--color-primary)] text-[var(--color-bg-deep)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            {saved ? '¡Guardada!' : 'Guardar'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
