import { Component, computed, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AvatarService } from '../../../../../../core/services/avatar.service';
import { User } from '../../model/user.model';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input({ required: true }) set user(value: User) {
    this.userSignal.set(value);
  }
  get user(): User {
    return this.userSignal();
  }

  private readonly userSignal = signal<User>({} as User);

  protected readonly avatarUrl = computed(() => this.avatarService.getAvatarUrl(this.userSignal().name));

  constructor(private readonly avatarService: AvatarService) {}
}
