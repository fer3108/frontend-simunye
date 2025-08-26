import { Button } from "@/components/ui/button";
import { AuthorizationServices } from "@/features/authorization/application/AuthorizationServices";
import { AuthorizationRepositoryImp } from "@/features/authorization/infrastructure/AuthorizationRepositoryImp";
import { Link } from "react-router";

export default function HomePage() {
  const profile = new AuthorizationServices(new AuthorizationRepositoryImp());
  console.log(profile.validatePermissions());

  return (
    <>
      <h1>Home Page</h1>
      <div className="bg-green-500 p-4">Leer Recurso</div>
      <div className="bg-blue-500 p-4">Crear Recurso</div>
      <div className="bg-yellow-500 p-4">Actualizar Recurso</div>
      <div className="bg-red-500 p-4">Eliminar Recurso</div>
    </>
  );
}
