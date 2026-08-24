import { Routes } from '@angular/router';
import { UimComponent } from './uim.component';
import { TablePage } from './pages/table/table.page';

const routes: Routes = [
  {
    path: '',
    component: UimComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: TablePage },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

export default routes;
