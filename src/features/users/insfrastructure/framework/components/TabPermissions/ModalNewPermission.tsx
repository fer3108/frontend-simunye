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
import { newPermissionSchema } from "@/features/users/insfrastructure/schemas/newPermissionSchema";
import { useForm } from "@tanstack/react-form";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import { Toast } from "@/components/ui/toast";
import { useState } from "react";
import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";
import type { PermissionEntity } from "@/features/users/domain/entities/PermissionEntity";
import { useQueryClient } from "@tanstack/react-query";

export default function ModalNewPermission() {
  const [openModal, setOpenModal] = useState(false);
  const [resApi, setResApi] = useState<ApiResponseEntity<PermissionEntity>>();
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: { name: "", description: "" },
    validators: {
      onChange: newPermissionSchema,
    },
    onSubmit: async ({ value }) => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const servicio = new UserService(userRepo, tokenStorageRepo);
      const respServicio = await servicio.createPermission(value);
      setResApi(respServicio);
      setShowToast(true);

      if (respServicio.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["obtainPermissions"] });
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
                  placeholder="Nombre del permiso"
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
                  placeholder="Descripción del permiso"
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
