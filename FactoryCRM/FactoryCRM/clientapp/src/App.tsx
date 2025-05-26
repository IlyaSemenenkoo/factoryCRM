import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { ManagerPage } from "./pages/ManagerPage";
import { WorkerPage } from "./pages/WorkerPage";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AssignPage } from "./pages/AssignPage";
import { AppLayout } from "./components/layout/AppLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AppLayout>
                  <AdminPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={["Manager"]}>
                <AppLayout>
                  <ManagerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker"
            element={
              <ProtectedRoute roles={["Sewer", "Shoemaker", "Packer"]}>
                <AppLayout>
                  <WorkerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assign"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AppLayout>
                  <AssignPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
