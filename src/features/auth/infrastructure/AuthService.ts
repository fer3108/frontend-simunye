import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";

export class AuthService {
  private tokenStorage: TokenStorageRepositoryImp;

  constructor() {
    this.tokenStorage = new TokenStorageRepositoryImp();
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns boolean - true si está autenticado, false si no
   */
  isAuthenticated(): boolean {
    const token = this.tokenStorage.getToken("token");
    return !!token; // Convierte a booleano
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.tokenStorage.removeToken("token");
    // Redirigir al login se maneja en el componente que llama a este método
  }

  /**
   * Obtiene el token actual
   * @returns string | null - El token o null si no existe
   */
  getToken(): string | null {
    return this.tokenStorage.getToken("token");
  }
}