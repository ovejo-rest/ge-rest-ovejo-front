import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { BusinessLocationDto, UpdateBusinessLocationService } from '../../data-access';

@Component({
  selector: 'app-update-business-location-modal',
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, SlotDirective, ModalCardComponent],
  templateUrl: './update-business-location-modal.component.html',
})
export class UpdateBusinessLocationModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<BusinessLocationDto>(MAT_DIALOG_DATA);
  protected readonly $service = inject(UpdateBusinessLocationService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: [this.data.name, Validators.required],
    country: [this.data.country || ''],
    state: [this.data.state || ''],
    city: [this.data.city || ''],
    zipCode: [this.data.zipCode || ''],
    address: [this.data.landmark || ''],
    mobile: [''],
    email: ['', Validators.email],
    website: [''],
  });

  constructor() {
    effect(() => {
      if (this.$service.$success()) {
        this.$toast.show('Sucursal actualizada', 'success');
        this.dialogRef.close({ success: true });
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
    const { name, country, state, city, zipCode, address, mobile, email, website } = this.form.getRawValue();
    this.$service.update({
      id: this.data.id,
      name: name || undefined,
      country: country || undefined,
      state: state || undefined,
      city: city || undefined,
      zipCode: zipCode || undefined,
      address: address || undefined,
      mobile: mobile || undefined,
      email: email || undefined,
      website: website || undefined,
    });
  }

  ngOnDestroy(): void {
    this.$service.reset();
  }
}
