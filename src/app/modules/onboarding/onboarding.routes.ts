import { Routes } from '@angular/router';
import { onboardingGuard } from 'src/app/core';
import { CreateBusinessComponent } from './pages';

// Fuera del layout: sin negocio, casi toda la API responde 403.
const routes: Routes = [{ path: '', canActivate: [onboardingGuard], component: CreateBusinessComponent }];

export default routes;
