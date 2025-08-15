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
import type { UserEntity } from "@/features/users/domain/entities/UserEntity";

export default function ModalDeleteUser({
  open,
  onOpenChange,
  selectUser,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (user: UserEntity) => void;
  selectUser: UserEntity | null;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (user: UserEntity) => {
      console.log("Deleting user:", user.id);
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const service = new UserService(userRepo, tokenStorageRepo);

      return await service.deleteUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obtainUsers"] });
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
        <div>¿Estás seguro de que deseas eliminar este Usuario?</div>
        <Separator className="my-1" />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancelar</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (selectUser) {
                mutation.mutate(selectUser);
              }
            }}
            disabled={!selectUser || mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
