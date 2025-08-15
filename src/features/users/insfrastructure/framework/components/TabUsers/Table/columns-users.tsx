import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserEntity } from "@/features/users/domain/entities/UserEntity";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

export const columnsUsers = (
  onEdit?: (user: UserEntity) => void,
  onDelete?: (user: UserEntity) => void
): ColumnDef<UserEntity>[] => [
  {
    header: "N°",
    cell: ({ row }: { row: { index: number } }) => {
      return row.index + 1;
    },
  },
  { accessorKey: "username", header: "Nombre" },
  { accessorKey: "email", header: "Correo Electronico" },
  {
    header: "Estado",
    accessorKey: "enabled",
    cell: ({ getValue }) => {
      const enabled = getValue();
      return enabled ? (
        <Badge className="bg-green-600">Activo</Badge>
      ) : (
        <Badge variant={"destructive"}>Inactivo</Badge>
      );
    },
  },
  /* {
    header: "Rol del Usuario",
    cell: ({ row }) => {
      const roles = row.original.roles;
      const name = roles.map((role) => role.name).join(", ");
      return name;
    },
  }, */
  {
    header: "Permisos del Usuario",
    accessorKey: "permissionList",
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];
      const permissions = roles.flatMap((role) => role.permissionList ?? []);
      return (
        <div>
          {permissions.map((p, index) => (
            <p key={index}>{p.name}</p>
          ))}
        </div>
      );
    },
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 w-fit">
          <Button
            variant="outline"
            size="icon"
            className="shadow-sm cursor-pointer"
            onClick={() => onEdit && onEdit(row.original)}
          >
            <PencilIcon className="text-green-700" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shadow-sm cursor-pointer"
            onClick={() => {
              onDelete && onDelete(row.original);
            }}
          >
            <Trash2Icon className="text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
