import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { JSX } from "react";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[]; // ⬅️ масив ролей
}) {
  const { user, isReady } = useAuth();

  if (!isReady) return null;

  if (!user) return <Navigate to="/login" />;

  // Якщо задані ролі — перевіряємо чи роль користувача присутня
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
