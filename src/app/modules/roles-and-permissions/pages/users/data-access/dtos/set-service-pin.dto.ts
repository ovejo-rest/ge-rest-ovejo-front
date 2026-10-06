export type SetServicePinDto = Readonly<{
  // code (UUID) del usuario.
  userId: string;
  // PIN de 4 dígitos exactos para el POS.
  pin: string;
}>;
