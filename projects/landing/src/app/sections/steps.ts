import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lnd-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="como-funciona" class="lnd-band" aria-labelledby="steps-title">
      <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-primary text-sm font-semibold uppercase tracking-wider">Cómo funciona</p>
          <h2 id="steps-title" class="mt-2 text-3xl font-semibold sm:text-4xl">Listo para tomar pedidos en minutos</h2>
        </div>

        <ol class="mt-14 grid gap-6 md:grid-cols-3">
          @for (step of steps; track step.title; let i = $index) {
          <li class="lnd-card rounded-2xl p-6">
            <span class="bg-primary flex size-10 items-center justify-center rounded-full font-semibold text-white">{{ i + 1 }}</span>
            <h3 class="mt-4 text-lg font-semibold">{{ step.title }}</h3>
            <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ step.text }}</p>
          </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class Steps {
  protected readonly steps = [
    { title: 'Crea tu cuenta', text: 'Regístrate con tu email o con Google y verifica tu correo.' },
    { title: 'Configura tu negocio', text: 'Crea tu restaurante, carga la carta, arma el salón con sus mesas e invita a tu equipo.' },
    { title: 'Empieza a vender', text: 'Toma pedidos desde el POS: la cocina los recibe al instante y tú ves las ventas en el resumen.' },
  ];
}
