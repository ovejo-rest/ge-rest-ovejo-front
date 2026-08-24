import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateSectorService, GetAllSectorsService } from '../../data-access';

@Component({
  selector: 'app-create-sector-modal',
  imports: [FormsModule, IconComponent, ReactiveFormsModule, CommonModule, ButtonComponent, SlotDirective, ModalCardComponent],
  templateUrl: './create-sector-modal.component.html',
})
export class CreateSectorModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $service = inject(CreateSectorService);
  protected readonly $getAll = inject(GetAllSectorsService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    color: ['#6E56CF'],
  });

  constructor() {
    effect(() => {
      if (this.$service.$success()) { this.$toast.show('Sector creado', 'success'); this.$getAll.retry(); this.dialogRef.close(); }
      if (this.$service.$hasError()) { this.$toast.show('Error al crear el sector', 'error'); }
    });
  }

  submitForm() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, description, color } = this.form.getRawValue();
    this.$service.create({ name: name ?? '', description: description ?? undefined, color: color ?? undefined });
  }

  ngOnDestroy(): void { this.$service.reset(); }
}
