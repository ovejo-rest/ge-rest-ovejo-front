import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { GetAllRolesService } from '../../../roles/data-access';

@Component({
  selector: 'app-role-selector',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './role-selector.component.html',
})
export class RoleSelectorComponent {
  protected readonly $rolesService = inject(GetAllRolesService);

  readonly isLoading = this.$rolesService.$isLoading;

  selectedRoleChange = output<number>();

  // El servicio es compartido con la tabla de roles (paginada): aquí se listan todos sin filtros.
  constructor() {
    this.$rolesService.setParams({ page: 1, perPage: 50, searchCode: '', searchName: '' });
  }

  onRoleChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    if (value) {
      this.selectedRoleChange.emit(value);
    }
  }
}
