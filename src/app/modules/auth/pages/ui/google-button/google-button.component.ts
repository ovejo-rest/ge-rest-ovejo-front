import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, NgZone, output, signal, viewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent, ToastService } from 'src/ui';
import { GoogleIdentityService } from '../../data-access';

/**
 * Botón "Continuar con Google" (registro y login en el mismo botón).
 * Con googleClientId configurado dibuja el botón oficial de Google; si no, muestra el botón de siempre y avisa.
 */
@Component({
  selector: 'app-google-button',
  imports: [ButtonComponent, AngularSvgIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (google.isConfigured && !$failed()) {
    <div class="flex min-h-[44px] justify-center" [class.pointer-events-none]="disabled()" [class.opacity-60]="disabled()">
      <div #host></div>
      @if (!$ready()) {
      <div class="bg-muted/30 h-11 w-full animate-pulse rounded-full"></div>
      }
    </div>
    } @else {
    <app-button full impact="bold" tone="light" shape="rounded" size="medium" type="button" (buttonClick)="notConfigured()">
      <svg-icon src="assets/icons/google-logo.svg" [svgClass]="'h-6 w-6 mr-2'"></svg-icon>
      {{ label() }}
    </app-button>
    }
  `,
})
export class GoogleButtonComponent implements AfterViewInit {
  readonly google = inject(GoogleIdentityService);
  private readonly toast = inject(ToastService);
  private readonly zone = inject(NgZone);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly label = input('Continuar con Google');
  readonly disabled = input(false);
  // idToken (credential) de Google: la página lo envía a POST /login/google.
  readonly credential = output<string>();

  private readonly host = viewChild<ElementRef<HTMLElement>>('host');
  readonly $ready = signal(false);
  readonly $failed = signal(false);

  ngAfterViewInit(): void {
    const host = this.host()?.nativeElement;
    if (!host) return;
    const width = (this.elementRef.nativeElement as HTMLElement).clientWidth || 320;
    this.google
      .renderButton(host, (idToken) => this.zone.run(() => this.credential.emit(idToken)), width)
      .then(() => this.$ready.set(true))
      .catch(() => this.$failed.set(true));
  }

  notConfigured() {
    this.toast.show(
      this.$failed() ? 'No se pudo cargar Google. Revisa tu conexión.' : 'El acceso con Google aún no está configurado.',
      'warning',
    );
  }
}
