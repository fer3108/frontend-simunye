import { useQuery } from "@tanstack/react-query";
import { UserRepositoryImp } from "../../repositories/UserRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TabPermissions from "../components/TabPermissions/TabPermissions";
import TabRoles from "../components/TabRoles/TabRoles";
import { LockIcon, ShieldIcon, User2, UserCog2Icon } from "lucide-react";
import { usePermissionsStore } from "@/features/core/infrastructure/stores/usePersmissionsStore";
import { useRolesStore } from "@/features/core/infrastructure/stores/useRolesStore";
import TabUsers from "../components/TabUsers/TabUsers";

export default function UserPage() {
  const { data, isPending } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["obtainUsers"],
    queryFn: async () => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();

      const userService = new UserService(userRepo, tokenStorageRepo);
      const respUsers = await userService.getUsers();
      return respUsers;
    },
  });

  useQuery({
    queryKey: ["obtainPermissions"],
    queryFn: async () => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();

      const servicio = new UserService(userRepo, tokenStorageRepo);
      const reqPermissions = await servicio.getPermissions();
      usePermissionsStore.getState().setPermissions(reqPermissions.data || []);
      return reqPermissions;
    },
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ["obtainRoles"],
    queryFn: async () => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();

      const servicio = new UserService(userRepo, tokenStorageRepo);
      const reqRoles = await servicio.getRoles();
      useRolesStore.getState().setRoles(reqRoles.data || []);
      return reqRoles;
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        <p className="text-blue-600 font-medium">Cargando Usuarios y Accesos</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UserCog2Icon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Gestión de Usuarios y Accesos
          </h2>
        </div>
        <p className="text-gray-600 text-sm ml-11">
          Gestiona los usuarios, roles y permisos del sistema de forma
          centralizada.
        </p>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="flex justify-start gap-2 p-1 pb-0 bg-white dark:bg-blue-950 w-full border-b-1 rounded-none">
          <TabsTrigger
            value="users"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all max-w-fit rounded-none data-[state=inactive]:border-none hover:bg-zinc-100 hover:rounded-t-sm cursor-pointer data-[state=active]:bg-white data-[state=active]:border-b-4 data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white"
          >
            <User2 className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all max-w-fit rounded-none data-[state=inactive]:border-none hover:bg-zinc-100 hover:rounded-t-sm cursor-pointer data-[state=active]:bg-white data-[state=active]:border-b-4 data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white"
          >
            <ShieldIcon className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all max-w-fit rounded-none data-[state=inactive]:border-none hover:bg-zinc-100 hover:rounded-t-sm cursor-pointer data-[state=active]:bg-white data-[state=active]:border-b-4 data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white"
          >
            <LockIcon className="h-4 w-4" />
            Permisos
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="users"
          className="mt-2 rounded-lg border p-4 shadow-sm animate-in fade-in-50 slide-in-from-top-5 duration-300"
        >
          <TabUsers dataTable={data?.data ?? []} />
        </TabsContent>
        <TabsContent
          value="roles"
          className="mt-2 rounded-lg border p-4 shadow-sm animate-in fade-in-50 slide-in-from-top-5 duration-300"
        >
          <TabRoles />
        </TabsContent>
        <TabsContent
          value="permissions"
          className="mt-2 rounded-lg border p-4 shadow-sm animate-in fade-in-50 slide-in-from-top-5 duration-300"
        >
          <TabPermissions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
