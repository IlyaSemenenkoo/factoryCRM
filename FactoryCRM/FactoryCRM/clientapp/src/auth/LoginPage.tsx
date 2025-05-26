import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Обробка форми логіну
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, role, userId } = res.data;

      // Зберігаємо у контекст і localStorage
      login({ token, role, userId });

      // Перенаправляємо користувача на відповідну сторінку
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Manager":
          navigate("/manager");
          break;
        case "Sewer":
        case "Shoemaker":
        case "Packer":
          navigate("/worker");
          break;
        default:
          alert("Невідома роль користувача");
          break;
      }
    } catch (err) {
      console.error(err);
      alert("Невірний логін або пароль");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h1>🔐 Вхід у систему</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логін:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          Увійти
        </button>
      </form>
    </div>
  );
}
