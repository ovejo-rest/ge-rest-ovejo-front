import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { TableDto, UpdateTableService, GetAllTablesService, TableStatus, getTableErrorMessage } from '../../data-access';
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
    description: [this.data.description || ''],
    capacity: [this.data.capacity, [Validators.required, Validators.min(1)]],
    sectorId: [this.data.sectorId],
    status: [{ value: this.data.status as TableStatus, disabled: this.data.status === 'occupied' }],
  });

  // "Ocupada" y "Disponible" cambian solas con los pedidos; a mano solo se reserva o bloquea.
  readonly isOccupied = this.data.status === 'occupied';
  readonly statusOptions: { value: TableStatus; label: string }[] = this.isOccupied
    ? [{ value: 'occupied', label: 'Ocupada (tiene un pedido abierto)' }]
    : [
        { value: 'available', label: 'Disponible' },
        { value: 'reserved', label: 'Reservada' },
        { value: 'blocked', label: 'Bloqueada' },
      ];

  constructor() {
    effect(() => {
      if (this.$service.$success()) {
        this.$toast.show('Mesa actualizada', 'success');
        this.$getAll.retry();
        this.dialogRef.close();
      }
    });

    // 409 TABLE_HAS_OPEN_ORDER / TABLE_STATUS_AUTOMATIC: el estado lo manejan los pedidos.
    effect(() => {
      const error = this.$service.$error();
      if (error) {
        this.$toast.show(getTableErrorMessage(error), 'error');
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, description, capacity, sectorId, status } = this.form.getRawValue();
    this.$service.update({
      id: this.data.id,
      name: name ?? undefined,
      description: description || undefined,
      capacity: capacity ?? undefined,
      sectorId: sectorId ?? undefined,
      status: status && status !== this.data.status ? status : undefined,
    });
  }

  ngOnDestroy(): void {
    this.$service.reset();
  }
}
