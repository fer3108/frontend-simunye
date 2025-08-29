import { Badge } from "@/components/ui/badge";
import type { PermissionEntity } from "@/features/users/domain/entities/PermissionEntity";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

export const columnsPermissions = (
  onEdit?: (permission: PermissionEntity) => void,
  onDelete?: (permission: PermissionEntity) => void
): ColumnDef<PermissionEntity>[] => [
  {
    header: "N°",
    cell: ({ row }: { row: { index: number } }) => {
      return row.index + 1;
    },
  },
  {
    header: "Nombre",
    cell: ({ row }) => {
      return row.original.name;
    },
  },
  {
    header: "Recurso",
    cell: ({ row }) => {
      return row.original.resource;
    },
  },

  /* { accessorKey: "name", header: "Nombre Permiso" },
  {
    header: "Acciones",
    cell: ({ row }) => {
      console.log(row);
      return <Badge>{row.original.action}</Badge>;
    },
  }, */

  /*  {
    header: " ",
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
  }, */
];
