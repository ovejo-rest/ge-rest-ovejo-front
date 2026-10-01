// Respuesta común de los logins (email/contraseña, verificación de email y Google).
export type SessionUserDataDto = Readonly<{
  code: string;
  rut: string | null;
  name: string;
  fatherLastName: string;
  motherLastName: string | null;
  email: string;
  status: string;
  restaurantId: number | null;
}>;

export type SessionDto = Readonly<{
  token: string;
  refreshToken: string;
  userData: SessionUserDataDto;
}>;

// Google además indica si la cuenta se creó en este inicio de sesión (va al onboarding).
export type GoogleSessionDto = SessionDto & Readonly<{ isNewUser: boolean }>;

export type RegisterOwnerDto = Readonly<{
  name: string;
  fatherLastName: string;
  motherLastName?: string;
  email: string;
  password: string;
  rut?: string;
}>;

export type RegisterOwnerResponseDto = Readonly<{ email: string; message: string }>;
