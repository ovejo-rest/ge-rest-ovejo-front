export type SetServicePinDto = Readonly<{
  // code (UUID) del usuario.
  userId: string;
  // PIN de 4 a 6 dígitos para el POS.
  pin: string;
}>;
