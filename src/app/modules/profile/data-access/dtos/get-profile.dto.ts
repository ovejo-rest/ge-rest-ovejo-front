export type GetProfileDto = Readonly<{
  rut: string | null;
  name: string;
  fatherLastName: string;
  motherLastName: string | null;
  email: string;
  emailVerifyAt?: string | null;
  profilePhotoPath?: string | null;
  profileImageFileId?: string | null;
  // URL firmada (vence en 1 hora): no persistir.
  profileImageUrl?: string | null;
  restaurantId?: string | null;
  branchId?: string | null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  statusCode: string;
  address: string | null;
  phone: string | null;
  cellphone: string | null;
  city: string | null;
  communeName: string | null;
  provinceName: string | null;
  regionOrdinal: string | null;
  regionName: string | null;
  typeUserCode: string;
}>;
