import { useState } from "react";
import type { UserEntity } from "@/features/users/domain/entities/UserEntity";
import ModalNewUser from "./ModalNewUser";
import { TableUsers } from "./Table/TableUsers";
import ModalEditUser from "./ModalEditUser";
import ModalDeleteUser from "./ModalDeleteUser";
import { columnsUsers } from "./Table/columns-users";

export default function TabUsers({ dataTable }: { dataTable: any }) {
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [editOpenModal, setEditOpenModal] = useState(false);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);

  const handleEditRole = (user: UserEntity) => {
    setSelectedUser(user);
    setEditOpenModal(true);
  };

  const handleDeleteUser = (user: UserEntity) => {
    setSelectedUser(user);
    setDeleteOpenModal(true);
  };

  return (
    <div className="w-full p-2 flex flex-col gap-4">
      <div className="flex justify-end items-center mb-4">
        <ModalNewUser />
      </div>
      <TableUsers
        columns={columnsUsers(handleEditRole, handleDeleteUser)}
        data={dataTable}
      />
      <ModalEditUser
        open={editOpenModal}
        onOpenChange={setEditOpenModal}
        data={selectedUser}
      />
      <ModalDeleteUser
        open={deleteOpenModal}
        onOpenChange={setDeleteOpenModal}
        onDelete={handleDeleteUser}
        selectUser={selectedUser}
      />
    </div>
  );
}
