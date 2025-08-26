import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import type { Credentials } from "../domain/entities/CredentialsEntitys";
import type { AuthRepository } from "../domain/repositories/AuthRepository";

export class AuthRespositoryImp implements AuthRepository {
  public async login(
    credentials: Credentials
  ): Promise<ApiResponseEntity<{ token: string }>> {
    try {
      const url = import.meta.env.VITE_API_URL_V1;
      const response = await fetch(`${url}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok && response.status !== 401) {
        return { status: "fail", message: "Error Inesperado" };
      }

      if (!response.ok && response.status === 401) {
        return {
          status: "fail",
          message: "Usuario y/o Contraseña Incorrectos",
        };
      }
      
      const token = response.headers.get("authorization");
      if (!token) return { status: "fail", message: "token" };
      
      return { status: "success", message: "Autorizado", data: { token } };
    } catch (error) {
      console.log(error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  logout(): void {}
}
