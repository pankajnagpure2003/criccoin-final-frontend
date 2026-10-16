import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./modules/landing/LandingPage.jsx";
import LoginPage from "./modules/user/pages/LoginPage.jsx";
import SignupPage from "./modules/user/pages/SignupPage.jsx";
import VerifyOtpPage from "./modules/user/pages/VerifyOtpPage.jsx";
import ForgotPasswordPage from "./modules/user/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./modules/user/pages/ResetPasswordPage.jsx";
import UserLayout from "./modules/user/layout/UserLayout.jsx";
import DashboardPage from "./modules/user/pages/DashboardPage.jsx";
import ReferralPage from "./modules/user/pages/ReferralPage.jsx";
import ProfilePage from "./modules/user/pages/ProfilePage.jsx";
import AdminLoginPage from "./modules/admin/pages/AdminLoginPage.jsx";
import AdminUsersPage from "./modules/admin/pages/AdminUsersPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<UserLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="referral" element={<ReferralPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
