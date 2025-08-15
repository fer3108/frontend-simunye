export interface EditRoleDTO {
  idRole?: string;
  name: string;
  description: string;
  enabled?: boolean;
  permissionList: String[];
}
