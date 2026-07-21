import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, output, signal } from '@angular/core';
import { ModulePermissionsDto } from '../../../permissions/data-access';
import { CardComponent } from 'src/ui/templates/single-card';
import { SlotDirective, IconComponent, ToggleComponent } from 'src/ui';
import { PermissionsListSkeletonComponent } from '../../ui';
import { CheckPermissionDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-roles-permissions-card',
  imports: [
    CardComponent,
    SlotDirective,
    IconComponent,
    ToggleComponent,
    PermissionsListSkeletonComponent,
    CheckPermissionDirective,
  ],
  templateUrl: './roles-permissions-card.component.html',
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ opacity: 0, height: '0px', overflow: 'hidden' }),
        animate('200ms ease-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate('200ms ease-in', style({ opacity: 0, height: '0px' })),
      ]),
    ]),
  ],
})
export class RolesPermissionsCardComponent {
  readonly $modules = input.required<ModulePermissionsDto[]>({ alias: 'modules' });
  readonly rolePermissionIds = input.required<Set<number>>({ alias: 'rolePermissionIds' });
  readonly isLoading = input<boolean | undefined>(false, { alias: 'isLoading' });
  readonly selectedRoleId = input<number | null>(null, { alias: 'selectedRoleId' });

  readonly togglePermission = output<{ permissionId: number; assigned: boolean }>();

  readonly expandedModuleIds = signal<Set<number>>(new Set());

  readonly $allExpanded = computed(() => this.expandedModuleIds().size === this.$modules().length);

  toggleAll(expanded: boolean) {
    if (expanded) {
      this.expandedModuleIds.set(new Set(this.$modules().map((m) => m.moduleId)));
    } else {
      this.expandedModuleIds.set(new Set());
    }
  }

  toggleModule(moduleId: number) {
    this.expandedModuleIds.update((set) => {
      const next = new Set(set);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  onToggle(permissionId: number, assigned: boolean) {
    this.togglePermission.emit({ permissionId, assigned });
  }
}
