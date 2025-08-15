import type { EditRoleDTO } from "../dtos/EditRoleDto";

export default function adapterRoleDtoToApi(original: EditRoleDTO): {} {
  return {
    name: original.name,
    description: original.description,
    permissions: original.permissionList, // Aquí cambiamos el nombre
    enabled: original.enabled,
  };
}
