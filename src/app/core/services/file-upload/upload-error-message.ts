import { HttpErrorResponse } from '@angular/common/http';

export class ImageUploadError extends Error {}

/** S3 respondió 403: URL vencida o firma que no calza. */
export class StorageForbiddenError extends ImageUploadError {}

/** Traduce los errores del flujo de subida (backend y S3) a un mensaje para el usuario. */
export function getUploadErrorMessage(error: unknown): string {
  if (error instanceof ImageUploadError) return error.message;
  if (!(error instanceof HttpErrorResponse)) return 'No se pudo subir la imagen. Inténtalo de nuevo.';

  const raw = error.error?.message;
  const message = String(Array.isArray(raw) ? raw[0] : (raw ?? ''));

  if (error.status === 0) return 'Sin conexión con el servidor. Revisa tu internet.';
  if (/not uploaded to storage/i.test(message)) return 'La imagen no alcanzó a subirse. Inténtalo de nuevo.';
  if (/must be uploaded to the folder/i.test(message)) return 'La imagen no corresponde a este elemento.';
  if (/not confirmed/i.test(message)) return 'La subida de la imagen no se completó. Inténtalo de nuevo.';
  if (error.status === 404 && /file not found/i.test(message)) return 'No se encontró la imagen subida. Elige otra.';
  if (error.status === 400 && /type|size|bytes|mb/i.test(message)) return 'Formato o tamaño de imagen no permitido.';
  if (error.status === 403) return 'No tienes permiso para subir esta imagen.';
  return 'No se pudo subir la imagen. Inténtalo de nuevo.';
}
