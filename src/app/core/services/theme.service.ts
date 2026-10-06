import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_THEME_COLOR, isThemeColor, ThemeColorName } from '../constants/theme-colors';
import { Theme, ThemeMode } from '../models/theme.model';

const THEME_KEY = 'theme';
// Último color del restaurante, para pintar el login y la carga antes de saber el negocio.
const BRAND_COLOR_KEY = 'redom.brand-color';

/**
 * Apariencia:
 * - modo (sistema/claro/oscuro) y dirección: preferencia de cada dispositivo;
 * - color: es del restaurante (lo configura el negocio y lo ven todos sus usuarios).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly #media = window.matchMedia('(prefers-color-scheme: dark)');
  readonly #systemDark = signal(this.#media.matches);

  public theme = signal<Theme>(this.#load());

  /** Modo efectivo: con "system" resuelve según el dispositivo. */
  readonly $resolvedMode = computed<'light' | 'dark'>(() => {
    const mode = this.theme().mode;
    return mode === 'system' ? (this.#systemDark() ? 'dark' : 'light') : mode;
  });

  constructor() {
    const onChange = (event: MediaQueryListEvent) => this.#systemDark.set(event.matches);
    this.#media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.#media.removeEventListener('change', onChange));

    effect(() => {
      const theme = this.theme();
      const html = document.documentElement;
      html.className = this.$resolvedMode();
      html.setAttribute('data-theme', theme.color);
      html.setAttribute('dir', theme.direction);
      // El color no se guarda aquí: depende del restaurante.
      localStorage.setItem(THEME_KEY, JSON.stringify({ v: 2, mode: theme.mode, direction: theme.direction }));
    });
  }

  public get isDark(): boolean {
    return this.$resolvedMode() === 'dark';
  }

  setMode(mode: ThemeMode) {
    this.theme.update((theme) => ({ ...theme, mode }));
  }

  setDirection(direction: string) {
    this.theme.update((theme) => ({ ...theme, direction }));
  }

  /** Aplica el color de marca del restaurante (o el predeterminado si no tiene). */
  setBrandColor(color: string | null | undefined) {
    const next: ThemeColorName = isThemeColor(color) ? color : DEFAULT_THEME_COLOR;
    localStorage.setItem(BRAND_COLOR_KEY, next);
    this.theme.update((theme) => ({ ...theme, color: next }));
  }

  #load(): Theme {
    const storedColor = localStorage.getItem(BRAND_COLOR_KEY);
    const color = isThemeColor(storedColor) ? storedColor : DEFAULT_THEME_COLOR;
    try {
      const stored = JSON.parse(localStorage.getItem(THEME_KEY) ?? 'null');
      // v1 guardaba "dark" por defecto aunque nadie lo eligiera: se migra a "system".
      const mode: ThemeMode = stored?.v === 2 && ['system', 'light', 'dark'].includes(stored.mode) ? stored.mode : 'system';
      return { mode, color, direction: stored?.direction === 'rtl' ? 'rtl' : 'ltr' };
    } catch {
      return { mode: 'system', color, direction: 'ltr' };
    }
  }
}
