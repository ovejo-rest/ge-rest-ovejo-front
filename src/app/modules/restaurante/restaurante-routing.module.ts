import { RouterModule, Routes } from '@angular/router';
import { RestauranteComponent } from './restaurante.component';
import { authGuard } from 'src/app/core';
import { NgModule } from '@angular/core';
import { BusinessComponent } from './pages';
import { BusinessLocationComponent } from './pages/business-location/business-location.component';

const routes: Routes = [
  {
    path: '',
    component: RestauranteComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: BusinessComponent,
        pathMatch: 'full',
      },
      {
        path: 'location',
        component: BusinessLocationComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestauranteRoutingModule {}
