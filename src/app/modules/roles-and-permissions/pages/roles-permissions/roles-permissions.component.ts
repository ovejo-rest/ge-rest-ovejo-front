import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent, HeaderDashboardComponent, IconComponent, ToastService } from 'src/ui';
import { GetAllPermissionsService } from '../permissions/data-access';
import { GetRolePermissionsService, AssignPermissionsService } from './data-access';
import { RoleSelectorComponent } from './ui';
import { RolesPermissionsCardComponent } from './features';
import { WhoamiService } from 'src/app/core/services/whoami/whoami.service';
import { CheckPermissionDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-roles-permissions',
  imports: [
    HeaderDashboardComponent,
    ButtonComponent,
    IconComponent,
    RoleSelectorComponent,
    RolesPermissionsCardComponent,
    CheckPermissionDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './roles-permissions.component.html',
})
export class RolesPermissionsComponent {
  protected readonly $allPermissionsService = inject(GetAllPermissionsService);
  protected readonly $rolePermissionsService = inject(GetRolePermissionsService);
  private readonly assignService = inject(AssignPermissionsService);
  private readonly $toast = inject(ToastService);
  private readonly whoamiService = inject(WhoamiService);

  selectedRoleId = signal<number | null>(null);
  pendingPermissionIds = signal<Set<number>>(new Set());
  private rolePermissionsFetched = signal(false);
  private lastSavedRoleId = signal<number | null>(null);

  readonly $modules = this.$allPermissionsService.$filteredModules;
  readonly $permissionsLoading = computed(
    () => this.$allPermissionsService.$isLoading() || this.$rolePermissionsService.$isLoading(),
  );

  readonly $total = computed(() => {
    const modules = this.$modules();
    return modules.reduce((acc, m) => acc + m.permissions.length, 0);
  });

  readonly hasPendingChanges = computed(() => {
    const roleId = this.selectedRoleId();
    if (!roleId) return false;
    const serverIds = this.$rolePermissionsService.$rolePermissionIds();
    const pending = this.pendingPermissionIds();
    if (serverIds.size !== pending.size) return true;
    for (const id of serverIds) {
      if (!pending.has(id)) return true;
    }
    return false;
  });

  readonly $saving = this.assignService.$isLoading;

  constructor() {
    effect(() => {
      if (this.assignService.$isLoading()) {
        this.$toast.show('Guardando permisos...', 'warning');
      }
    });

    effect(() => {
      if (this.assignService.$success() && this.lastSavedRoleId() !== null) {
        this.lastSavedRoleId.set(null);
        this.$toast.show('Permisos actualizados exitosamente', 'success');
        this.whoamiService.refetch();
        this.retry();
      }
    });

    effect(() => {
      if (this.assignService.$hasError()) {
        this.$toast.show('Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });

    effect(() => {
      const roleId = this.selectedRoleId();
      const ids = this.$rolePermissionsService.$rolePermissionIds();
      const isLoading = this.$rolePermissionsService.$isLoading();

      if (roleId && !this.rolePermissionsFetched() && !isLoading) {
        this.pendingPermissionIds.set(new Set(ids));
        this.rolePermissionsFetched.set(true);
      }
    });
  }

  onRoleSelected(roleId: number) {
    this.selectedRoleId.set(roleId);
    this.pendingPermissionIds.set(new Set());
    this.rolePermissionsFetched.set(false);
    this.$rolePermissionsService.setRoleId(roleId);
  }

  onTogglePermission(event: { permissionId: number; assigned: boolean }) {
    this.pendingPermissionIds.update((pending) => {
      const next = new Set(pending);
      if (event.assigned) {
        next.add(event.permissionId);
      } else {
        next.delete(event.permissionId);
      }
      return next;
    });
  }

  savePermissions() {
    const roleId = this.selectedRoleId();
    if (!roleId) return;

    this.lastSavedRoleId.set(roleId);
    this.assignService.execute(roleId, [...this.pendingPermissionIds()]);
  }

  retry() {
    this.$allPermissionsService.retry();
    const roleId = this.selectedRoleId();
    if (roleId) {
      this.pendingPermissionIds.set(new Set());
      this.rolePermissionsFetched.set(false);
      this.$rolePermissionsService.setRoleId(roleId);
    }
  }
}
