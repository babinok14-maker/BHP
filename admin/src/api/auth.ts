import api from "./axios";
import { Admin } from "../types";

export async function login(email: string, password: string) {
  const { data } = await api.post<{ success: boolean; data: { token: string; admin: Admin } }>(
    "/api/auth/login",
    { email, password }
  );
  return data.data;
}

export async function fetchMe() {
  const { data } = await api.get<{ success: boolean; data: Admin }>("/api/auth/me");
  return data.data;
}

export async function logout() {
  await api.post("/api/auth/logout");
}
