import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./modules/landing/LandingPage.jsx";
import LoginPage from "./modules/user/pages/LoginPage.jsx";
import SignupPage from "./modules/user/pages/SignupPage.jsx";
import VerifyOtpPage from "./modules/user/pages/VerifyOtpPage.jsx";
import ForgotPasswordPage from "./modules/user/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./modules/user/pages/ResetPasswordPage.jsx";
import UserLayout from "./modules/user/layout/UserLayout.jsx";
import DashboardPage from "./modules/user/pages/DashboardPage.jsx";
import DepositPage from "./modules/user/pages/DepositPage.jsx";
import InvestPage from "./modules/user/pages/InvestPage.jsx";
import WithdrawPage from "./modules/user/pages/WithdrawPage.jsx";
import ReferralPage from "./modules/user/pages/ReferralPage.jsx";
import MyTeamPage from "./modules/user/pages/MyTeamPage.jsx";
import ProfilePage from "./modules/user/pages/ProfilePage.jsx";
import AdminLoginPage from "./modules/admin/pages/AdminLoginPage.jsx";
import AdminLayout from "./modules/admin/layout/AdminLayout.jsx";
import AdminUsersPage from "./modules/admin/pages/AdminUsersPage.jsx";
import AdminDepositsPage from "./modules/admin/pages/AdminDepositsPage.jsx";
import AdminWithdrawalsPage from "./modules/admin/pages/AdminWithdrawalsPage.jsx";
import AdminPaymentSetupPage from "./modules/admin/pages/AdminPaymentSetupPage.jsx";
import AdminInvestmentSetupPage from "./modules/admin/pages/AdminInvestmentSetupPage.jsx";
import AdminClaimRequestsPage from "./modules/admin/pages/AdminClaimRequestsPage.jsx";
import AdminTeamPage from "./modules/admin/pages/AdminTeamPage.jsx";

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
        <Route path="deposit" element={<DepositPage />} />
        <Route path="invest" element={<InvestPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route path="referral" element={<ReferralPage />} />
        <Route path="team" element={<MyTeamPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="deposits" element={<AdminDepositsPage />} />
        <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
        <Route path="payment-setup" element={<AdminPaymentSetupPage />} />
        <Route path="investment-setup" element={<AdminInvestmentSetupPage />} />
        <Route path="claim-requests" element={<AdminClaimRequestsPage />} />
        <Route path="team" element={<AdminTeamPage />} />
      </Route>
    </Routes>
  );
}
