import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { PermissionEntity } from "@/features/users/domain/entities/PermissionEntity";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";

export default function ModalDeletePermission({
  open,
  onOpenChange,
  selectPermission,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (permission: PermissionEntity) => void;
  selectPermission: PermissionEntity | null;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (permission: PermissionEntity) => {
      console.log("Deleting permission:", permission.id);
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const service = new UserService(userRepo, tokenStorageRepo);

      return await service.deletePermission(permission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obtainPermissions"] });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Permiso</DialogTitle>
        </DialogHeader>
        <Separator className="my-1" />
        <div>¿Estás seguro de que deseas eliminar este permiso?</div>
        <Separator className="my-1" />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancelar</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (selectPermission) {
                mutation.mutate(selectPermission);
              }
            }}
            disabled={!selectPermission || mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
