import { authClient } from "../../../api/authClient.js";

export function signupUser(payload) {
  return authClient.post("/api/auth/signup", payload);
}

export function verifyOtp(payload) {
  return authClient.post("/api/auth/verify-otp", payload);
}

export function resendOtp(payload) {
  return authClient.post("/api/auth/resend-otp", payload);
}

export function loginUser(payload) {
  return authClient.post("/api/auth/login", payload);
}

export function forgotPassword(payload) {
  return authClient.post("/api/auth/forgot-password", payload);
}

export function resetPassword(payload) {
  return authClient.post("/api/auth/reset-password", payload);
}

export function getMe() {
  return authClient.get("/api/auth/me", { auth: true });
}

export function logoutUser() {
  authClient.clearSession("user");
}
