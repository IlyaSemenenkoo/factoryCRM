import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { ManagerPage } from "./pages/ManagerPage";
import { WorkerPage } from "./pages/WorkerPage";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AssignPage } from "./pages/AssignPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/assign"
            element={<ProtectedRoute role="Admin"><AssignPage /></ProtectedRoute>}
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={<ProtectedRoute role="Admin"><AdminPage /></ProtectedRoute>}
          />
          <Route
            path="/manager"
            element={<ProtectedRoute role="Manager"><ManagerPage /></ProtectedRoute>}
          />
          <Route
            path="/worker"
            element={<ProtectedRoute role="Sewer"><WorkerPage /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}