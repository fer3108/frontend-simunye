import { z } from "zod/v4";

export const newRoleSchema = z.object({
  name: z.string().min(1, { message: "Nombre de Rol es requerido" }),
  description: z.string().min(1, { message: "Descripción es requerida" }),
  permissionList: z
    .array(
      z.string().min(1, { message: "Debe seleccionar al menos un permiso" })
    )
    .nonempty({ message: "Debe seleccionar al menos un permiso" }),
});
