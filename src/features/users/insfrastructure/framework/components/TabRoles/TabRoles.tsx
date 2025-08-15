import { useRolesStore } from "@/features/core/infrastructure/stores/useRolesStore";
import { TableRoles } from "./TableRoles/TableRoles";
import { columnsRoles } from "./TableRoles/columns-roles";
import ModalEditRole from "./ModalEditRole";
import { useState } from "react";
import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";
import ModalNewRol from "./ModalNewRol";
import ModalDeleteRole from "./ModalDeleteRole";

export default function TabRoles() {
  const rolesStore = useRolesStore((state) => state.roles);

  const [selectRole, setSelectRole] = useState<RoleEntity | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEditRole = (role: RoleEntity) => {
    setSelectRole(role);
    setEditModalOpen(true);
  };

  const handleDeleteRole = (role: RoleEntity) => {
    setSelectRole(role);
    setDeleteModalOpen(true);
  };

  return (
    <div className="w-full p-2 flex flex-col">
      <h2 className="text-2xl font-bold">Roles</h2>
      <p className="text-gray-600 text-sm">
        Aquí se gestionan los roles de los usuarios.
      </p>
      <div className="flex justify-end mb-4">
        <ModalNewRol />
      </div>
      <TableRoles
        data={rolesStore}
        columns={columnsRoles(handleEditRole, handleDeleteRole)}
      />
      <ModalEditRole
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        role={selectRole}
        onSave={handleEditRole}
      />
      <ModalDeleteRole
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDelete={handleDeleteRole}
        selectRole={selectRole}
      />
    </div>
  );
}
