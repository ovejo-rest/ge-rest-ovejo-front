import { Injectable, signal } from '@angular/core';
import { PosWaiter } from './dtos';

const STORAGE_KEY = 'redom.pos.waiter';

// Mesero activo en este dispositivo. Se guarda por pestaña para sobrevivir a un refresh.
@Injectable({ providedIn: 'root' })
export class PosSessionService {
  readonly $waiter = signal<PosWaiter | null>(this.#restore());
  // true cuando se usa el POS sin identificar mesero (por ejemplo, un administrador).
  readonly $isAnonymous = signal(false);

  start(waiter: PosWaiter) {
    this.$waiter.set(waiter);
    this.$isAnonymous.set(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(waiter));
    } catch {
      // Sin almacenamiento disponible la sesión dura hasta recargar.
    }
  }

  startAnonymous() {
    this.end();
    this.$isAnonymous.set(true);
  }

  end() {
    this.$waiter.set(null);
    this.$isAnonymous.set(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorado: no hay nada que limpiar.
    }
  }

  #restore(): PosWaiter | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const waiter = stored ? (JSON.parse(stored) as PosWaiter) : null;
      return waiter?.code && waiter?.name ? waiter : null;
    } catch {
      return null;
    }
  }
}
