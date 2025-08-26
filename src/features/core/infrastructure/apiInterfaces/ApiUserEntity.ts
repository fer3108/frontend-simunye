import type { ApiUserRoleEntity } from "./ApiUserRoleEntity";

export interface ApiUserEntity {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  password?: string;
  createdAt: string;
  updatedAt: string;
  userRoles: ApiUserRoleEntity[];
  userPermissions: any[]; //revisar ojo
}
