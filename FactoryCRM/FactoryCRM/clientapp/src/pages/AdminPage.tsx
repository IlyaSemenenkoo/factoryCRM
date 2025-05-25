import { useEffect, useState } from "react";
import { getAllUsers, createUser, User } from "../api/users";
import { useAuthContext } from "../auth/AuthContext";

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Sewer");
  const [newUserInfo, setNewUserInfo] = useState<null | { username: string; password: string }>(null);

  const { logout } = useAuthContext();

  // Завантаження всіх користувачів при відкритті сторінки
  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => {
        alert("Помилка при завантаженні користувачів");
        logout();
      });
  }, []);

  // Обробка створення нового користувача
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createUser(fullName, role);

      // Додаємо користувача в список
      setUsers(prev => [
        ...prev,
        {
          id: "", // тимчасово
          username: created.username,
          fullName: created.fullName,
          role
        }
      ]);

      // Виводимо згенеровані логін і пароль
      setNewUserInfo(created);
      setFullName("");
      setRole("Sewer");
    } catch {
      alert("Помилка при створенні користувача");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Панель адміністратора</h1>

      <section>
        <h2>➕ Створити нового працівника</h2>
        <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="ПІБ працівника"
            required
            style={{ marginRight: "10px" }}
          />
          <select value={role} onChange={e => setRole(e.target.value)} style={{ marginRight: "10px" }}>
            <option value="Sewer">Швачка</option>
            <option value="Shoemaker">Сапожник</option>
            <option value="Packer">Упаковник</option>
            <option value="Manager">Менеджер</option>
          </select>
          <button type="submit">Створити</button>
        </form>

        {newUserInfo && (
          <div style={{ marginBottom: "1rem" }}>
            <p><strong>Логін:</strong> {newUserInfo.username}</p>
            <p><strong>Пароль:</strong> {newUserInfo.password}</p>
          </div>
        )}
      </section>

      <section>
        <h2>📋 Усі користувачі</h2>
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>ПІБ</th>
              <th>Логін</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.fullName}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
