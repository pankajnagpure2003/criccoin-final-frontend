import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
            Overview
          </NavLink>
          <NavLink to="/dashboard/deposit">Deposit</NavLink>
          <NavLink to="/dashboard/withdraw">Withdraw</NavLink>
          <NavLink to="/dashboard/referral">Referral</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="sidebar-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <h2>Welcome{user?.firstName ? `, ${user.firstName}` : ""}</h2>
          <span>{user?.email}</span>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
