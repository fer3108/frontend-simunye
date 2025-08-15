export interface EditRoleEntity {
  id?: string;
  name: string;
  description: string;
  enabled: boolean;
  permissionList: string[];
}
