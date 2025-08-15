import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";

import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

export const columnsRoles = (
  onEdit?: (role: RoleEntity) => void,
  onDelete?: (role: RoleEntity) => void
): ColumnDef<RoleEntity>[] => [
  {
    header: "N°",
    cell: ({ row }: { row: { index: number } }) => {
      return row.index + 1;
    },
  },
  { accessorKey: "name", header: "Nombre Rol" },
  { accessorKey: "description", header: "Descripción" },
  {
    header: "Permisos Asignados",
    accessorKey: "permissionList",
    cell: ({ getValue }) => {
      const permissions = getValue() as { id: string | number; name: string }[];
      const maxToShow = 1;
      return (
        <div className="flex flex-wrap gap-1 items-center">
          {permissions.slice(0, maxToShow).map((permission) => (
            <Badge key={permission.id} variant="secondary">
              {permission.name}
            </Badge>
          ))}
          {permissions.length > maxToShow && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="p-0 text-xs">
                  +{permissions.length - maxToShow} más
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-xs">
                <div className="flex flex-wrap gap-1">
                  {permissions.map((permission) => (
                    <Badge key={permission.id} variant="outline">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
          {permissions.length === 0 && (
            <span className="text-gray-400 text-xs">Sin permisos</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Estado",
    accessorKey: "enabled",
    cell: ({ getValue }) => {
      const isActive = getValue();
      return isActive ? (
        <Badge className="bg-green-600 min-w-16">Activo</Badge>
      ) : (
        <Badge className="min-w-16" variant={"destructive"}>
          Inactivo
        </Badge>
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
              console.log("Deleting permission:", row.original);
            }}
          >
            <Trash2Icon className="text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
