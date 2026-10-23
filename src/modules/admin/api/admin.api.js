import { authClient } from "../../../api/authClient.js";

export function adminLogin(payload) {
  return authClient.post("/api/admin/login", payload, { role: "admin" });
}

export function getUsers() {
  return authClient.get("/api/admin/users", { auth: true, role: "admin" });
}

export async function quickLoginUser(id) {
  const data = await authClient.post(`/api/admin/users/${id}/quick-login`, {}, { auth: true, role: "admin" });
  authClient.setSession("user", { token: data.userToken, user: data.user });
  return data;
}

export function updateUser(id, payload) {
  return authClient.put(`/api/admin/users/${id}`, payload, { auth: true, role: "admin" });
}

export function logoutAdmin() {
  authClient.clearSession("admin");
}
