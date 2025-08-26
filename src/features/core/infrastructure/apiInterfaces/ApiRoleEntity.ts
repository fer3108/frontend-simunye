import type { ApiRolePermissionEntity } from "./ApiRolePermissionEntity";

export interface ApiRoleEntity {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  rolePermissions: ApiRolePermissionEntity[];
}
