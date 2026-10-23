import { authClient } from "../../../api/authClient.js";

export function getInvestments() {
  return authClient.get("/api/investments", { auth: true });
}

export function createInvestment(payload) {
  return authClient.post("/api/investments", payload, { auth: true });
}

export function claimInvestment(id, payload) {
  return authClient.post(`/api/investments/${id}/claim`, payload, { auth: true });
}
