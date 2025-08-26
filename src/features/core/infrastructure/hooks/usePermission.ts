import { AuthorizationServices } from "@/features/authorization/application/AuthorizationServices";
import { AuthorizationRepositoryImp } from "@/features/authorization/infrastructure/AuthorizationRepositoryImp";
import { useEffect, useState } from "react";

const service = new AuthorizationServices(new AuthorizationRepositoryImp());

export default function usePermission(permission: string) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    service.hasPermission(permission).then((res) => {
      setAllowed(res);
    });
  }, [permission]);
  return allowed;
}
