import type { ApiRoleEntity } from "./ApiRoleEntity";

export interface ApiUserRoleEntity {
  id: string;
  assignedAt: string;
  role: ApiRoleEntity;
}
