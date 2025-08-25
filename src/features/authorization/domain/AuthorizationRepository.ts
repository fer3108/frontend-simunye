import type { UserEntity } from "@/features/users/domain/entities/UserEntity";

export interface AuthorizationRepository {
  getProfile: () => Promise<UserEntity | null>;
}
