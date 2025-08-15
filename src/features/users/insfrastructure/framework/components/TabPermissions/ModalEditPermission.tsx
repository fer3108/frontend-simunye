import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import type { PermissionEntity } from "@/features/users/domain/entities/PermissionEntity";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { Toast } from "@/components/ui/toast";
import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import { useQueryClient } from "@tanstack/react-query";
import { editPermissionSchema } from "../../../schemas/editPermissionSchema";

export default function ModalEditPermission({
  open,
  onOpenChange,
  permission,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: PermissionEntity | null;
  onSave: (permission: PermissionEntity) => void;
}) {
  const [resApi, setResApi] = useState<ApiResponseEntity<PermissionEntity>>({
    status: "fail",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: permission?.name || "",
      description: permission?.description || "",
      enabled: permission?.enabled ?? false,
    },
    validators: {
      onChange: editPermissionSchema,
    },
    onSubmit: async ({ value }) => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();

      const servicio = new UserService(userRepo, tokenStorageRepo);
      const respServicio = await servicio.updatePermission({
        ...value,
        id: permission?.id,
      });
      setResApi(respServicio);
      setShowToast(true);

      if (respServicio.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["obtainPermissions"] });
      }
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name,
        description: permission.description,
        enabled: permission.enabled ?? false,
      });
    }
  }, [permission]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Permiso</DialogTitle>
          <DialogDescription>
            Aquí puedes editar los detalles del permiso.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-1" />
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre del permiso"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched && (
                    <span className="text-red-500 text-xs">
                      *{field.state.meta.errors[0]?.message}
                    </span>
                  )}
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>Descripción</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Descripción del permiso"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched && (
                    <span className="text-red-500 text-xs">
                      *{field.state.meta.errors[0]?.message}
                    </span>
                  )}
              </div>
            )}
          />

          <form.Field
            name="enabled"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label>Estado</Label>
                <div className="w-fit min-w-32 flex justify-center items-center gap-2 border border-gray-300 p-2 rounded">
                  <p
                    className={`font-semibold ${
                      field.state.value ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {field.state.value ? "Activo" : "Inactivo"}
                  </p>
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />{" "}
                </div>
              </div>
            )}
          />
          <Separator className="my-1" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || showToast}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
        {showToast && resApi && (
          <Toast
            message={resApi.message}
            variant={resApi.status === "success" ? "success" : "error"}
            duration={3000}
            onClose={() => {
              setShowToast(false);
              onOpenChange(resApi.status === "success" ? false : true);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
