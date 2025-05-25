import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { JSX } from "react";

export function ProtectedRoute({ children, role }: { children: JSX.Element; role: string }) {
  const { token, role: userRole } = useAuthContext();

  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to="/login" replace />;

  return children;
}
