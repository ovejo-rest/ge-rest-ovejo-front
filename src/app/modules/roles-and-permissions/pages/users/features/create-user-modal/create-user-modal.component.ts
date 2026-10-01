import { Component, computed, effect, inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { CreateUserService, GetAllUsersService, UserBranchService } from '../../data-access';
import { rutValidator } from 'src/app/shared/validators';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';
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
  // Solo roles de personal: SUPERADMIN y OWNER no se pueden asignar (el backend los rechaza).
  protected readonly $staffRoles = computed(() =>
    (this.allRoles()?.data ?? []).filter((role) => !['SUPERADMIN', 'OWNER'].includes(role.code)),
  );
  protected readonly $loadingRoles = this.$allRolesService.$isLoading;
  private readonly branchService = inject(UserBranchService);
  protected readonly $locations = inject(GetAllBusinessLocationsService).$locations;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    rut: ['', [rutValidator]],
    name: ['', [Validators.required]],
    fatherLastName: ['', [Validators.required]],
    motherLastName: [''],
    email: ['', [Validators.required, Validators.email]],
    roleIds: [[] as number[]],
    branchId: [null as number | null],
  });

  constructor() {
    this.$createUserService.reset();
    this.$allRolesService.setParams({ perPage: 50 });

    effect(() => {
      if (this.$createUserService.$success()) {
        this.afterCreated();
      }
      const status = this.$createUserService.$error();
      if (status) {
        const messages: Record<number, string> = {
          409: 'Ese email o RUT ya está registrado.',
          403: 'No puedes asignar alguno de esos roles.',
          404: 'Alguno de los roles ya no existe.',
        };
        this.$toast.show(messages[status] ?? 'No se pudo enviar la invitación. Intenta nuevamente.', 'error');
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

  // La creación no acepta sucursal: se asigna justo después (ver UserBranchService).
  private afterCreated() {
    const name = this.form.get('name')?.value;
    const email = this.form.get('email')?.value ?? '';
    const branchId = this.form.get('branchId')?.value;
    const finish = (message: string, tone: 'success' | 'warning') => {
      this.$toast.show(message, tone);
      this.$getAllUsersService.retry();
      this.dialogRef.close();
    };
    if (!branchId) {
      finish(`Usuario '${name}' creado con éxito`, 'success');
      return;
    }
    this.branchService.setBranchIdByEmail(email, branchId).subscribe({
      next: () => finish(`Usuario '${name}' creado y asignado a su sucursal`, 'success'),
      error: () => finish(`Usuario '${name}' creado, pero no se pudo asignar la sucursal. Asígnala al editarlo.`, 'warning'),
    });
  }

  ngOnDestroy(): void {
    this.$createUserService.reset();
  }
}
