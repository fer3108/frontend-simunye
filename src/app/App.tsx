import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import RootLayout from "@/app/RootLayout";
import HomePage from "@/infrastructure/page/home/HomePage";
import RouteFivePage from "@/infrastructure/page/routeFive/RouteFivePage";
import RouteSixPage from "@/infrastructure/page/routeSix/RouteSixPage";
import LoginPage from "@/features/auth/infrastructure/framework/LoginPage";
import ProtectedRoute from "@/features/auth/infrastructure/framework/ProtectedRoute";

import UserPage from "@/features/users/insfrastructure/framework/page/UserPage";
import RolePage from "@/features/users/insfrastructure/framework/page/RolePage";
import PermissionPage from "@/features/users/insfrastructure/framework/page/PermissionPage";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/role" element={<RolePage />} />
              <Route path="/permission" element={<PermissionPage />} />
              <Route path="/routeFive" element={<RouteFivePage />} />
              <Route path="/routeSix" element={<RouteSixPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
