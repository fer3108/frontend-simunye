import { z } from "zod/v4";

export const newPermissionSchema = z.object({
  name: z.string().min(1, { message: "Nombre de Permiso es requerido" }),
  description: z.string().min(1, { message: "Descripción es requerida" }),
});
