import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AdminPage } from "./pages/AdminPage";
import { ManagerPage } from "./pages/ManagerPage";
import { WorkerPage } from "./pages/WorkerPage";
import { LoginPage } from "./auth/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/admin",
        element: (
          <ProtectedRoute roles ={["Admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manager",
        element: (
          <ProtectedRoute roles={["Manager"]}>
            <ManagerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/worker",
        element: (
          <ProtectedRoute roles={["Sewer", "Shoemaker", "Packer"]}>
            <WorkerPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);