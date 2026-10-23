import { authClient } from "../../../api/authClient.js";

export function getTokenRate() {
  return authClient.get("/api/admin/investments/token-rate", { auth: true, role: "admin" });
}

export function saveTokenRate(payload) {
  return authClient.put("/api/admin/investments/token-rate", payload, { auth: true, role: "admin" });
}

export function getReferralPlans() {
  return authClient.get("/api/admin/investments/referral-plans", { auth: true, role: "admin" });
}

export function createReferralPlan(payload) {
  return authClient.post("/api/admin/investments/referral-plans", payload, { auth: true, role: "admin" });
}

export function updateReferralPlan(id, payload) {
  return authClient.put(`/api/admin/investments/referral-plans/${id}`, payload, { auth: true, role: "admin" });
}

export function deleteReferralPlan(id) {
  return authClient.delete(`/api/admin/investments/referral-plans/${id}`, { auth: true, role: "admin" });
}

export function setReferralPlanActive(id, active) {
  return authClient.post(`/api/admin/investments/referral-plans/${id}/active`, { active }, { auth: true, role: "admin" });
}

export function getClaimRequests(status = "pending") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authClient.get(`/api/admin/investments/claim-requests${query}`, { auth: true, role: "admin" });
}

export function approveClaimRequest(id, payload, status = "pending") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authClient.post(`/api/admin/investments/claim-requests/${id}/approve${query}`, payload, { auth: true, role: "admin" });
}

export function rejectClaimRequest(id, payload, status = "pending") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authClient.post(`/api/admin/investments/claim-requests/${id}/reject${query}`, payload, { auth: true, role: "admin" });
}
