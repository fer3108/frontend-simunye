import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import type { UserEntity } from "../entities/UserEntity";

import type { RoleEntity } from "../entities/RoleEntity";
import type { PermissionEntity } from "../entities/PermissionEntity";
import type { EditRoleEntity } from "../entities/EditRoleEntity";
import type { NewRoleEntity } from "../entities/NewRoleEntity";
import type { NewUserEntity } from "../entities/NewUserEntity";

export interface UserRepository {
  // getUserById(id: string): Promise<User>;
  // getAllUsers(): Promise<User[]>;
  getProfile(token: String): Promise<ApiResponseEntity<UserEntity>>;

  getUsers(token: string): Promise<ApiResponseEntity<UserEntity[]>>;
  createUser(user: NewUserEntity, token: string): Promise<ApiResponseEntity>;
  updateUser(
    user: NewUserEntity,
    token: string
  ): Promise<ApiResponseEntity<NewUserEntity>>;
  deleteUser(user: UserEntity, token: string): Promise<ApiResponseEntity>;

  getPermissions(token: string): Promise<ApiResponseEntity<PermissionEntity[]>>;
  createPermission(
    token: string,
    permission: PermissionEntity
  ): Promise<ApiResponseEntity<PermissionEntity>>;
  updatePermission(
    token: string,
    permission: PermissionEntity
  ): Promise<ApiResponseEntity<PermissionEntity>>;
  deletePermission(
    token: string,
    permission: PermissionEntity
  ): Promise<ApiResponseEntity>;

  getRoles(token: string): Promise<ApiResponseEntity<RoleEntity[]>>;
  createRole(
    token: string,
    role: NewRoleEntity
  ): Promise<ApiResponseEntity<NewRoleEntity>>;
  updateRole(
    token: string,
    role: EditRoleEntity
  ): Promise<ApiResponseEntity<EditRoleEntity>>;
  deleteRole(
    token: string,
    role: RoleEntity
  ): Promise<ApiResponseEntity<RoleEntity>>;
}
