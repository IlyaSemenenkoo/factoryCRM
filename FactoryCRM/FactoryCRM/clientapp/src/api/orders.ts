import { api } from "./axios";

export interface Order {
  id: string;
  description: string;
  status: number;
  sewingInstruction?: string;
  shoemakerInstruction?: string;
  packerInstruction?: string;
  deliveryInfo?: string;
  deadline: string;
  createdAt: string;
  assignedSewerId?: string;
  assignedShoemakerId?: string;
  assignedPackerId?: string;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await api.get("/orders", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}

export async function completeOrderStep(id: string) {
  await api.put(`/orders/${id}/complete-step`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export async function getAllOrders(): Promise<Order[]> {
  const res = await api.get("/orders", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}

export async function assignWorkers(orderId: string, data: {
  sewerId: string | null;
  shoemakerId: string | null;
  packerId: string | null;
}) {
  await api.put(`/orders/${orderId}/assign-workers`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

