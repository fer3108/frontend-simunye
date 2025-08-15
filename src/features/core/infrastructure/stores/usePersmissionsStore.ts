import type { PermissionEntity } from "@/features/users/domain/entities/PermissionEntity";
import { create } from "zustand";

interface Permissions {
  permissions: PermissionEntity[];
  setPermissions: (permissions: PermissionEntity[]) => void;
}

export const usePermissionsStore = create<Permissions>()((set) => ({
  permissions: [],
  setPermissions: (permissions: PermissionEntity[]) =>
    set(() => ({ permissions })),
}));
