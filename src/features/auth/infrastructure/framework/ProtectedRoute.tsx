import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { AuthService } from "../AuthService";
import { TokenValidator } from "../TokenValidator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export default function ProtectedRoute({ redirectPath = "/login" }: ProtectedRouteProps) {
  const authService = new AuthService();
  const tokenValidator = new TokenValidator();
  const location = useLocation();
  
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const validateAuth = async () => {
      // Primero verificamos si hay token
      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      
      // Si hay token, validamos con el backend
      try {
        const isValid = await tokenValidator.validateToken();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Error validando autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };
    
    validateAuth();
  }, []);
  
  // Mientras se valida, mostramos un spinner de carga
  if (isValidating) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login guardando la ubicación actual
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si está autenticado, renderizar los componentes hijos
  return <Outlet />;
}