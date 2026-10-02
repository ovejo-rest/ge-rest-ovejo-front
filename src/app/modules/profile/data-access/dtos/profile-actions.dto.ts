export type UpdateUserNameDto = Readonly<{
  name?: string;
  fatherLastName?: string;
  motherLastName?: string;
}>;

export type ChangePasswordDto = Readonly<{
  currentPassword: string;
  newPassword: string;
}>;

export type SetProfileImageResponseDto = Readonly<{ profileImageUrl: string | null }>;
