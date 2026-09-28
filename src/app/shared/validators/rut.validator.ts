import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Valida un RUT chileno (dígito verificador módulo 11). Acepta puntos, guion y K minúscula.
export function isValidRut(value: string): boolean {
  const clean = value.replace(/[.\-\s]/g, '').toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const verifier = clean.slice(-1);
  let sum = 0;
  let factor = 2;
  for (let index = body.length - 1; index >= 0; index--) {
    sum += Number(body[index]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const expected = 11 - (sum % 11);
  const digit = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected);
  return digit === verifier;
}

// Formato 12.345.678-9.
export function formatRut(value: string): string {
  const clean = value.replace(/[.\-\s]/g, '').toUpperCase();
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${clean.slice(-1)}`;
}

// Campo opcional: vacío es válido.
export const rutValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return !value || isValidRut(value) ? null : { rut: true };
};
