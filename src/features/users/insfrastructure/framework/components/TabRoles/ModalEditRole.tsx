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
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { Toast } from "@/components/ui/toast";
import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import { useQueryClient } from "@tanstack/react-query";
import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";
import { editRoleSchema } from "../../../schemas/editRoleSchema";
import { usePermissionsStore } from "@/features/core/infrastructure/stores/usePersmissionsStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import type { EditRoleEntity } from "@/features/users/domain/entities/EditRoleEntity";

export default function ModalEditRole({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleEntity | null;
  onSave: (role: RoleEntity) => void;
}) {
  const permissionsStore = usePermissionsStore((state) => state.permissions);

  const [resApi, setResApi] = useState<ApiResponseEntity<EditRoleEntity>>({
    status: "fail",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      enabled: role?.enabled ?? false,
      permissionList: role?.permissionList?.map((p) => p.name) || [],
    },
    validators: {
      onChange: editRoleSchema,
    },
    onSubmit: async ({ value }) => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();

      const servicio = new UserService(userRepo, tokenStorageRepo);
      const respServicio = await servicio.updateRole({
        ...value,
        id: role?.id,
      });
      setResApi(respServicio);
      setShowToast(true);

      if (respServicio.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["obtainRoles"] });
      }
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        enabled: role.enabled ?? false,
        permissionList: role?.permissionList?.map((p) => p.name) || [],
      });
    }
  }, [role]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Rol</DialogTitle>
          <DialogDescription>
            Aquí puedes editar los detalles del rol.
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
                  placeholder="Nombre del Rol"
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
                  placeholder="Descripción del Rol"
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

          <form.Field
            name="permissionList"
            children={(field) => (
              <>
                <ScrollArea
                  className="h-48 rounded-md border w-1/2"
                  type="always"
                >
                  {permissionsStore.map(
                    (permission) =>
                      permission.enabled && (
                        <div key={permission.id} className="flex gap-2 p-2">
                          <Checkbox
                            checked={field.state.value.some(
                              (p: any) => p === permission.name
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.handleChange([
                                  ...field.state.value,
                                  permission.name,
                                ]);
                              } else {
                                field.handleChange(
                                  field.state.value.filter(
                                    (p: any) => p !== permission.name
                                  )
                                );
                              }
                            }}
                          />
                          <Label>{permission.name}</Label>
                        </div>
                      )
                  )}
                </ScrollArea>
                {field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched && (
                    <span className="text-red-500 text-xs">
                      *{field.state.meta.errors[0]?.message}
                    </span>
                  )}
              </>
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
