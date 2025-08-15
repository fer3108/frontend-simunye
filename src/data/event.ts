import type { ApiResponse } from "@/shared/dtos/api-response.dto";
import { data } from "./data";
import type {
  User,
  UserRole,
} from "@/features/users/domain/entities/UserEntity";

export default async function addUser(newUser: {
  name_user: string;
  email: string;
  role: UserRole;
  status?: string;
  password?: string;
}): Promise<ApiResponse<User>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = data.find((user) => user.email === newUser.email);

      if (exists) {
        reject({ success: false, message: "El usuario ya existe" });
      } else {
        newUser.status = "pending";
        newUser.password = "";

        data.push({
          ...newUser,
          status: newUser.status ?? "pending",
          password: newUser.password ?? "",
        });
        resolve({
          success: true,
          message: "Usuario Creado Correctamente",
          data: newUser,
        });
      }
    }, 3000);
  });
}
