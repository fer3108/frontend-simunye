export interface UserEntity {
  id: number;
  username: string;
  email: string;
  password?: string;
  isActive: boolean;
  /* userRoles: object[]; */
  roles: string[];
  permissions: string[];
}
