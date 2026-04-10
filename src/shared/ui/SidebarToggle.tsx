import { Menu } from 'lucide-preact';

export default function SidebarToggle() {
  function handleClick() {
    document.dispatchEvent(new CustomEvent('rtp:open-sidebar'));
  }

  return (
    <button
      onClick={handleClick}
      class="flex items-center justify-center w-11 h-11 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer md:hidden"
      aria-label="Abrir menú"
    >
      <Menu size={24} />
    </button>
  );
}
