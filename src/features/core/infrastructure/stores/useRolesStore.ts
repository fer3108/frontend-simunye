import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";
import { create } from "zustand";

interface Roles {
  roles: RoleEntity[];
  setRoles: (roles: RoleEntity[]) => void;
}

export const useRolesStore = create<Roles>()((set) => ({
  roles: [],
  setRoles: (roles: RoleEntity[]) => set(() => ({ roles })),
}));
