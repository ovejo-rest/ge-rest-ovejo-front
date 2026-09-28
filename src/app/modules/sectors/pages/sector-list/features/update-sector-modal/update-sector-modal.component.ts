import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { SectorDto, UpdateSectorService, GetAllSectorsService } from '../../data-access';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';

@Component({
  selector: 'app-update-sector-modal',
  imports: [
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
  ],
  templateUrl: './update-sector-modal.component.html',
})
export class UpdateSectorModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<SectorDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(UpdateSectorService);
  protected readonly $getAll = inject(GetAllSectorsService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;
  protected readonly $getAllLocations = inject(GetAllBusinessLocationsService);

  protected readonly $locations = this.$getAllLocations.$locations;
  protected readonly $isLoadingLocations = this.$getAllLocations.$isLoading;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: [this.data.name, Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.$service.$success()) {
        this.$toast.show('Sector actualizado', 'success');
        this.$getAll.retry();
        this.dialogRef.close();
      }
      if (this.$service.$hasError()) {
        this.$toast.show('Error al actualizar', 'error');
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name } = this.form.getRawValue();
    this.$service.update(this.data.id, {
      name: name ?? undefined,
    });
  }

  ngOnDestroy(): void {
    this.$service.reset();
  }
}
