import { useEffect, useState } from "react";
import { getAllOrders, Order } from "../api/orders";
import { getAllUsers, User } from "../api/users";
import { OrderStatus, statusLabels } from "../constants/orderStatus";

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        getAllOrders(),
        getAllUsers()
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch {
      alert("Не вдалося завантажити дані");
    }
  };

  // Кількість замовлень по статусах
  const getStatusStats = () => {
    const result: Record<OrderStatus, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    for (const o of orders) {
      result[o.status as OrderStatus]++;

    }
    return result;
  };

  // Підрахунок задач на кожного працівника
  const getWorkerStats = () => {
    const result: Record<string, number> = {};
    for (const o of orders) {
      [o.assignedSewerId, o.assignedShoemakerId, o.assignedPackerId].forEach((id) => {
        if (id) result[id] = (result[id] || 0) + 1;
      });
    }
    return result;
  };

  // Прострочені замовлення
  const overdueOrders = orders.filter(o => new Date(o.deadline) < new Date() && o.status < OrderStatus.Shipped);

  // Замовлення без призначених виконавців
  const unassignedOrders = orders.filter(o =>
    !o.assignedSewerId || !o.assignedShoemakerId || !o.assignedPackerId
  );

  const statusStats = getStatusStats();
  const workerStats = getWorkerStats();

  const findUserName = (id: string | undefined | null) =>
    users.find(u => u.id === id)?.fullName || "—";

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Панель адміністратора</h1>

      <section>
        <h2>Статистика по статусах</h2>
        <ul>
          {Object.entries(statusStats).map(([key, count]) => (
            <li key={key}>
              {statusLabels[+key as OrderStatus]}: {count}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section>
        <h2>Задачі по працівниках</h2>
        <ul>
          {Object.entries(workerStats).map(([userId, count]) => (
            <li key={userId}>
              👤 {findUserName(userId)} — {count} задач(і)
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section>
        <h2>❗ Прострочені замовлення</h2>
        {overdueOrders.length === 0 ? (
          <p>Немає прострочених замовлень</p>
        ) : (
          <ul>
            {overdueOrders.map(o => (
              <li key={o.id}>
                {o.description} — дедлайн: {new Date(o.deadline).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      <section>
        <h2>⚠️ Непризначені замовлення</h2>
        {unassignedOrders.length === 0 ? (
          <p>Усі замовлення мають виконавців</p>
        ) : (
          <ul>
            {unassignedOrders.map(o => (
              <li key={o.id}>
                {o.description} —{" "}
                {[
                  !o.assignedSewerId && "немає швачки",
                  !o.assignedShoemakerId && "немає сапожника",
                  !o.assignedPackerId && "немає упаковника"
                ].filter(Boolean).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
