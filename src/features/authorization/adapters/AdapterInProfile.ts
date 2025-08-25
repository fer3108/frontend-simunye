import type { UserEntity } from "@/features/users/domain/entities/UserEntity";

export default async function AdapterInProfile(profile: UserEntity) {
  const roles = profile.userRoles.map((role) => role.name);
  console.log(roles);
}
