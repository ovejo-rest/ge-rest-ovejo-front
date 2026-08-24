import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { TableDto, UpdateTableService, GetAllTablesService, TableStatus } from '../../data-access';
import { GetAllSectorsService } from 'src/app/modules/sectors/pages/sector-list/data-access';

@Component({
  selector: 'app-update-table-modal',
  imports: [
    FormsModule,
    IconComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    SlotDirective,
    ModalCardComponent,
  ],
  templateUrl: './update-table-modal.component.html',
})
export class UpdateTableModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<TableDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(UpdateTableService);
  protected readonly $getAll = inject(GetAllTablesService);
  protected readonly $sectorsService = inject(GetAllSectorsService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;
  protected readonly $sectors = this.$sectorsService.$sectors;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: [this.data.name, Validators.required],
    capacity: [this.data.capacity, [Validators.required, Validators.min(1)]],
    sectorId: [this.data.sectorId, Validators.required],
    status: [this.data.status as TableStatus],
  });

  readonly statusOptions: { value: TableStatus; label: string }[] = [
    { value: 'available', label: 'Disponible' },
    { value: 'occupied', label: 'Ocupada' },
    { value: 'reserved', label: 'Reservada' },
    { value: 'blocked', label: 'Bloqueada' },
  ];

  constructor() {
    this.$sectorsService.setParams({ perPage: 100 });
    effect(() => {
      if (this.$service.$success()) {
        this.$toast.show('Mesa actualizada', 'success');
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
    const { name, capacity, sectorId, status } = this.form.getRawValue();
    this.$service.update(this.data.id, {
      name: name ?? undefined,
      capacity: capacity ?? undefined,
      sectorId: sectorId ?? undefined,
      status: status ?? undefined,
    });
  }

  ngOnDestroy(): void {
    this.$service.reset();
  }
}
