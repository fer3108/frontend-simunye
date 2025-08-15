import { z } from "zod/v4";

export const newUserSchema = z.object({
  username: z.string().min(1, {
    error: "Nombre de Usuario Necesario",
  }),
  email: z.email({ error: "Email no valido" }),
  password: z
    .string({ error: "Contraseña debe tener al menos 8 caracteres" })
    .min(8, { error: "Contraseña debe tener al menos 8 caracteres" }),
  roles: z.array(z.string().min(1, { error: "select rol" })),
});
