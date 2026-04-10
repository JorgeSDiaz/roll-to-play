import { useEffect, useState } from 'preact/hooks';
import { Settings, Sun, Moon } from 'lucide-preact';
import ApiKeyInput from './ApiKeyInput';

export default function HeaderControls() {
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  useEffect(() => {
    const handler = () => setApiKeyOpen(true);
    document.addEventListener('rtp:open-api-key', handler);
    return () => document.removeEventListener('rtp:open-api-key', handler);
  }, []);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark';
  });

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('rtp:theme', next);
    } catch {
      // fail silently
    }
  }

  return (
    <div class="flex items-center gap-2">
      {/* Toggle dark/light */}
      <button
        onClick={toggleTheme}
        class="flex items-center justify-center w-11 h-11 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* API Key */}
      <button
        onClick={() => setApiKeyOpen(true)}
        class="flex items-center justify-center w-11 h-11 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
        aria-label="Configurar API key de RAWG"
      >
        <Settings size={20} />
      </button>

      <ApiKeyInput open={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
    </div>
  );
}
