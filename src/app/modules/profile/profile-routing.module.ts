import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { authGuard } from 'src/app/core';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
