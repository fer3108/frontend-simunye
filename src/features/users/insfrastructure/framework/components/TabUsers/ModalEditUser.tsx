import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import { useRolesStore } from "@/features/core/infrastructure/stores/useRolesStore";
import type { NewUserEntity } from "@/features/users/domain/entities/NewUserEntity";
import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";
import type { UserEntity } from "@/features/users/domain/entities/UserEntity";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import { Switch } from "@/components/ui/switch";
import { editUserSchema } from "../../../schemas/editUserSchema";

export default function ModalEditUser({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UserEntity | null;
}) {
  const rolesStore = useRolesStore((state) => state.roles);

  const [resApi, setResApi] = useState<ApiResponseEntity<NewUserEntity>>({
    status: "fail",
    message: "",
  });

  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState<{
    role: string;
    permissions: string[];
  }>({
    role: "",
    permissions: [],
  });

  const form = useForm({
    defaultValues: {
      username: data?.username || "",
      email: data?.email || "",
      password: data?.password || "",
      enabled: data?.enabled ?? false,
      roles: data?.roles.map((r) => r.name) || [],
    },
    validators: { onChange: editUserSchema },
    onSubmit: async ({ value }) => {
      console.log("Submitting form with value:", value);
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const servicio = new UserService(userRepo, tokenStorageRepo);

      const resServicio = await servicio.updateUser({
        ...value,
        id: data?.id,
      });
      setResApi(resServicio);
      setShowToast(true);

      if (resServicio.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["obtainUsers"] });
      }
    },
  });

  useEffect(() => {
    if (data) {
      form.reset();
      setSelectedRole({ role: "", permissions: [] });
    }
  }, [data]);

  const handleSelectedRoleChange = (role: RoleEntity) => {
    const permissionsName = role.permissionList.map((p) => p.name);
    setSelectedRole({ role: role.name, permissions: permissionsName });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user information.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="username"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="font-semibold">
                  Nombre de Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nombre de Usuario"
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
            name="email"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="font-semibold">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Correo Electrónico"
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
            name="password"
            children={(field) => (
              <>
                <Label htmlFor="password" className="font-semibold">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
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
              </>
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
            name="roles"
            children={(field) => (
              <div className="flex gap-2">
                <div className="w-1/2 border border-gray-300 rounded p-2">
                  <Label>Asignar Roles</Label>
                  <Separator className="my-1" />
                  <ScrollArea className="h-48" type="always">
                    {rolesStore.map(
                      (role) =>
                        role.enabled && (
                          <div
                            key={role.id}
                            className={`flex gap-2 p-2 cursor-pointer hover:bg-gray-100 ${
                              selectedRole.role === role.name
                                ? "bg-blue-200"
                                : ""
                            }`}
                            onClick={() => {
                              handleSelectedRoleChange(role);
                            }}
                          >
                            <Checkbox
                              checked={field.state.value.includes(role.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.handleChange([
                                    ...field.state.value.filter(
                                      (p: string) => p !== ""
                                    ),
                                    role.name,
                                  ]);
                                } else {
                                  field.handleChange(
                                    field.state.value.filter(
                                      (p: string) => p !== role.name
                                    )
                                  );
                                }
                              }}
                            />
                            <Label className="flex items-center">
                              {role.name}
                            </Label>
                          </div>
                        )
                    )}
                  </ScrollArea>
                </div>

                <div className="w-1/2 border border-gray-300 rounded p-2">
                  <Label>Permisos del Rol Seleccionado</Label>
                  <Separator className="my-1" />
                  <ScrollArea className="h-48" type="always">
                    <div className="flex flex-col gap-2">
                      {selectedRole.permissions.map((permissionName, index) => {
                        return (
                          <Badge key={index} variant={"outline"}>
                            {permissionName}
                          </Badge>
                        );
                      })}
                    </div>
                  </ScrollArea>
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
