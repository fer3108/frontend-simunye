import type { UserEntity } from "@/features/users/domain/entities/UserEntity";

export interface AuthorizationRepository {
  getProfileFromStore: () => Promise<UserEntity | null>;
  hasPermission: (
    permission: string,
    userPermissions: string[]
  ) => Promise<boolean>;
}
