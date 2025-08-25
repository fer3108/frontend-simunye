import AdapterInProfile from "../adapters/AdapterInProfile";
import type { AuthorizationRepository } from "../domain/AuthorizationRepository";

export class AuthorizationServices {
  constructor(private repoAuthorization: AuthorizationRepository) {}

  public async getProfile() {
    const profile = await this.repoAuthorization.getProfile();

    if (!profile) {
      return null;
    }

    const newProfile = await AdapterInProfile(profile);

    console.log("desde el servicio ===>", newProfile);
  }
}
