import { UserRepositoryImp } from "@/features/users/insfrastructure/repositories/UserRepositoryImp";
import { AuthService } from "./AuthService";

export class TokenValidator {
  private authService: AuthService;
  private userRepo: UserRepositoryImp;

  constructor() {
    this.authService = new AuthService();
    this.userRepo = new UserRepositoryImp();
  }

  /**
   * Verifica si el token es válido haciendo una petición al backend
   * @returns Promise<boolean> - true si el token es válido, false si no
   */
  async validateToken(): Promise<boolean> {
    try {
      // Si no hay token, no es válido
      const token = this.authService.getToken();
      if (!token) return false;

      // Intentar obtener el perfil del usuario para validar el token
      const response = await this.userRepo.getProfile(token);
      
      // Si la respuesta es exitosa, el token es válido
      if (response.status === "success") {
        return true;
      }
      
      // Si hay un error de autorización, el token no es válido
      if (response.status === "fail" && response.message === "No autorizado") {
        this.authService.logout(); // Limpiar el token inválido
        return false;
      }

      // Por defecto, considerar el token como inválido en caso de otros errores
      return false;
    } catch (error) {
      console.error("Error validando token:", error);
      return false;
    }
  }
}