import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <>
      <h1>Home Page</h1>
      <Button asChild>
        <Link to="/login">Soy un boton</Link>
      </Button>
    </>
  );
}
