import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectorListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: SectorListComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorsRoutingModule {}
