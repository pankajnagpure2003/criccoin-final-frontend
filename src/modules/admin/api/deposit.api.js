import { authClient } from "../../../api/authClient.js";

export function getAdminDeposits(status = "") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authClient.get(`/api/admin/deposits${query}`, { auth: true, role: "admin" });
}

export function approveDeposit(id, payload) {
  return authClient.post(`/api/admin/deposits/${id}/approve`, payload, { auth: true, role: "admin" });
}

export function rejectDeposit(id, payload) {
  return authClient.post(`/api/admin/deposits/${id}/reject`, payload, { auth: true, role: "admin" });
}

export function getDepositSettings() {
  return authClient.get("/api/admin/deposits/settings", { auth: true, role: "admin" });
}

export function saveDepositSettings(payload) {
  return authClient.put("/api/admin/deposits/settings", payload, { auth: true, role: "admin" });
}
