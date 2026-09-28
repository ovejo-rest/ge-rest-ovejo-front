import { Injectable, signal } from '@angular/core';

export type TerminalModeConfig = Readonly<{
  enabled: boolean;
  locationId: number | null;
  locationName: string | null;
  // Segundos sin tocar la pantalla antes de volver al PIN.
  inactivitySeconds: number;
}>;

const STORAGE_KEY = 'redom.terminal-mode';
const DEFAULT_CONFIG: TerminalModeConfig = { enabled: false, locationId: null, locationName: null, inactivitySeconds: 60 };

/**
 * Modo terminal de este equipo (pantalla compartida del salón). Se guarda en el navegador:
 * mientras está activo, el backoffice redirige a /terminal y solo se sale con credenciales.
 */
@Injectable({ providedIn: 'root' })
export class TerminalModeService {
  readonly $config = signal<TerminalModeConfig>(this.#restore());

  enable(config: Omit<TerminalModeConfig, 'enabled'>) {
    this.#save({ ...config, enabled: true });
  }

  disable() {
    this.#save({ ...this.$config(), enabled: false });
  }

  isEnabled(): boolean {
    return this.$config().enabled;
  }

  #save(config: TerminalModeConfig) {
    this.$config.set(config);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Sin almacenamiento, el modo terminal dura hasta recargar.
    }
  }

  #restore(): TerminalModeConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_CONFIG, ...(JSON.parse(stored) as Partial<TerminalModeConfig>) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }
}
