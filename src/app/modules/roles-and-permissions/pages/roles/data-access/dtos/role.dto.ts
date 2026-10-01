export type RoleDto = Readonly<{
  id: number;
  code: string;
  name: string;
  /** Rol predeterminado compartido por todos los restaurantes: solo lectura. */
  isGlobal?: boolean;
  createdAt?: string;
}>;
