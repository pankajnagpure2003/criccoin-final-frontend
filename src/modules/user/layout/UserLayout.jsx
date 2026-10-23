import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  UserRound,
  UsersRound,
} from "lucide-react";
import logoImg from "../../../assets/criccoin-logo-trans.png";
import { authClient } from "../../../api/authClient.js";
import { logoutUser } from "../api/userAuth.api.js";

export default function UserLayout() {
  const navigate = useNavigate();
  const user = authClient.getProfile("user");

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
    }
  }, [navigate]);

  function logout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="app-shell user-dashboard">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <div className="sidebar-brand-heading">
            <img className="sidebar-logo" src={logoImg} alt="" />
            <span className="brand-mark">Criccoin</span>
          </div>
          <p className="brand-tag">USER PANEL</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end>
            <LayoutDashboard size={17} aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/deposit">
            <ArrowDownToLine size={17} aria-hidden="true" />
            <span>Deposit</span>
          </NavLink>
          <NavLink to="/dashboard/invest">
            <ShoppingBag size={17} aria-hidden="true" />
            <span>Purchase</span>
          </NavLink>
          <NavLink to="/dashboard/withdraw">
            <ArrowUpFromLine size={17} aria-hidden="true" />
            <span>Withdraw</span>
          </NavLink>
          <NavLink to="/dashboard/referral">
            <UsersRound size={17} aria-hidden="true" />
            <span>Referral</span>
          </NavLink>
          <NavLink to="/dashboard/profile">
            <UserRound size={17} aria-hidden="true" />
            <span>Profile</span>
          </NavLink>
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="sidebar-logout" onClick={logout}>
            <LogOut size={17} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="user-topbar-title">
            <p>CRICCOIN MEMBER AREA</p>
            <h2>Welcome back{user?.firstName ? `, ${user.firstName}` : ""}</h2>
          </div>
          <div className="user-topbar-profile">
            <span className="user-topbar-avatar"><CircleUserRound size={20} aria-hidden="true" /></span>
            <span className="user-topbar-details">
              <strong>{user?.firstName || "Member"}</strong>
              <span>{user?.email || "Your account"}</span>
            </span>
          </div>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
