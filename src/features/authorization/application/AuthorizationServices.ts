import type { AuthorizationRepository } from "../domain/AuthorizationRepository";

export class AuthorizationServices {
  constructor(private repoAuthorization: AuthorizationRepository) {}

  public async hasPermission(permission: string) {
    const profile = await this.repoAuthorization.getProfileFromStore();

    if (!profile) {
      return false;
    }

    return profile.permissions.includes(permission);
  }
}
