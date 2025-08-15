import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRepositoryImp } from "../../../repositories/UserRepositoryImp";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import type { RoleEntity } from "@/features/users/domain/entities/RoleEntity";

export default function ModalDeleteRole({
  open,
  onOpenChange,
  selectRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (role: RoleEntity) => void;
  selectRole: RoleEntity | null;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (role: RoleEntity) => {
      console.log("Deleting role:", role.id);
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const service = new UserService(userRepo, tokenStorageRepo);

      return await service.deleteRole(role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obtainRoles"] });
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
        <div>¿Estás seguro de que deseas eliminar este Rol?</div>
        <Separator className="my-1" />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancelar</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (selectRole) {
                mutation.mutate(selectRole);
              }
            }}
            disabled={!selectRole || mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
