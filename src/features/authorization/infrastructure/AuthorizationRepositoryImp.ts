import type { UserEntity } from "@/features/users/domain/entities/UserEntity";
import type { AuthorizationRepository } from "../domain/AuthorizationRepository";
import { useProfileStore } from "@/features/core/infrastructure/stores/useProfileStore";

export class AuthorizationRepositoryImp implements AuthorizationRepository {
  public async getProfileFromStore(): Promise<UserEntity | null> {
    return useProfileStore.getState().profile;
  }

  public async hasPermission(
    permission: string,
    userPermissions: string[]
  ): Promise<boolean> {
    return userPermissions.includes(permission);
  }
}
