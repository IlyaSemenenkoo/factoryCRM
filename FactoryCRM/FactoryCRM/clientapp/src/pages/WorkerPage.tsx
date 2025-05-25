import { useEffect, useState } from "react";
import { getMyOrders, completeOrderStep, Order } from "../api/orders";
import { useAuthContext } from "../auth/AuthContext";
import { OrderStatus, statusLabels, statusColors } from "../constants/orderStatus";

export function WorkerPage() {
  const { role, logout } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Завантаження замовлень при відкритті сторінки
  useEffect(() => {
    loadOrders();
  }, []);

  // Отримати призначені працівнику замовлення
  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await getMyOrders();
      const userId = localStorage.getItem("userId");

      const filtered = allOrders.filter((order) => {
        if (role === "Sewer") return order.assignedSewerId === userId;
        if (role === "Shoemaker") return order.assignedShoemakerId === userId;
        if (role === "Packer") return order.assignedPackerId === userId;
        return false;
      });

      setOrders(filtered);
    } catch {
      alert("Не вдалося завантажити замовлення");
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Завершення поточного етапу
  const handleComplete = async (id: string) => {
    try {
      await completeOrderStep(id);
      await loadOrders();
    } catch {
      alert("Помилка при завершенні етапу");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧵 Завдання працівника ({role})</h1>

      {loading ? (
        <p>Завантаження...</p>
      ) : orders.length === 0 ? (
        <p>Немає призначених вам замовлень</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "6px"
              }}
            >
              <p><strong>Опис замовлення:</strong> {order.description}</p>

              <p>
                <strong>Статус:</strong>{" "}
                <span
                  style={{
                    backgroundColor: statusColors[order.status as OrderStatus],
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}
                >
                  {statusLabels[order.status as OrderStatus]}
                </span>
              </p>

              {role === "Sewer" && (
                <p><strong>Інструкція для швачки:</strong> {order.sewingInstruction}</p>
              )}
              {role === "Shoemaker" && (
                <p><strong>Інструкція для сапожника:</strong> {order.shoemakerInstruction}</p>
              )}
              {role === "Packer" && (
                <>
                  <p><strong>Інструкція для упаковника:</strong> {order.packerInstruction}</p>
                  <p><strong>Інформація про доставку:</strong> {order.deliveryInfo}</p>
                </>
              )}

              <button onClick={() => handleComplete(order.id)}>
                ✅ Завершити етап
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
