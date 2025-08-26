import type { ApiPermissionEntity } from "./ApiPermissionEntity";

export interface ApiRolePermissionEntity {
  id: string;
  assignedAt: string;
  permission: ApiPermissionEntity;
}
