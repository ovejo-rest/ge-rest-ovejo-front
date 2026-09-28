import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, HeaderDashboardComponent, IconComponent, ToastService } from 'src/ui';
import { TerminalModeService } from 'src/app/core/services/terminal-mode';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';

const INACTIVITY_OPTIONS = [
  { value: 30, label: '30 segundos' },
  { value: 60, label: '1 minuto' },
  { value: 120, label: '2 minutos' },
  { value: 300, label: '5 minutos' },
];

@Component({
  selector: 'app-terminal-setup',
  standalone: true,
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent],
  templateUrl: './terminal-setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalSetupComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly terminalMode = inject(TerminalModeService);
  private readonly $branchId = inject(WhoamiService).$branchId;
  private readonly locationsService = inject(GetAllBusinessLocationsService);

  readonly $locations = computed(() => this.locationsService.$locations() ?? []);
  readonly inactivityOptions = INACTIVITY_OPTIONS;
  readonly $locationId = signal<number | null>(this.terminalMode.$config().locationId);
  readonly $inactivity = signal(this.terminalMode.$config().inactivitySeconds);

  constructor() {
    // Por defecto, la sucursal del usuario (o la única que exista).
    effect(() => {
      const locations = this.$locations();
      if (this.$locationId() !== null || !locations.length) return;
      const branch = locations.find((location) => location.id === this.$branchId());
      if (branch || locations.length === 1) this.$locationId.set((branch ?? locations[0]).id);
    });
  }

  selectLocation(event: Event) {
    this.$locationId.set(Number((event.target as HTMLSelectElement).value) || null);
  }

  selectInactivity(event: Event) {
    this.$inactivity.set(Number((event.target as HTMLSelectElement).value));
  }

  activate() {
    const location = this.$locations().find((item) => item.id === this.$locationId());
    if (!location) {
      this.toast.show('Elige la sucursal de esta terminal', 'warning');
      return;
    }
    this.terminalMode.enable({ locationId: location.id, locationName: location.name, inactivitySeconds: this.$inactivity() });
    this.router.navigate(['/terminal']);
  }
}
