import type { AuthorizationRepository } from "../domain/AuthorizationRepository";

export class AuthorizationServices {
  constructor(private repoAuthorization: AuthorizationRepository) {}

  public async getProfile() {
    const profile = await this.repoAuthorization.getProfile();

    console.log("desde l servicio", profile);
  }
}
