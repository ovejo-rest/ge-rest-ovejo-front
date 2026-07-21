import { Component, inject, output } from '@angular/core';
import { GetAllRolesService } from '../../../roles/data-access';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
})
export class RoleSelectorComponent {
  protected readonly $rolesService = inject(GetAllRolesService);

  readonly isLoading = this.$rolesService.$isLoading;

  selectedRoleChange = output<number>();

  onRoleChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    if (value) {
      this.selectedRoleChange.emit(value);
    }
  }
}
