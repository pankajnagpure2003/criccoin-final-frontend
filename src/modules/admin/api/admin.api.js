import { authClient } from "../../../api/authClient.js";

export function adminLogin(payload) {
  return authClient.post("/api/admin/login", payload, { role: "admin" });
}

export function getUsers() {
  return authClient.get("/api/admin/users", { auth: true, role: "admin" });
}

export function logoutAdmin() {
  authClient.clearSession("admin");
}
