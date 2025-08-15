import { z } from "zod/v4";

export const editRoleSchema = z.object({
  name: z.string().min(1, { message: "Nombre de Rol es requerido" }),
  description: z.string().min(1, { message: "Descripción es requerida" }),
  enabled: z.boolean(),
  permissionList: z
    .array(
      z.string().min(2, { message: "Debe seleccionar al menos un permiso" })
    )
    .nonempty({ message: "Debe seleccionar al menos un permiso" }),
});
