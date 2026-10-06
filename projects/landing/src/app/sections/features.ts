import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon, IconName } from '../ui/icon';

type Feature = Readonly<{ icon: IconName; title: string; text: string }>;

@Component({
  selector: 'lnd-features',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="funciones" class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28" aria-labelledby="features-title">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-primary text-sm font-semibold uppercase tracking-wider">Funciones</p>
        <h2 id="features-title" class="mt-2 text-3xl font-semibold sm:text-4xl">Todo lo que pasa en tu restaurante, conectado</h2>
        <p class="text-muted-foreground mt-4">Desde que el cliente se sienta hasta que paga: cada pedido llega a la cocina correcta y cada venta queda registrada.</p>
      </div>

      <ul class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (feature of features; track feature.title) {
        <li class="lnd-card rounded-2xl p-6">
          <span class="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl p-2.5"><lnd-icon [name]="feature.icon" class="size-6" /></span>
          <h3 class="mt-4 text-lg font-semibold">{{ feature.title }}</h3>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ feature.text }}</p>
        </li>
        }
      </ul>
    </section>
  `,
})
export class Features {
  protected readonly features: Feature[] = [
    { icon: 'screen', title: 'POS y pedidos', text: 'Toma pedidos por mesa o para llevar, agrega notas por producto ("sin palta") y cobra con varios medios de pago.' },
    { icon: 'table', title: 'Mesas y sectores', text: 'Ve el estado de cada mesa en tiempo real, abre su cuenta con un toque y organiza el salón por sectores.' },
    { icon: 'chef', title: 'Cocina en pantalla', text: 'Cada estación (cocina, bar, parrilla) recibe solo lo suyo, con las notas del cliente, y marca lo que está listo.' },
    { icon: 'printer', title: 'Comandas impresas', text: 'Imprime las comandas en las impresoras de cada estación y prueba la conexión antes del servicio.' },
    { icon: 'calendar', title: 'Reservas', text: 'Agenda reservas por día o semana, asigna mesas según su capacidad y respeta tus horarios de atención.' },
    { icon: 'qr', title: 'Carta digital con QR', text: 'Cada mesa tiene su código QR para que tus clientes vean la carta con fotos y precios actualizados.' },
    { icon: 'chart', title: 'Ventas y reportes', text: 'Revisa ventas por día, por categoría y por medio de pago, y compáralas con el período anterior.' },
    { icon: 'users', title: 'Tu equipo', text: 'Invita a meseros, cocina y caja con su propio rol, y deja que los meseros entren al POS con un PIN.' },
    { icon: 'device', title: 'Sin instalar nada', text: 'Funciona en el navegador del computador, la tablet o el celular. Si tienes varias sucursales, las administras desde la misma cuenta.' },
  ];
}
