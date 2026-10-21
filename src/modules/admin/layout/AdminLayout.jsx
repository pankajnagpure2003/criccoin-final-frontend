import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logoImg from "../../../assets/criccoin-logo-trans.png";
import { authClient } from "../../../api/authClient.js";
import { logoutAdmin } from "../api/admin.api.js";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authClient.isAuthenticated("admin")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  function logout() {
    logoutAdmin();
    navigate("/admin/login");
  }

  return (
    <div className="app-shell admin-dashboard">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <div className="sidebar-brand-heading">
            <img className="sidebar-logo" src={logoImg} alt="" />
            <span className="brand-mark">Criccoin</span>
          </div>
          <p className="brand-tag">ADMIN</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/deposits">Deposits</NavLink>
          <NavLink to="/admin/withdrawals">Withdrawals</NavLink>
          <NavLink to="/admin/payment-setup">Payment setup</NavLink>
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="sidebar-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
