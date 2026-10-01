import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent, ButtonComponent, ToastService } from 'src/ui';
import { emailFormatValidator } from '../custom-validators';
import { AuthService, getAuthError } from '../data-access';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, RouterLink, ButtonComponent, ReactiveFormsModule, AlertComponent],
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  submitted = false;
  readonly $isLoading = signal(false);

  form = inject(FormBuilder).group(
    {
      email: [inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '', [Validators.required]],
    },
    {
      validators: [emailFormatValidator('email')],
    },
  );

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.get('email')!.value!.trim().toLowerCase();
    this.$isLoading.set(true);
    // El backend siempre responde 200 (no revela si el email existe).
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.$isLoading.set(false);
        this.toast.show('Si el email está registrado, te enviamos un código temporal', 'success');
        this.router.navigate(['/auth/temporary-password'], { queryParams: { email } });
      },
      error: (error) => {
        this.$isLoading.set(false);
        this.toast.show(getAuthError(error).message, 'error');
      },
    });
  }
}
