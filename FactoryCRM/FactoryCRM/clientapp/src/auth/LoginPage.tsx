import { useState } from "react";
import { useAuth } from "./useAuth";

export function LoginPage() {
  const { login, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Вход</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Логин" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Пароль" />
      <button type="submit">Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
