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
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import { Toast } from "@/components/ui/toast";
import { useState } from "react";
import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import { useQueryClient } from "@tanstack/react-query";
import type { NewRoleEntity } from "@/features/users/domain/entities/NewRoleEntity";
import { newRoleSchema } from "../../../schemas/newRolSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissionsStore } from "@/features/core/infrastructure/stores/usePersmissionsStore";
import { Checkbox } from "@/components/ui/checkbox";

export default function ModalNewRol() {
  const permissionsStore = usePermissionsStore((state) => state.permissions);

  const [openModal, setOpenModal] = useState(false);
  const [resApi, setResApi] = useState<ApiResponseEntity<NewRoleEntity>>();
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: { name: "", description: "", permissionList: [""] },
    validators: {
      onChange: newRoleSchema,
    },
    onSubmit: async ({ value }) => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const servicio = new UserService(userRepo, tokenStorageRepo);
      const respServicio = await servicio.createRole(value);
      setResApi(respServicio);
      setShowToast(true);

      if (respServicio.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["obtainRoles"] });
      }
    },
  });

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button onClick={() => form.reset()}>Nuevo Permiso</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Permiso</DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
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
                />{" "}
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
                />{" "}
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
                            checked={field.state.value.includes(
                              permission.name
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.handleChange([
                                  ...field.state.value.filter(
                                    (p: string) => p !== ""
                                  ),
                                  permission.name,
                                ]);
                              } else {
                                field.handleChange(
                                  field.state.value.filter(
                                    (p: string) => p !== permission.name
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

          <Separator className="my-4" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
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
        {showToast && resApi && (
          <Toast
            message={resApi.message}
            variant={resApi.status === "success" ? "success" : "error"}
            duration={3000}
            onClose={() => {
              setShowToast(false);
              setOpenModal(resApi.status === "success" ? false : true);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
