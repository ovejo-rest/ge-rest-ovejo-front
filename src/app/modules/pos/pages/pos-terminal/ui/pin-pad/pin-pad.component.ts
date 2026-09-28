import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from '@angular/core';
import { IconComponent } from 'src/ui';

// El PIN del POS es de 4 dígitos exactos.
const PIN_LENGTH = 4;

@Component({
  selector: 'app-pin-pad',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pin-pad.component.html',
  styles: `
    .pin-dot { border-color: var(--border); }
    .pin-dot--filled { background: var(--primary); border-color: var(--primary); transform: scale(1.1); }
    .pin-dot--error { background: rgb(239 68 68); border-color: rgb(239 68 68); }
    .pin-shake { animation: pin-shake 0.4s ease-in-out; }
    @keyframes pin-shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-10px); }
      40%, 80% { transform: translateX(10px); }
    }
    .pin-key {
      display: flex; align-items: center; justify-content: center;
      width: 4.5rem; height: 4.5rem; border-radius: 9999px;
      font-size: 1.75rem; font-weight: 500; color: var(--foreground);
      background: color-mix(in srgb, var(--muted) 35%, transparent);
      transition: transform 0.12s ease, background-color 0.2s ease;
    }
    .pin-key:active:not(:disabled) { transform: scale(0.92); background: color-mix(in srgb, var(--primary) 30%, transparent); }
    .pin-key:disabled { opacity: 0.4; }
    .pin-key--ghost { background: transparent; }
    /* Variante vidrio: sobre fondo oscuro, texto blanco. */
    .pin-glass .pin-dot { border-color: rgb(255 255 255 / 0.55); }
    .pin-glass .pin-dot--filled { background: #fff; border-color: #fff; }
    .pin-glass .pin-key {
      color: #fff;
      background: rgb(255 255 255 / 0.12);
      border: 1px solid rgb(255 255 255 / 0.18);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.15);
    }
    .pin-glass .pin-key:active:not(:disabled) { background: rgb(255 255 255 / 0.3); }
    .pin-glass .pin-key--ghost { background: transparent; border-color: transparent; box-shadow: none; backdrop-filter: none; }
    @media (prefers-reduced-motion: reduce) { .pin-shake { animation: none; } }
  `,
})
export class PinPadComponent {
  readonly disabled = input(false);
  // glass: teclas circulares translúcidas (pantalla de bloqueo de la terminal).
  readonly appearance = input<'default' | 'glass'>('default');
  readonly submitPin = output<string>();

  readonly keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  readonly slots = Array.from({ length: PIN_LENGTH }, (_, index) => index);
  readonly pinLength = PIN_LENGTH;
  readonly $pin = signal('');
  readonly $error = signal(false);

  press(digit: string) {
    if (this.disabled() || this.$error() || this.$pin().length >= PIN_LENGTH) return;
    this.$pin.update((pin) => pin + digit);
    // Con el cuarto dígito se envía solo: no hace falta tocar "Entrar".
    if (this.$pin().length === PIN_LENGTH) this.submit();
  }

  backspace() {
    this.$pin.update((pin) => pin.slice(0, -1));
  }

  clear() {
    this.$pin.set('');
  }

  // PIN incorrecto: los puntos tiemblan y se borran.
  fail() {
    this.$error.set(true);
    setTimeout(() => {
      this.$error.set(false);
      this.$pin.set('');
    }, 450);
  }

  submit() {
    if (this.disabled() || this.$pin().length !== PIN_LENGTH) return;
    this.submitPin.emit(this.$pin());
  }

  // Permite usar el teclado físico además del táctil.
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (/^\d$/.test(event.key)) this.press(event.key);
    else if (event.key === 'Backspace') this.backspace();
    else if (event.key === 'Enter') this.submit();
    else return;
    event.preventDefault();
  }
}
