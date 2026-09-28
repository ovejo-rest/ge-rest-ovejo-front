import { Component, effect, inject, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { UpdateUserService, GetAllUsersService, UserBranchService, UserDto } from '../../data-access';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';

@Component({
  selector: 'app-update-user-modal',
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './update-user-modal.component.html',
})
export class UpdateUserModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef<UpdateUserModalComponent>);
  protected readonly $updateUserService = inject(UpdateUserService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllUsersService = inject(GetAllUsersService);

  protected readonly $isLoading = this.$updateUserService.$isLoading;
  private readonly branchService = inject(UserBranchService);
  protected readonly $locations = inject(GetAllBusinessLocationsService).$locations;
  // Sucursal actual del usuario (se carga del perfil); null = sin sucursal.
  protected readonly $originalBranchId = signal<number | null>(null);

  protected readonly data = inject(MAT_DIALOG_DATA) as UserDto;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: [''],
    fatherLastName: [''],
    motherLastName: [''],
    email: [''],
    branchId: [null as number | null],
  });

  constructor() {
    this.$updateUserService.reset();

    this.form.patchValue({
      name: this.data.name,
      fatherLastName: this.data.fatherLastName,
      motherLastName: this.data.motherLastName,
      email: this.data.email,
    });

    this.branchService.getBranchId(this.data.code).subscribe({
      next: (branchId) => {
        this.$originalBranchId.set(branchId);
        this.form.patchValue({ branchId });
      },
      error: () => undefined,
    });

    effect(() => {
      if (this.$updateUserService.$success()) {
        this.$toast.show(`Usuario '${this.data.code}' actualizado con éxito`, 'success');
        this.$getAllUsersService.retry();
        this.dialogRef.close();
      }
      if (this.$updateUserService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  get userId(): string {
    return (this.data as any).userId ?? this.data.code;
  }

  submitForm() {
    const body: Record<string, unknown> = {};
    const name = this.form.get('name')!.value;
    if (name) body['name'] = name;
    const fatherLastName = this.form.get('fatherLastName')!.value;
    if (fatherLastName) body['fatherLastName'] = fatherLastName;
    const motherLastName = this.form.get('motherLastName')!.value;
    if (motherLastName) body['motherLastName'] = motherLastName;
    const email = this.form.get('email')!.value;
    if (email) body['email'] = email;
    const branchId = this.form.get('branchId')!.value;
    if (branchId && branchId !== this.$originalBranchId()) body['branchId'] = branchId;
    this.$updateUserService.update({ userId: this.data.code, ...(body as any) });
  }

  ngOnDestroy(): void {
    this.$updateUserService.reset();
  }
}
