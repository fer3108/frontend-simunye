import type { TokenStorageRepository } from "@/features/core/domain/repositories/TokenStorageRepository";
import type { Credentials } from "../domain/entities/CredentialsEntitys";
import type { AuthRepository } from "../domain/repositories/AuthRepository";

export class AuthServices {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly tokenStorageRepo: TokenStorageRepository
  ) {}

  async login(credentials: Credentials) {
    const resp = await this.authRepo.login(credentials);
    console.log(resp);
    if (resp.status === "success" && resp.data) {
      this.tokenStorageRepo.saveToken(resp.data?.token);
    }
    return resp;
  }
}
