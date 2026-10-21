import { authClient } from "../../../api/authClient.js";

export function getAdminWithdrawals(status = "") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authClient.get(`/api/admin/withdrawals${query}`, { auth: true, role: "admin" });
}

export function approveWithdrawal(id, formData) {
  return authClient.postForm(`/api/admin/withdrawals/${id}/approve`, formData, { auth: true, role: "admin" });
}

export function rejectWithdrawal(id, payload) {
  return authClient.post(`/api/admin/withdrawals/${id}/reject`, payload, { auth: true, role: "admin" });
}

export function getAdminWithdrawalProof(id) {
  return authClient.getBlob(`/api/admin/withdrawals/${id}/proof`, { auth: true, role: "admin" });
}
