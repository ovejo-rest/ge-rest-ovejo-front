import { NgClass } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AlertComponent, ButtonComponent, IconComponent, ToastComponent, ToastService } from 'src/ui';
import { emailFormatValidator } from '../custom-validators';
import { AuthService } from '../data-access';
import { AccessTokenDto, UserDataDto } from '../dtos';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    RouterLink, 
    AngularSvgIconModule, 
    ButtonComponent, 
    NgClass, 
    IconComponent, 
    AlertComponent,
  ],
})
export class SignInComponent {
  readonly #httpService = inject(AuthService);
  hide = true;
  submitted = false;
  passwordTextType!: boolean;
  errorMessage: string = '';
  readonly $isLoading = this.#httpService.$isLoading;
  
  constructor(
    private readonly _router: Router,
    private readonly toast: ToastService,
    ) {}

  private fb = inject(FormBuilder);

  
  loginForm = this.fb.group(
    { 
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      
    },{
      validators: [
        emailFormatValidator('email'),
      ]
    }
  )

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  loginUser() {

    this.submitted = true;
    const email = this.loginForm.get('email')!.value!;
    const password = this.loginForm.get('password')!.value!;
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }


    this.#httpService
      .login({ email, password })
      .pipe(
        tap(
          (result: {
            token: AccessTokenDto['token'];
            refreshToken: string;
            userData: UserDataDto;
          }) => {
            if (result.token && result.userData) {
              localStorage.setItem('token', result.token);
              localStorage.setItem('refreshToken', result.refreshToken);
              localStorage.setItem('userData', JSON.stringify(result.userData));
              localStorage.setItem('lastActivity', String(Date.now()));
              this._router.navigateByUrl('/dashboard/admin');
              this.toast.show(`Bienvenido ${result.userData.name}!`, 'success');
            }
          }
        ),
        catchError((error) => {
          this.errorMessage = `Error al iniciar sesión ${error}`;
          this.toast.show('Error al iniciar sesión', 'error');
          return of(null);
        })
      )
      .subscribe();
  }

  // protected readonly $hasError = toSignal(this.#httpService.hasError$);
}
