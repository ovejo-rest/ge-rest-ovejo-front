import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core';
import { PrinterListComponent, PrintStationComponent, SchedulesComponent, StationListComponent, TerminalSetupComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'stations', pathMatch: 'full' },
      { path: 'stations', component: StationListComponent },
      { path: 'printers', component: PrinterListComponent },
      { path: 'print-station', component: PrintStationComponent },
      { path: 'schedules', component: SchedulesComponent },
      { path: 'terminal', component: TerminalSetupComponent },
    ],
  },
];

export default routes;
