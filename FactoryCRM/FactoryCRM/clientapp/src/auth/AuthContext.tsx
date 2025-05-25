import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = "Admin" | "Manager" | "Sewer" | "Shoemaker" | "Packer";

interface AuthContextType {
  token: string | null;
  role: Role | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role") as Role | null;
    setToken(savedToken);
    setRole(savedRole);
  }, []);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
