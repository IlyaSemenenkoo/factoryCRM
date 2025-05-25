import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { getAllOrders, Order } from "../api/orders";
import { getAllUsers, User } from "../api/users";
import { OrderStatus, statusLabels, statusColors } from "../constants/orderStatus";

export function ManagerPage() {
  // Стани форми
  const [description, setDescription] = useState("");
  const [sewingInstruction, setSewingInstruction] = useState("");
  const [shoemakerInstruction, setShoemakerInstruction] = useState("");
  const [packerInstruction, setPackerInstruction] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [success, setSuccess] = useState(false);

  // Списки замовлень і користувачів
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Завантажити всі замовлення та користувачів при старті
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch {
      alert("Помилка при завантаженні даних");
    }
  };

  // Створити нове замовлення
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await api.post(
        "/orders",
        {
          description,
          sewingInstruction,
          shoemakerInstruction,
          packerInstruction,
          deliveryInfo,
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Очистити форму
      setDescription("");
      setSewingInstruction("");
      setShoemakerInstruction("");
      setPackerInstruction("");
      setDeliveryInfo("");
      setDeadline("");
      setSuccess(true);

      // Перезавантажити список
      await loadData();
    } catch {
      alert("Помилка при створенні замовлення");
    }
  };

  // Знайти ім'я користувача за ID
  const findUserName = (id: string | undefined | null) =>
    users.find((u) => u.id === id)?.fullName || "Не призначено";

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Створення нового замовлення</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Опис:</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>Інструкція для швачки:</label><br />
          <input value={sewingInstruction} onChange={(e) => setSewingInstruction(e.target.value)} />
        </div>

        <div>
          <label>Інструкція для сапожника:</label><br />
          <input value={shoemakerInstruction} onChange={(e) => setShoemakerInstruction(e.target.value)} />
        </div>

        <div>
          <label>Інструкція для упаковника:</label><br />
          <input value={packerInstruction} onChange={(e) => setPackerInstruction(e.target.value)} />
        </div>

        <div>
          <label>Інформація про доставку:</label><br />
          <input value={deliveryInfo} onChange={(e) => setDeliveryInfo(e.target.value)} />
        </div>

        <div>
          <label>Термін виконання:</label><br />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>Створити замовлення</button>
      </form>

      {success && <p style={{ color: "green" }}>✅ Замовлення успішно створене!</p>}

      <hr style={{ margin: "2rem 0" }} />

      <h2>📋 Всі замовлення</h2>

      {orders.length === 0 ? (
        <p>Поки що немає замовлень</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Опис</th>
              <th>Дедлайн</th>
              <th>Статус</th>
              <th>Швачка</th>
              <th>Сапожник</th>
              <th>Упаковник</th>
              <th>Доставка</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.description}</td>
                <td>{new Date(order.deadline).toLocaleDateString()}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: statusColors[order.status as OrderStatus],
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {statusLabels[order.status as OrderStatus]}
                  </span>
                </td>
                <td>
                  {order.sewingInstruction}
                  <br />
                  <small>👤 {findUserName(order.assignedSewerId)}</small>
                </td>
                <td>
                  {order.shoemakerInstruction}
                  <br />
                  <small>👤 {findUserName(order.assignedShoemakerId)}</small>
                </td>
                <td>
                  {order.packerInstruction}
                  <br />
                  <small>👤 {findUserName(order.assignedPackerId)}</small>
                </td>
                <td>{order.deliveryInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
