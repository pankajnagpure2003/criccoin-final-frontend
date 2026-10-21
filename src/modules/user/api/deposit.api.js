import { authClient } from "../../../api/authClient.js";

export function getWallet() {
  return authClient.get("/api/wallet", { auth: true });
}

export function getDepositOptions() {
  return authClient.get("/api/deposits/options", { auth: true });
}

export function getMyDeposits() {
  return authClient.get("/api/deposits", { auth: true });
}

export function createDeposit(payload) {
  return authClient.post("/api/deposits", payload, { auth: true });
}

export function openCryptapiDeposit() {
  return authClient.post("/api/deposits/cryptapi", {}, { auth: true });
}

export function refreshCryptapiDeposit() {
  return authClient.get("/api/deposits/cryptapi", { auth: true });
}
