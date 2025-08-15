import type { PermissionEntity } from "./PermissionEntity";

export interface RoleEntity {
  id?: string;
  name: string;
  description: string;
  enabled: boolean;
  permissionList: PermissionEntity[];
}
