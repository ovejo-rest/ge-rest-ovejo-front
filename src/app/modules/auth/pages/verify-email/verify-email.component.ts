import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, viewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { AlertComponent, ButtonComponent, ToastService } from 'src/ui';
import { AuthError, AuthService, getAuthError, PostLoginService } from '../data-access';

const CODE_LENGTH = 6;
// El backend ignora reenvíos antes de 1 minuto.
const RESEND_SECONDS = 60;

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, AlertComponent],
})
export class VerifyEmailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly postLogin = inject(PostLoginService);

  private readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('digit');

  readonly slots = Array.from({ length: CODE_LENGTH }, (_, index) => index);
  readonly email = (this.route.snapshot.queryParamMap.get('email') ?? '').trim().toLowerCase();
  readonly $digits = signal<string[]>(Array(CODE_LENGTH).fill(''));
  readonly $code = computed(() => this.$digits().join(''));
  readonly $isVerifying = signal(false);
  readonly $error = signal<AuthError | null>(null);
  readonly $resendIn = signal(RESEND_SECONDS);

  ngOnInit(): void {
    if (!this.email) {
      this.router.navigateByUrl('/auth/sign-up');
      return;
    }
    // El código recién se envió al registrarse: se espera 1 minuto antes de permitir reenviar.
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.$resendIn.update((seconds) => Math.max(0, seconds - 1)));
    setTimeout(() => this.focus(0));
  }

  onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    if (digits.length > 1) {
      this.fill(digits, index);
      return;
    }
    this.setDigit(index, digits);
    if (digits && index < CODE_LENGTH - 1) this.focus(index + 1);
    this.submitIfComplete();
  }

  onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.$digits()[index] && index > 0) {
      this.setDigit(index - 1, '');
      this.focus(index - 1);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) this.focus(index - 1);
    else if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) this.focus(index + 1);
  }

  // Pegar el código completo desde el correo.
  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text')?.replace(/\D/g, '') ?? '';
    if (!text) return;
    event.preventDefault();
    this.fill(text, 0);
  }

  verify() {
    const code = this.$code();
    if (code.length !== CODE_LENGTH || this.$isVerifying()) return;
    this.$error.set(null);
    this.$isVerifying.set(true);
    this.authService.verifyEmail(this.email, code).subscribe({
      next: (session) => {
        this.$isVerifying.set(false);
        this.toast.show('¡Email verificado!', 'success');
        this.postLogin.continue(session.userData.name);
      },
      error: (error) => {
        this.$isVerifying.set(false);
        this.$error.set(getAuthError(error));
        this.$digits.set(Array(CODE_LENGTH).fill(''));
        this.focus(0);
      },
    });
  }

  resend() {
    if (this.$resendIn() > 0) return;
    this.$resendIn.set(RESEND_SECONDS);
    this.$error.set(null);
    // Siempre responde 200: se avisa igual para no revelar si el email existe.
    this.authService.resendVerificationEmail(this.email).subscribe({ error: () => undefined });
    this.toast.show('Te enviamos un código nuevo', 'success');
  }

  private fill(text: string, from: number) {
    const digits = [...this.$digits()];
    for (let offset = 0; offset < text.length && from + offset < CODE_LENGTH; offset++) digits[from + offset] = text[offset];
    this.$digits.set(digits);
    this.focus(Math.min(from + text.length, CODE_LENGTH - 1));
    this.submitIfComplete();
  }

  private setDigit(index: number, value: string) {
    this.$digits.update((digits) => digits.map((digit, i) => (i === index ? value.slice(-1) : digit)));
  }

  private submitIfComplete() {
    if (this.$code().length === CODE_LENGTH) this.verify();
  }

  private focus(index: number) {
    const input = this.inputs()[index]?.nativeElement;
    input?.focus();
    input?.select();
  }
}
