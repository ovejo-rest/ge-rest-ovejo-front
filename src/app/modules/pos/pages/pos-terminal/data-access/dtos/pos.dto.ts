export type CheckStaffPinDto = Readonly<{
  // El backend identifica al mesero por su code (UUID).
  userId: string;
  serviceStaffPin: string;
}>;

export type CheckStaffPinResponseDto = Readonly<{ valid: boolean }>;

export type PosWaiter = Readonly<{ code: string; name: string }>;
