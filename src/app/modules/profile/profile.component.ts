import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeaderDashboardComponent } from 'src/ui';
import {
  ContactProfileCardComponent,
  PersonalInformationProfileCardComponent,
  TarjetProfileCardComponent,
} from './components';
import { GetProfileService } from './data-access';
import { AvatarService } from 'src/app/core/services/avatar.service';
import {
  ContactProfileCardSkeletonComponent,
  PersonalInformationProfileCardSkeletonComponent,
  TarjetProfileCardSkeletonComponent,
} from './ui';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderDashboardComponent,
    TarjetProfileCardComponent,
    PersonalInformationProfileCardComponent,
    ContactProfileCardComponent,
    TarjetProfileCardSkeletonComponent,
    ContactProfileCardSkeletonComponent,
    PersonalInformationProfileCardSkeletonComponent,
  ],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  protected readonly $getProfileService = inject(GetProfileService);
  protected readonly $avatarService = inject(AvatarService);

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.code) {
      this.$getProfileService.loadProfile(userData.code);
    }
  }

  get fullName(): string {
    const profile = this.$getProfileService.$profile();
    if (!profile) return '';
    return `${profile.name} ${profile.fatherLastName} ${profile.motherLastName}`;
  }

  getAvatarUrl(): string {
    const profile = this.$getProfileService.$profile();

    if (profile?.profilePhotoPath) {
      return profile.profilePhotoPath;
    }
    return this.$avatarService.getAvatarUrl(`${profile?.name} ${profile?.fatherLastName}`);
  }
}
