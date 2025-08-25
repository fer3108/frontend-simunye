import type { RoleEntity } from "./RoleEntity";

export interface UserEntity {
  id?: string;
  username: string;
  email: string;
  password: string;
  enabled?: boolean;
  userRoles: RoleEntity[];
}
