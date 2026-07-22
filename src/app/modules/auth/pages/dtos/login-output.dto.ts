export type LoginOutputDto = Readonly<{
  token: AccessTokenDto;
  refreshToken: string;
  userData: UserDataDto;
}>;

export type UserDataDto = Readonly<{
  rut: string;
  code: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  email: string;
  status: string;
}>;

export type AccessTokenDto = Readonly<{
  token: string;
}>;
