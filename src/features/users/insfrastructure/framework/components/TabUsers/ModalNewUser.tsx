import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Toast } from "@/components/ui/toast";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import { newUserSchema } from "../../../schemas/newUserSchema";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import type { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { useRolesStore } from "@/features/core/infrastructure/stores/useRolesStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";
import { Badge } from "@/components/ui/badge";

export default function ModalNewUser() {
  const rolesStore = useRolesStore((state) => state.roles);

  const [openModal, setOpenModal] = useState(false);
  const [responseApi, setResponseApi] = useState<ApiResponseDto>();
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
      username: "",
      email: "",
      password: "13245678",
      roles: [""],
    },
    validators: {
      onChange: newUserSchema,
    },
    onSubmit: async ({ value }) => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const servicio = new UserService(userRepo, tokenStorageRepo);
      const respServicio = await servicio.createUser(value);

      setResponseApi(respServicio);
      setShowToast(true);

      if (respServicio.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["obtainUsers"] });
      }
    },
  });

  const handleSelectedRoleChange = (role: RoleEntity) => {
    const permissionsName = role.permissionList.map((p) => p.name);
    setSelectedRole({ role: role.name, permissions: permissionsName });
  };

  return (
    <Dialog
      open={openModal}
      onOpenChange={(isOpen) => {
        setOpenModal(isOpen);
        if (!isOpen) {
          setSelectedRole({ role: "", permissions: [] });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
          }}
        >
          Crear Usuario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
        </DialogHeader>
        <Separator className="my-2" />
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4">
            <form.Field
              name="username"
              children={(field) => (
                <>
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
                </>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <>
                  <Label htmlFor="email" className="font-semibold">
                    Correo Electronico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Correo Electronico"
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
          </div>

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
                  {field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched && (
                      <span className="text-red-500 text-xs">
                        *{field.state.meta.errors[0]?.message}
                      </span>
                    )}
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

          <Separator className="my-2" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || showToast}>
                  {isSubmitting ? "Creando" : "Save changes"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
        {showToast && responseApi && (
          <Toast
            message={responseApi.message}
            variant={responseApi.status === "success" ? "success" : "error"}
            duration={3000}
            onClose={() => {
              setShowToast(false);
              setOpenModal(responseApi.status === "success" ? false : true);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
