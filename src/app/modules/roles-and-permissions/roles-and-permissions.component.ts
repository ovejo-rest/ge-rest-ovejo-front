import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet],
})
export class RolesAndPermissionsComponent {}
