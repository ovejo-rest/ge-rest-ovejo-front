import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './pages';
import { authGuard } from 'src/app/core';

const routes: Routes = [
  { path: '', component: OrderListComponent, canActivate: [authGuard], canActivateChild: [authGuard] },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class OrdersRoutingModule {}
