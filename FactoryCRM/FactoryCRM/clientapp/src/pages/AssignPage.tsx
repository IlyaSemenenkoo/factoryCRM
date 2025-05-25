import { useEffect, useState } from "react";
import { getAllOrders, assignWorkers, Order } from "../api/orders";
import { getAllUsers, User } from "../api/users";
import { OrderStatus, statusLabels } from "../constants/orderStatus";

export function AssignPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Стани для тимчасових вибраних працівників
  const [assignments, setAssignments] = useState<Record<string, {
    sewerId: string | null;
    shoemakerId: string | null;
    packerId: string | null;
  }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, usersData] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
      ]);

      setOrders(ordersData);
      setUsers(usersData);

      // Ініціалізація обʼєктів призначень
      const initial: typeof assignments = {};
      for (const o of ordersData) {
        initial[o.id] = {
          sewerId: o.assignedSewerId ?? null,
          shoemakerId: o.assignedShoemakerId ?? null,
          packerId: o.assignedPackerId ?? null,
        };
      }
      setAssignments(initial);
    } catch {
      alert("Помилка при завантаженні даних");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (orderId: string) => {
    try {
      const assignData = assignments[orderId];
      await assignWorkers(orderId, assignData);
      alert("✅ Виконавців призначено");
    } catch {
      alert("❌ Не вдалося призначити виконавців");
    }
  };

  const renderSelect = (
    role: string,
    orderId: string,
    field: "sewerId" | "shoemakerId" | "packerId"
  ) => {
    const filtered = users.filter((u) => u.role === role);
    return (
      <select
        value={assignments[orderId]?.[field] ?? ""}
        onChange={(e) =>
          setAssignments((prev) => ({
            ...prev,
            [orderId]: {
              ...prev[orderId],
              [field]: e.target.value || null,
            },
          }))
        }
      >
        <option value="">Не призначено</option>
        {filtered.map((u) => (
          <option key={u.id} value={u.id}>
            {u.fullName}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>👤 Призначення працівників</h1>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Опис</th>
              <th>Статус</th>
              <th>Швачка</th>
              <th>Сапожник</th>
              <th>Упаковник</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.description}</td>
                <td>{statusLabels[order.status as OrderStatus]}</td>
                <td>{renderSelect("Sewer", order.id, "sewerId")}</td>
                <td>{renderSelect("Shoemaker", order.id, "shoemakerId")}</td>
                <td>{renderSelect("Packer", order.id, "packerId")}</td>
                <td>
                  <button onClick={() => handleAssign(order.id)}>💾 Зберегти</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
