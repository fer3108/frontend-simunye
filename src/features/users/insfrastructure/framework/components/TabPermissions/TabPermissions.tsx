import { usePermissionsStore } from "@/features/core/infrastructure/stores/usePersmissionsStore";
import { TablePermissions } from "./TablePermissions/TablePermissions";
import { columnsPermissions } from "./TablePermissions/columns-permissions";
import ModalNewPermission from "./ModalNewPermission";
import type { PermissionEntity } from "@/features/users/domain/entities/PermissionEntity";
import { useState } from "react";
import ModalEditPermission from "./ModalEditPermission";
import ModalDeletePermission from "./ModalDeletePermission";

export default function TabPermissions() {
  const permissionsStore = usePermissionsStore((state) => state.permissions);

  const [selectPermission, setSelectPermission] =
    useState<PermissionEntity | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEditPermission = (permission: PermissionEntity) => {
    setSelectPermission(permission);
    setEditModalOpen(true);
  };

  const handleDeletePermission = (permission: PermissionEntity) => {
    setSelectPermission(permission);
    setDeleteModalOpen(true);
  };

  return (
    <div className="w-full p-2 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Permisos</h2>
      <div className="flex justify-end mb-4">
        <ModalNewPermission />
      </div>
      <TablePermissions
        data={permissionsStore}
        columns={columnsPermissions(
          handleEditPermission,
          handleDeletePermission
        )}
      />
      <ModalEditPermission
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        permission={selectPermission}
        onSave={handleEditPermission}
      />
      <ModalDeletePermission
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDelete={handleDeletePermission}
        selectPermission={selectPermission}
      />
    </div>
  );
}
