import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpFromLine,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Coins,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";
import logoImg from "../../../assets/criccoin-logo-trans.png";
import { authClient } from "../../../api/authClient.js";
import { logoutAdmin } from "../api/admin.api.js";

const PAGE_TITLES = {
  "/admin/users": "User Management",
  "/admin/deposits": "Deposits",
  "/admin/withdrawals": "Withdrawals",
  "/admin/payment-setup": "Payment setup",
  "/admin/investment-setup": "Investment setup",
  "/admin/claim-requests": "Claim requests",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const pageTitle = PAGE_TITLES[location.pathname] || "Administration";

  useEffect(() => {
    if (!authClient.isAuthenticated("admin")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!profileMenuOpen) {
      return undefined;
    }

    function closeOnOutsideClick(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

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
          <NavLink to="/admin/users">
            <UsersRound size={20} aria-hidden="true" />
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/deposits">
            <CircleDollarSign size={20} aria-hidden="true" />
            <span>Deposits</span>
          </NavLink>
          <NavLink to="/admin/withdrawals">
            <ArrowUpFromLine size={20} aria-hidden="true" />
            <span>Withdrawals</span>
          </NavLink>
          <NavLink to="/admin/payment-setup">
            <Settings size={20} aria-hidden="true" />
            <span>Payment setup</span>
          </NavLink>
          <NavLink to="/admin/investment-setup">
            <Coins size={20} aria-hidden="true" />
            <span>Investment setup</span>
          </NavLink>
          <NavLink to="/admin/claim-requests">
            <ClipboardCheck size={20} aria-hidden="true" />
            <span>Claim requests</span>
          </NavLink>
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="sidebar-logout" onClick={logout}>
            <LogOut size={20} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="user-topbar-title">
            <p>CRICCOIN ADMIN AREA</p>
            <h2>{pageTitle}</h2>
          </div>
          <div className="user-topbar-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="user-topbar-profile"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              aria-label="Administrator account menu"
              onClick={() => setProfileMenuOpen((open) => !open)}
            >
              <img className="user-topbar-logo" src={logoImg} alt="" />
              <span className="user-topbar-details">
                <strong>Administrator</strong>
                <span>Control panel</span>
              </span>
              <ChevronDown className="user-topbar-chevron" size={16} aria-hidden="true" />
            </button>
            {profileMenuOpen ? (
              <div className="user-topbar-menu-panel" role="menu">
                <button type="button" role="menuitem" onClick={logout}>
                  <LogOut size={17} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
