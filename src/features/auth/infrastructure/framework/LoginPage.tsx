import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "@tanstack/react-form";
import { loginSchema } from "../loginSchema";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { AuthServices } from "../../application/AuthServices";
import { TokenStorageRepositoryImp } from "@/features/core/infrastructure/TokenStorageRepositoryImp";
import { AuthRespositoryImp } from "../AuthRepositoryImp";

export default function LoginPage() {
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de redirección si existe
  const from = location.state?.from || "/";

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const authRepo = new AuthRespositoryImp();
      const tokenStorageRepo = new TokenStorageRepositoryImp();
      const service = new AuthServices(authRepo, tokenStorageRepo);

      const result = await service.login(value);

      if (result.status === "fail") {
        setAlert(result.message);
        return;
      }
      // Redirigir al usuario a la página que intentaba acceder o al inicio
      navigate(from);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <div className="rounded-lg bg-primary p-4">
              <h1 className="text-3xl font-bold text-primary-foreground">
                MiEmpresa
              </h1>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Iniciar sesión</h2>
          <p className="text-muted-foreground mt-2">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
        >
          <form.Field
            name="username"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Nombre de Usuario{" "}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nombre de Usuario"
                  className="border-border focus:ring-ring"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched && (
                    <span className="text-red-500 text-xs">
                      *{field.state.meta.errors[0]?.message}
                    </span>
                  )}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Contraseña
                  </Label>
                  <a
                    href="/recuperar-contrasena"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="border-border focus:ring-ring"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched && (
                    <span className="text-red-500 text-xs">
                      *{field.state.meta.errors[0]?.message}
                    </span>
                  )}
              </div>
            )}
          />
          {alert && (
            <Alert variant="destructive" className="border-red-500 border-t-4">
              <AlertCircleIcon />
              <AlertTitle>{alert}</AlertTitle>
            </Alert>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "...Verificando" : "Ingresar"}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
