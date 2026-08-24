import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateTableService, GetAllTablesService } from '../../data-access';
import { GetAllSectorsService } from 'src/app/modules/sectors/pages/sector-list/data-access';

@Component({
  selector: 'app-create-table-modal',
  imports: [FormsModule, IconComponent, ReactiveFormsModule, CommonModule, ButtonComponent, SlotDirective, ModalCardComponent],
  templateUrl: './create-table-modal.component.html',
})
export class CreateTableModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $service = inject(CreateTableService);
  protected readonly $getAll = inject(GetAllTablesService);
  protected readonly $sectorsService = inject(GetAllSectorsService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;
  protected readonly $sectors = this.$sectorsService.$sectors;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    capacity: [4, [Validators.required, Validators.min(1)]],
    sectorId: [null as number | null, Validators.required],
  });

  constructor() {
    this.$sectorsService.setParams({ perPage: 100 });
    effect(() => {
      if (this.$service.$success()) { this.$toast.show('Mesa creada', 'success'); this.$getAll.retry(); this.dialogRef.close(); }
      if (this.$service.$hasError()) { this.$toast.show('Error al crear la mesa', 'error'); }
    });
  }

  submitForm() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, capacity, sectorId } = this.form.getRawValue();
    this.$service.create({ name: name ?? '', capacity: capacity ?? 1, sectorId: sectorId ?? 0 });
  }

  ngOnDestroy(): void { this.$service.reset(); }
}
