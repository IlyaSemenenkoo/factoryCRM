import { api } from "./axios";

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export async function getAllUsers(): Promise<User[]> {
  const res = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.data;
}

export async function createUser(fullName: string, role: string) {
  const res = await api.post(
    "/users",
    { fullName, role },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data; // { username, password, fullName }
}
