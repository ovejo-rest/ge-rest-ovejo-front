import { Component, Inject, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent, ButtonComponent, ToastService } from 'src/ui';
import { emailFormatValidator } from '../custom-validators';
import { catchError, of, tap } from 'rxjs';
import { ForgotPasswordService } from '../data-access';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, RouterLink, ButtonComponent, ReactiveFormsModule, AlertComponent],
})
export class ForgotPasswordComponent {
  readonly #httpService = inject(ForgotPasswordService);
  private readonly $toast = inject(ToastService);

  submitted = false;
  constructor(private route: Router) {}

  private $fb = inject(FormBuilder);

  readonly $isLoading = this.#httpService.$isLoading;

  form = this.$fb.group(
    {
      email: ['', [Validators.required]],
    },
    {
      validators: [emailFormatValidator('email')],
    },
  );

  submitForm() {
    this.submitted = true;

    const email = this.form.get('email')!.value!;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.#httpService
      .deactivate({
        email: email,
      })
      .pipe(
        tap((result: { code: number; message: string }) => {
          if (result.code === 200) {
            this.route.navigateByUrl('/auth/temporary-password');
            this.$toast.show(`Se ha creado un contraseña temporal`, 'success');
          }
        }),
        catchError((error) => {
          if (error.status === 409) {
            this.$toast.show(`Email inválido`, 'error');
          }

          return of(null);
        }),
      )
      .subscribe();
  }
}
