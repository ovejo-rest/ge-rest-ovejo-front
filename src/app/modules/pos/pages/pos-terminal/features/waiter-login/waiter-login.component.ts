import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { interval } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { IconComponent, ToastService } from 'src/ui';
import { GetServiceStaffService, ServiceStaffDto } from 'src/app/modules/orders/pages/order-list/data-access';
import { CheckStaffPinService, PosWaiter } from '../../data-access';
import { PinPadComponent } from '../../ui';

@Component({
  selector: 'app-waiter-login',
  standalone: true,
  imports: [IconComponent, PinPadComponent, NgTemplateOutlet],
  templateUrl: './waiter-login.component.html',
  styleUrl: './waiter-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaiterLoginComponent {
  private readonly toast = inject(ToastService);
  private readonly pinService = inject(CheckStaffPinService);
  private readonly staffService = inject(GetServiceStaffService);

  // En la terminal de salón no se permite entrar sin identificarse.
  readonly allowAnonymous = input(true);
  // card: dentro del backoffice (/pos) · screen: pantalla completa de la terminal, con el diseño del login.
  readonly variant = input<'card' | 'screen'>('card');
  readonly locationName = input<string | null>(null);
  readonly loggedIn = output<PosWaiter>();
  readonly continueWithoutWaiter = output<void>();

  private readonly pinPad = viewChild(PinPadComponent);

  readonly $staff = this.staffService.$staff;
  readonly $isLoadingStaff = this.staffService.$isLoading;
  readonly $selected = signal<ServiceStaffDto | null>(null);
  readonly $isChecking = signal(false);
  readonly $now = signal(new Date());

  constructor() {
    this.staffService.refresh();
    // Reloj de la pantalla de bloqueo.
    interval(15_000)
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.$now.set(new Date()));
  }

  // Degradado estable por mesero: el mismo nombre siempre tiene el mismo color.
  avatarGradient(member: ServiceStaffDto): string {
    const seed = [...`${member.name}${member.fatherLastName}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const hue = seed % 360;
    return `linear-gradient(135deg, hsl(${hue} 85% 62%), hsl(${(hue + 40) % 360} 80% 48%))`;
  }

  time(date: Date): string {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }

  longDate(date: Date): string {
    const label = date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  refreshStaff() {
    this.staffService.refresh();
  }

  select(member: ServiceStaffDto) {
    if (!member.hasPin) {
      this.toast.show(`${member.name} no tiene PIN asignado. Pídeselo a un administrador.`, 'warning');
      return;
    }
    this.$selected.set(member);
  }

  back() {
    this.$selected.set(null);
  }

  initials(member: ServiceStaffDto): string {
    return `${member.name.charAt(0)}${member.fatherLastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  checkPin(pin: string) {
    const member = this.$selected();
    if (!member) return;
    this.$isChecking.set(true);
    this.pinService.check({ userId: member.code, serviceStaffPin: pin }).subscribe({
      next: ({ valid }) => {
        this.$isChecking.set(false);
        if (valid) {
          this.loggedIn.emit({ code: member.code, name: `${member.name} ${member.fatherLastName ?? ''}`.trim() });
          return;
        }
        this.pinPad()?.fail();
      },
      error: (error: HttpErrorResponse) => {
        this.$isChecking.set(false);
        this.pinPad()?.fail();
        this.toast.show(
          error.status === HttpStatusCode.TooManyRequests
            ? 'Demasiados intentos fallidos. Espera unos minutos.'
            : 'No se pudo validar el PIN',
          'error',
        );
      },
    });
  }
}
