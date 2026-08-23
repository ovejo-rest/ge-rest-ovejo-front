import { Component, effect, inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateUserService, GetAllUsersService } from '../../data-access';
import { GetAllRolesService } from '../../../roles/data-access';

@Component({
  selector: 'app-create-user-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    ButtonComponent,
    IconComponent,
    ModalCardComponent,
    SlotDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './create-user-modal.component.html',
})
export class CreateUserModalComponent implements OnDestroy {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly $createUserService = inject(CreateUserService);
  private readonly $toast = inject(ToastService);
  protected readonly $getAllUsersService = inject(GetAllUsersService);
  protected readonly $allRolesService = inject(GetAllRolesService);

  protected readonly $isLoading = this.$createUserService.$isLoading;
  protected readonly allRoles = this.$allRolesService.$roles;
  protected readonly $loadingRoles = this.$allRolesService.$isLoading;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    rut: ['', [Validators.required]],
    name: ['', [Validators.required]],
    fatherLastName: ['', [Validators.required]],
    motherLastName: [''],
    email: ['', [Validators.required, Validators.email]],
    roleIds: [[] as number[]],
  });

  constructor() {
    this.$createUserService.reset();
    this.$allRolesService.setParams({ perPage: 50 });

    effect(() => {
      if (this.$createUserService.$success()) {
        this.$toast.show(`Usuario '${this.form.get('name')?.value}' creado con éxito`, 'success');
        this.$getAllUsersService.retry();
        this.dialogRef.close();
      }
      if (this.$createUserService.$hasError()) {
        this.$toast.show(`Algo salió mal. Por favor, vuelva a intentar.`, 'error');
      }
    });
  }

  get selectedRoleIds(): number[] {
    return this.form.get('roleIds')?.value ?? [];
  }

  removeRole(roleId: number) {
    this.form.patchValue({ roleIds: this.selectedRoleIds.filter((id) => id !== roleId) });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rut = this.form.get('rut')!.value ?? '';
    const name = this.form.get('name')!.value ?? '';
    const fatherLastName = this.form.get('fatherLastName')!.value ?? '';
    const motherLastName = this.form.get('motherLastName')!.value ?? '';
    const email = this.form.get('email')!.value ?? '';

    this.$createUserService.create({
      rut,
      name,
      fatherLastName,
      motherLastName,
      email,
      roleIds: this.selectedRoleIds.length > 0 ? this.selectedRoleIds : undefined,
    });
  }

  ngOnDestroy(): void {
    this.$createUserService.reset();
  }
}
