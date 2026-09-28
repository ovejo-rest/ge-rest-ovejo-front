import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateBusinessLocationService } from '../../data-access';

@Component({
  selector: 'app-create-business-location-modal',
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, SlotDirective, ModalCardComponent],
  templateUrl: './create-business-location-modal.component.html',
  styleUrl: './create-business-location-modal.component.css',
})
export class CreateBusinessLocationModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $service = inject(CreateBusinessLocationService);
  private readonly $toast = inject(ToastService);
  protected readonly $isLoading = this.$service.$isLoading;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    country: ['Chile'],
    state: [''],
    city: [''],
    zipCode: [''],
    address: [''],
    mobile: [''],
    email: ['', Validators.email],
  });

  constructor() {
    effect(() => {
      if (this.$service.$success()) {
        this.$toast.show('Sucursal creada', 'success');
        this.dialogRef.close({ success: true });
      }
      if (this.$service.$hasError()) {
        this.$toast.show('Error al crear la sucursal', 'error');
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, country, state, city, zipCode, address, mobile, email } = this.form.getRawValue();
    this.$service.create({
      name: name ?? '',
      country: country || undefined,
      state: state || undefined,
      city: city || undefined,
      zipCode: zipCode || undefined,
      address: address || undefined,
      mobile: mobile || undefined,
      email: email || undefined,
    });
  }

  ngOnDestroy(): void {
    this.$service.reset();
  }
}
