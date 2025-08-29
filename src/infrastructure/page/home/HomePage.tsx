import Permissions from "@/config/permissionsConfig";
import usePermission from "@/features/core/infrastructure/hooks/usePermission";

export default function HomePage() {
  const can = usePermission();

  return (
    <>
      <h1>Home Page</h1>
      {can("user:read") && <div className="bg-green-500 p-4">Leer Recurso</div>}
      <div className="bg-blue-500 p-4">Crear Recurso</div>
      <div className="bg-yellow-500 p-4">Actualizar Recurso</div>
      {can(Permissions.USER.DELETE) && (
        <div className="bg-red-500 p-4">Eliminar Recurso</div>
      )}
    </>
  );
}
