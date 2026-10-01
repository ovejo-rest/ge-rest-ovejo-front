import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TwoStepsComponent } from './pages/two-steps/two-steps.component';
import { TemporaryPasswordComponent } from './pages/temporary-password/temporary-password.component';
import { VerifyEmailComponent } from './pages/verify-email';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent, data: { returnUrl: window.location.pathname } },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'verify-email', component: VerifyEmailComponent },
      // El flujo antiguo de 2 pasos quedó en una sola pantalla.
      { path: 'new-password', redirectTo: 'temporary-password', pathMatch: 'full' },
      { path: 'two-steps', component: TwoStepsComponent },
      { path: 'temporary-password', component: TemporaryPasswordComponent },
      { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
];

export default routes;
