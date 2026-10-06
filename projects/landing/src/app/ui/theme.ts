import { DestroyRef, DOCUMENT, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'system' | 'light' | 'dark';

export const BRAND_COLORS = [
  { name: 'base', label: 'Frambuesa', hex: '#e11d48' },
  { name: 'red', label: 'Rojo', hex: '#cc0033' },
  { name: 'orange', label: 'Naranja', hex: '#ea580c' },
  { name: 'yellow', label: 'Amarillo', hex: '#facc15' },
  { name: 'green', label: 'Verde', hex: '#22c55e' },
  { name: 'blue', label: 'Azul', hex: '#2490ff' },
  { name: 'violet', label: 'Violeta', hex: '#6e56cf' },
] as const;

export type BrandColor = (typeof BRAND_COLORS)[number]['name'];

const MODE_KEY = 'redom-landing.mode';

/**
 * Modo claro/oscuro de la landing (se recuerda; por defecto el del dispositivo) y color de marca
 * de demostración (no se guarda: solo muestra cómo cada restaurante personaliza la app).
 * En el prerender (Node) no toca el DOM; el script de index.html pinta el modo antes de cargar.
 */
@Injectable({ providedIn: 'root' })
export class LandingTheme {
  readonly #document = inject(DOCUMENT);
  readonly #browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly mode = signal<ThemeMode>('system');
  readonly color = signal<BrandColor>('base');
  readonly #systemDark = signal(false);

  constructor() {
    if (!this.#browser) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    this.#systemDark.set(media.matches);
    const onChange = (event: MediaQueryListEvent) => this.#systemDark.set(event.matches);
    media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change', onChange));

    try {
      const stored = localStorage.getItem(MODE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') this.mode.set(stored);
    } catch {
      /* sin almacenamiento: se usa el del dispositivo */
    }

    effect(() => {
      const mode = this.mode();
      const dark = mode === 'dark' || (mode === 'system' && this.#systemDark());
      const html = this.#document.documentElement;
      html.classList.toggle('dark', dark);
      html.setAttribute('data-theme', this.color());
      try {
        localStorage.setItem(MODE_KEY, mode);
      } catch {
        /* ignorar */
      }
    });
  }

  /** Sistema → Claro → Oscuro → Sistema. */
  cycleMode() {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    this.mode.set(order[(order.indexOf(this.mode()) + 1) % order.length]);
  }
}
