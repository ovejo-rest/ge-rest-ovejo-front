import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

type GoogleCredentialResponse = { credential: string };
type GoogleAccountsId = {
  initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void; ux_mode?: 'popup' }) => void;
  renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
};
type GoogleWindow = Window & { google?: { accounts: { id: GoogleAccountsId } } };

const SCRIPT_URL = 'https://accounts.google.com/gsi/client';

/** Google Identity Services: carga el script una vez y dibuja el botón oficial "Continuar con Google". */
@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  readonly clientId = environment.googleClientId ?? '';
  #script: Promise<GoogleAccountsId> | null = null;

  get isConfigured(): boolean {
    return !!this.clientId;
  }

  renderButton(element: HTMLElement, onCredential: (idToken: string) => void, width: number): Promise<void> {
    return this.#load().then((accountsId) => {
      accountsId.initialize({
        client_id: this.clientId,
        callback: (response) => onCredential(response.credential),
        ux_mode: 'popup',
      });
      accountsId.renderButton(element, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'center',
        locale: 'es',
        width: Math.min(Math.max(width, 200), 400),
      });
    });
  }

  #load(): Promise<GoogleAccountsId> {
    const existing = (window as GoogleWindow).google?.accounts?.id;
    if (existing) return Promise.resolve(existing);
    this.#script ??= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const accountsId = (window as GoogleWindow).google?.accounts?.id;
        if (accountsId) resolve(accountsId);
        else reject(new Error('Google Identity Services no disponible'));
      };
      script.onerror = () => {
        this.#script = null;
        reject(new Error('No se pudo cargar Google'));
      };
      document.head.appendChild(script);
    });
    return this.#script;
  }
}
