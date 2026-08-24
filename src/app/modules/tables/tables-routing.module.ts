import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: TableListComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule {}
