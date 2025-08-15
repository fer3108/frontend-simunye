import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Correo Electrónico es obligatorio",
  }),
  password: z
    .string()
    .min(4, { message: "Contraseña debe ser minimo 6 caracteres" }),
});
