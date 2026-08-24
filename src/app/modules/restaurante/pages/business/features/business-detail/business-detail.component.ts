import { Component, effect, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent, CardComponent, IconComponent, SlotDirective, ToastService, ToggleComponent } from 'src/ui';
import { ActivateBusinessService, BusinessDto, FindMyBusinessesService } from '../../data-access';
import { SetupBusinessModalComponent } from '../setup-business-modal';

@Component({
  selector: 'app-business-detail',
  imports: [DatePipe, CardComponent, SlotDirective, ButtonComponent, IconComponent, ToggleComponent],
  templateUrl: './business-detail.component.html',
})
export class BusinessDetailComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly $toast = inject(ToastService);
  protected readonly $activateBusinessService = inject(ActivateBusinessService);
  protected readonly $findMyBusinessesService = inject(FindMyBusinessesService);

  readonly business = input.required<BusinessDto>();

  constructor() {
    effect(() => {
      if (this.$activateBusinessService.$isLoading()) {
        this.$toast.show('Activando negocio...', 'warning');
      }
      if (this.$activateBusinessService.$success()) {
        this.$toast.show('Negocio activado con éxito', 'success');
        this.$findMyBusinessesService.retry();
      }
      if (this.$activateBusinessService.$hasError()) {
        this.$toast.show('Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  onToggleChange(checked: boolean) {
    if (checked) {
      this.$activateBusinessService.execute({ id: this.business().id });
      return;
    }
    this.$toast.show('La desactivación del negocio está en construcción', 'warning');
  }

  openSetupModal() {
    const b = this.business();
    this.dialog.open(SetupBusinessModalComponent, {
      width: '90%',
      maxWidth: '640px',
      data: { businessId: b.id, businessName: b.name },
    });
  }

  navigateToLocations() {
    this.router.navigate(['/business/location']);
  }
}
