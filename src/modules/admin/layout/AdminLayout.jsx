import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpFromLine,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Coins,
  LogOut,
  Menu,
  Network,
  Settings,
  X,
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
  "/admin/team": "My Team",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  useEffect(() => {
    if (!mobileNavOpen) {
      return undefined;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileNavOpen]);

  function logout() {
    setMobileNavOpen(false);
    logoutAdmin();
    navigate("/admin/login");
  }

  return (
    <div className="app-shell admin-dashboard">
      <aside className={mobileNavOpen ? "sidebar mobile-open" : "sidebar"} id="admin-mobile-sidebar">
        <div className="brand sidebar-brand">
          <div className="sidebar-brand-heading">
            <img className="sidebar-logo" src={logoImg} alt="" />
            <span className="brand-mark">Criccoin</span>
          </div>
          <button
            className="mobile-sidebar-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
          <p className="brand-tag">ADMIN</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/users" onClick={() => setMobileNavOpen(false)}>
            <UsersRound size={20} aria-hidden="true" />
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/deposits" onClick={() => setMobileNavOpen(false)}>
            <CircleDollarSign size={20} aria-hidden="true" />
            <span>Deposits</span>
          </NavLink>
          <NavLink to="/admin/withdrawals" onClick={() => setMobileNavOpen(false)}>
            <ArrowUpFromLine size={20} aria-hidden="true" />
            <span>Withdrawals</span>
          </NavLink>
          <NavLink to="/admin/payment-setup" onClick={() => setMobileNavOpen(false)}>
            <Settings size={20} aria-hidden="true" />
            <span>Payment setup</span>
          </NavLink>
          <NavLink to="/admin/investment-setup" onClick={() => setMobileNavOpen(false)}>
            <Coins size={20} aria-hidden="true" />
            <span>Investment setup</span>
          </NavLink>
          <NavLink to="/admin/claim-requests" onClick={() => setMobileNavOpen(false)}>
            <ClipboardCheck size={20} aria-hidden="true" />
            <span>Claim requests</span>
          </NavLink>
          <NavLink to="/admin/team" onClick={() => setMobileNavOpen(false)}>
            <Network size={20} aria-hidden="true" />
            <span>My Team</span>
          </NavLink>
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="sidebar-logout" onClick={logout}>
            <LogOut size={20} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      {mobileNavOpen ? (
        <button
          className="mobile-sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-heading">
            <button
              className="mobile-sidebar-toggle"
              type="button"
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="admin-mobile-sidebar"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
            <div className="user-topbar-title">
              <p>CRICCOIN ADMIN AREA</p>
              <h2>{pageTitle}</h2>
            </div>
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
