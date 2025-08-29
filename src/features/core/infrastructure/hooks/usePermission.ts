// src/features/core/infrastructure/hooks/usePermission.ts
import { useState, useEffect } from "react";

import { useProfileStore } from "../stores/useProfileStore";
import { AuthorizationServices } from "@/features/authorization/application/AuthorizationServices";
import { AuthorizationRepositoryImp } from "@/features/authorization/infrastructure/AuthorizationRepositoryImp";
import Permissions from "@/config/permissionsConfig";

// Inicializar el servicio fuera del hook para evitar recrearlo en cada renderizado
const authorizationService = new AuthorizationServices(
  new AuthorizationRepositoryImp()
);

export default function usePermission() {
  const profile = useProfileStore((state) => state.profile);
  const [permissionsCache, setPermissionsCache] = useState<
    Record<string, boolean>
  >({});

  // Función síncrona que verifica permisos usando el cache
  const can = (permission: string): boolean => {
    return !!permissionsCache[permission];
  };

  // Efecto para cargar y actualizar el cache de permisos cuando cambia el perfil
  useEffect(() => {
    const loadPermissions = async () => {
      if (profile) {
        // Lista de permisos que necesitas verificar en tu aplicación
        const permissionsToCheck = Permissions;

        // Crear un objeto con todos los permisos verificados
        const newPermissionsCache: Record<string, boolean> = {};

        // Verificar cada permiso de forma asíncrona
        await Promise.all(
          Object.keys(permissionsToCheck).flatMap((rol) => {
            // rol = "USER", "ROLE", "RESOURCE_A"
            return Object.values(
              permissionsToCheck[rol as keyof typeof permissionsToCheck]
            ).map(async (permission) => {
              // permission = "user:read", "user:create", etc.
              newPermissionsCache[permission] =
                await authorizationService.hasPermission(permission);
            });
          })
        );

        setPermissionsCache(newPermissionsCache);
      } else {
        // Si no hay perfil, limpiar el cache
        setPermissionsCache({});
      }
    };

    loadPermissions();
  }, [profile]);

  console.log(permissionsCache);
  return can;
}
