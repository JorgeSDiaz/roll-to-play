import { ChevronDown } from 'lucide-preact';
import { Platform, PLATFORM_LABELS } from '../../shared/types/game.types';
import { selectedPlatformSignal } from '../search.signals';

export default function PlatformFilter() {
  const platforms = Object.entries(PLATFORM_LABELS) as [string, string][];

  function handleChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    selectedPlatformSignal.value = value === '' ? null : (Number(value) as Platform);
  }

  return (
    <div class="relative">
      <select
        value={selectedPlatformSignal.value ?? ''}
        onChange={handleChange}
        class="w-full h-9 pl-3 pr-8 rounded-md text-sm appearance-none bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] focus:outline-none focus:border-2 focus:border-[var(--color-border-focus)] transition-colors duration-150 cursor-pointer"
        aria-label="Filtrar por plataforma"
      >
        <option value="">Todas las plataformas</option>
        {platforms.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
      />
    </div>
  );
}
