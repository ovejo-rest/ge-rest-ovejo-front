import { Component, ChangeDetectionStrategy, DestroyRef, ElementRef, NgZone, afterNextRender, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IconComponent } from 'src/ui';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AngularSvgIconModule, RouterOutlet, IconComponent],
})
export class AuthComponent {
  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Parallax del fondo con el mouse: solo con puntero fino (no táctil) y sin "reducir movimiento".
    afterNextRender(() => {
      const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!canHover || reduceMotion) return;

      const element = this.screen().nativeElement;
      let frame = 0;
      const onMove = (event: PointerEvent) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          // -0.5 … 0.5 según la posición del cursor en la ventana.
          element.style.setProperty('--auth-mx', (event.clientX / window.innerWidth - 0.5).toFixed(3));
          element.style.setProperty('--auth-my', (event.clientY / window.innerHeight - 0.5).toFixed(3));
        });
      };
      // Fuera de Angular: mover el mouse no dispara detección de cambios.
      this.zone.runOutsideAngular(() => window.addEventListener('pointermove', onMove, { passive: true }));
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', onMove);
        cancelAnimationFrame(frame);
      });
    });
  }

  readonly features = [
    { icon: 'point_of_sale', label: 'Pedidos y POS' },
    { icon: 'restaurant', label: 'Cocina y mesas' },
    { icon: 'payments', label: 'Pagos y reportes' },
  ];
}
