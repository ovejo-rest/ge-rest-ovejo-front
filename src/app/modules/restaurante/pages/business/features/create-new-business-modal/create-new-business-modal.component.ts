import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateBusinessService, FindAllCurrenciesService, FindMyBusinessesService } from '../../data-access';

@Component({
  selector: 'app-create-new-business-modal',
  imports: [
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
  ],
  templateUrl: './create-new-business-modal.component.html',
})
export class CreateNewBusinessModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $createBusinessService = inject(CreateBusinessService);
  private readonly $toast = inject(ToastService);
  protected readonly $findMyBusinessesService = inject(FindMyBusinessesService);
  protected readonly $findAllCurrenciesService = inject(FindAllCurrenciesService);

  protected readonly $isLoading = this.$createBusinessService.$isLoading;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required]],
    currencyId: [null as number | null, [Validators.required]],
    timeZone: ['America/Santiago'],
    dateFormat: ['m/d/Y'],
    timeFormat: ['24'],
  });

  constructor() {
    this.$findAllCurrenciesService.retry();

    effect(() => {
      if (this.$createBusinessService.$isLoading()) {
        this.$toast.show(`Creando negocio...`, 'warning');
      }
      if (this.$createBusinessService.$success()) {
        this.$toast.show(`Negocio '${this.form.get('name')?.value}' creado con éxito`, 'success');
        this.$findMyBusinessesService.retry();
        this.dialogRef.close();
      }
      if (this.$createBusinessService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, currencyId, timeZone, dateFormat, timeFormat } = this.form.getRawValue();

    this.$createBusinessService.create({
      name: name ?? '',
      currencyId: currencyId ?? 0,
      timeZone: timeZone ?? undefined,
      dateFormat: dateFormat ?? undefined,
      timeFormat: timeFormat ?? undefined,
    });
  }

  ngOnDestroy(): void {
    this.$createBusinessService.reset();
  }
}
