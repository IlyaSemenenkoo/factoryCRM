import { createContext, useContext, useEffect, useState } from "react";

// Тип користувача
type User = {
  token: string;
  role: "Admin" | "Manager" | "Sewer" | "Shoemaker" | "Packer";
  userId: string;
};

// Тип контексту
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isReady: boolean; // чек для ініціалізації
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер авторизації
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false); // чи вже перевірено localStorage

  // При старті — перевіряємо localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as User["role"];
    const userId = localStorage.getItem("userId");

    if (token && role && userId) {
      setUser({ token, role, userId });
    }

    setIsReady(true);
  }, []);

  // Функція логіну
  const login = (userData: User) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userId", userData.userId);
    setUser(userData);
  };

  // Функція логауту
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isReady }}>
      {isReady ? children : null}
    </AuthContext.Provider>
  );
}

// Хук для доступу до авторизації
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
