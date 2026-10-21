import { authClient } from "../../../api/authClient.js";

export function getWithdrawalOptions() {
  return authClient.get("/api/withdrawals/options", { auth: true });
}

export function getMyWithdrawals() {
  return authClient.get("/api/withdrawals", { auth: true });
}

export function createWithdrawal(payload) {
  return authClient.post("/api/withdrawals", payload, { auth: true });
}

export function getWithdrawalProof(id) {
  return authClient.getBlob(`/api/withdrawals/${id}/proof`, { auth: true });
}
