import type { TokenStorageRepository } from "@/features/core/domain/repositories/TokenStorageRepository";
import type { UserRepository } from "../domain/repositories/UserRepository";

import type { PermissionEntity } from "../domain/entities/PermissionEntity";
import type { EditRoleEntity } from "../domain/entities/EditRoleEntity";
import type { NewRoleEntity } from "../domain/entities/NewRoleEntity";
import type { RoleEntity } from "../domain/entities/RoleEntity";
import type { UserEntity } from "../domain/entities/UserEntity";
import type { NewUserEntity } from "../domain/entities/NewUserEntity";

export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenStorageRepo: TokenStorageRepository
  ) {}

  async obteinProfile() {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    console.log("aqui en el servicio");
    return this.userRepo.getProfile(token);
  }

  async getUsers() {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.getUsers(token);
  }

  async createUser(user: NewUserEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.createUser(user, token);
  }

  async updateUser(user: NewUserEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.updateUser(user, token);
  }

  async deleteUser(user: UserEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.deleteUser(user, token);
  }

  async getPermissions() {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.getPermissions(token);
  }

  async createPermission(permission: PermissionEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.createPermission(token, permission);
  }

  async updatePermission(permission: PermissionEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.updatePermission(token, permission);
  }

  async deletePermission(permission: PermissionEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.deletePermission(token, permission);
  }

  async getRoles() {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.getRoles(token);
  }

  async createRole(role: NewRoleEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.createRole(token, role);
  }

  async updateRole(role: EditRoleEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.updateRole(token, role);
  }

  async deleteRole(role: RoleEntity) {
    const token = this.tokenStorageRepo.getToken("token");
    if (!token) throw new Error("Token inexistente");
    return this.userRepo.deleteRole(token, role);
  }
}
