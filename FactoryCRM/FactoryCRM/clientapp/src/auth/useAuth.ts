import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/axios";

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, role, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      if (role === "Admin") navigate("/admin");
      else if (role === "Manager") navigate("/manager");
      else navigate("/worker");
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return { login, error };
}
