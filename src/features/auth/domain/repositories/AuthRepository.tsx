import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import type { Credentials } from "../entities/CredentialsEntitys";

export interface AuthRepository {
  login(
    credentials: Credentials
  ): Promise<ApiResponseEntity<{ token: string }>>;
  logout(): void;
}
