import { Button } from "@/components/ui/button";
import { AuthService } from "../AuthService";
import { useNavigate } from "react-router";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export default function LogoutButton({ 
  variant = "destructive", 
  className = ""
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleLogout}
    >
      Cerrar Sesión
    </Button>
  );
}