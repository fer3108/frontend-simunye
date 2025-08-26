import type { ApiUserEntity } from "@/features/core/infrastructure/apiInterfaces/ApiUserEntity";
import type { UserEntity } from "@/features/users/domain/entities/UserEntity";

export default async function AdapterInProfile(
  profile: ApiUserEntity
): Promise<UserEntity> {
  const roles = profile.userRoles.map((role) => role.role.name);
  const rolePermissions = profile.userRoles.flatMap((ur) =>
    ur.role.rolePermissions.map(
      (rp) => `${rp.permission.resource}:${rp.permission.action}`
    )
  );
  const directPermissions = profile.userPermissions.map(
    (up) => `${up.permission.resource}:${up.permission.action}`
  );

  const permissions = Array.from(
    new Set([...rolePermissions, ...directPermissions])
  );

  const { userRoles, userPermissions, ...rest } = profile;
  const result = {
    ...rest,
    roles,
    permissions,
  };

  return result;
}
