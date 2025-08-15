import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  { accessorKey: "name", header: "Nombre Permiso" },
  { accessorKey: "description", header: "Descripción" },
  {
    header: "Acciones",
    cell: ({ row }) => {
      // Función para determinar las acciones basadas en el nombre del permiso
      // En un caso real, estas acciones vendrían del backend
      const getActionsForPermission = (
        permission: PermissionEntity
      ): string[] => {
        // Ejemplo: si el permiso contiene "usuario" en su nombre, mostramos acciones relacionadas con usuarios
        const name = permission.name.toLowerCase();

        if (name.includes("usuario")) {
          return [
            "Crear Usuario",
            "Listar Usuarios",
            "Editar Usuario",
            "Eliminar Usuario",
          ];
        } else if (name.includes("rol") || name.includes("role")) {
          return [
            "Crear Rol",
            "Listar Roles",
            "Editar Rol",
            "Eliminar Rol",
            "Asignar Permisos",
          ];
        } else if (name.includes("reporte") || name.includes("report")) {
          return [
            "Generar",
            "Exportar",
            "Imprimir",
            "Compartir",
            "Programar",
            "Archivar",
          ];
        }

        // Acciones por defecto
        return ["Crear", "Listar", "Actualizar", "Eliminar"];
      };

      // Obtener acciones para este permiso específico
      const actions = getActionsForPermission(row.original);

      // Si hay más de 3 acciones, mostramos un popover
      const maxVisibleActions = 2;
      const hasMoreActions = actions.length > maxVisibleActions;

      return (
        <div className="flex flex-wrap gap-1 items-center">
          {actions
            .slice(0, hasMoreActions ? maxVisibleActions : actions.length)
            .map((action, index) => (
              <Badge key={index} variant={"outline"} className="text-xs">
                {action}
              </Badge>
            ))}

          {hasMoreActions && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1 rounded-sm"
                >
                  +{actions.length - maxVisibleActions} más
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-auto">
                <div className="flex flex-wrap gap-1">
                  {actions.slice(maxVisibleActions).map((action, index) => (
                    <Badge key={index} variant={"outline"} className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
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
  },
];
