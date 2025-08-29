import type { AuthorizationRepository } from "../domain/AuthorizationRepository";

export class AuthorizationServices {
  constructor(private repoAuthorization: AuthorizationRepository) {}

  public async hasPermission(permission: string): Promise<boolean> {
    const profile = await this.repoAuthorization.getProfileFromStore();

    if (!profile || !profile.permissions) {
      return false;
    }

    return this.repoAuthorization.hasPermission(
      permission,
      profile.permissions
    );
  }
}
