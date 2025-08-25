import { Button } from "@/components/ui/button";
import { AuthorizationServices } from "@/features/authorization/application/AuthorizationServices";
import { AuthorizationRepositoryImp } from "@/features/authorization/infrastructure/AuthorizationRepositoryImp";
import { Link } from "react-router";

export default function HomePage() {
  const profile = new AuthorizationServices(new AuthorizationRepositoryImp());
  console.log(profile.getProfile());

  return (
    <>
      <h1>Home Page</h1>
      <Button asChild>
        <Link to="/login">Soy un boton</Link>
      </Button>
    </>
  );
}
