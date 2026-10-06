import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, NgZone, viewChild } from '@angular/core';

/**
 * Fondo vivo de la página (detrás de las secciones):
 * - manchas de color de marca que flotan lentamente y una grilla de puntos;
 * - un brillo que sigue al mouse con inercia;
 * - "spotlight" en las tarjetas .lnd-card (se iluminan donde está el puntero).
 * Todo corre fuera de Angular con requestAnimationFrame; en táctil o con movimiento reducido queda estático.
 */
@Component({
  selector: 'lnd-ambient-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-0 -z-10 overflow-hidden', 'aria-hidden': 'true' },
  template: `
    <div class="lnd-dots absolute inset-0"></div>
    <span class="lnd-orb lnd-orb--1"></span>
    <span class="lnd-orb lnd-orb--2"></span>
    <span class="lnd-orb lnd-orb--3"></span>
    <span #glow class="lnd-glow"></span>
    <div class="lnd-noise absolute inset-0"></div>
  `,
})
export class AmbientBackground {
  private readonly glow = viewChild.required<ElementRef<HTMLElement>>('glow');

  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!finePointer || reducedMotion) return;

      const glow = this.glow().nativeElement;
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 3;
      let x = targetX;
      let y = targetY;
      let frame = 0;

      const tick = () => {
        // Inercia: el brillo "persigue" al puntero.
        x += (targetX - x) * 0.08;
        y += (targetY - y) * 0.08;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(tick) : 0;
      };

      const onMove = (event: PointerEvent) => {
        targetX = event.clientX;
        targetY = event.clientY;
        glow.classList.add('is-active');
        if (!frame) frame = requestAnimationFrame(tick);

        // Spotlight en la tarjeta bajo el puntero.
        const card = (event.target as Element | null)?.closest?.('.lnd-card') as HTMLElement | null;
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
          card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
        }
      };
      const onLeave = () => glow.classList.remove('is-active');

      zone.runOutsideAngular(() => {
        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
      });
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        cancelAnimationFrame(frame);
      });
    });
  }
}
