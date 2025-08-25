import { Link, Outlet, useLocation, useNavigate } from "react-router";
import LogoutButton from "@/features/auth/infrastructure/framework/LogoutButton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  GalleryVerticalEnd,
  LayoutDashboard,
  User,
  UserPlus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import UserCard from "@/components/user-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { UserRepositoryImp } from "@/features/users/insfrastructure/repositories/UserRepositoryImp";
import { UserService } from "@/features/users/application/UserService";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { useEffect } from "react";
import { useProfileStore } from "@/features/core/infrastructure/stores/useProfileStore";

const menuContent = [
  {
    name: "menuButton 1",
    icon: LayoutDashboard,
    link: "/",
  },
  {
    name: "Usuarios y Accesos",
    icon: User,
    link: "/user",
  },
  {
    name: "Operaciones",
    icon: UserPlus,
    link: "/operations",
  },
  {
    name: "Recurso 1",
    icon: UserPlus,
    link: "otro recurso",
  },
];

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ["obtainProfile"],
    queryFn: async () => {
      const userRepo = new UserRepositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();

      const servicio = new UserService(userRepo, tokenStorageRepo);

      const reqProfile = await servicio.obteinProfile();

      if (reqProfile.data) {
        /* const saveProfile = useProfileStore((state) => state.setProfile);
        saveProfile(reqProfile.data); */
        useProfileStore.getState().setProfile(reqProfile.data);
      }
      console.log("===>>", reqProfile);

      return reqProfile;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isPending && (error || data.status !== "success")) {
      navigate("/login");
    }
  }, [error, data, isPending]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...asdasd
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Mi Aplicación</span>
              <span className="">v1.0.0</span>
            </div>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarMenu>
              {menuContent.map(
                (item, index) =>
                  item.link && (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.link}
                      >
                        <Link to={item.link} className="w-full">
                          <item.icon />
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="w-full">
        <header className="flex w-full h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) px-2">
          <SidebarTrigger className="cursor-pointer ml-2" />
          <Separator className="mx-2" orientation="vertical" />
          <div className="flex items-center justify-between w-full">
            <UserCard
              name={data?.data?.username || ""}
              email={data?.data?.email || ""}
            />
            <div className="mr-4">
              <LogoutButton variant="outline" />
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
