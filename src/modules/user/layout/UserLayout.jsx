import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ArrowUpFromLine,
  ChevronDown,
  CircleDollarSign,
  CircleUserRound,
  Coins,
  LayoutDashboard,
  LogOut,
  UserRound,
  UsersRound,
} from "lucide-react";
import logoImg from "../../../assets/criccoin-logo-trans.png";
import { authClient } from "../../../api/authClient.js";
import { logoutUser } from "../api/userAuth.api.js";

export default function UserLayout() {
  const navigate = useNavigate();
  const user = authClient.getProfile("user");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
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
            <LayoutDashboard size={20} aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/deposit">
            <CircleDollarSign size={20} aria-hidden="true" />
            <span>Deposit</span>
          </NavLink>
          <NavLink to="/dashboard/invest">
            <Coins size={20} aria-hidden="true" />
            <span>Purchase</span>
          </NavLink>
          <NavLink to="/dashboard/withdraw">
            <ArrowUpFromLine size={20} aria-hidden="true" />
            <span>Withdraw</span>
          </NavLink>
          <NavLink to="/dashboard/referral">
            <UsersRound size={20} aria-hidden="true" />
            <span>Referral</span>
          </NavLink>
          <NavLink to="/dashboard/profile">
            <CircleUserRound size={20} aria-hidden="true" />
            <span>Profile</span>
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
            <p>CRICCOIN MEMBER AREA</p>
            <h2>Welcome back{user?.firstName ? `, ${user.firstName}` : ""}</h2>
          </div>
          <div className="user-topbar-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="user-topbar-profile"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              aria-label={`Account menu, referral code ${user?.referralCode || "not available"}`}
              onClick={() => setProfileMenuOpen((open) => !open)}
            >
              <img className="user-topbar-logo" src={logoImg} alt="" />
              <span className="user-topbar-details">
                <strong>Referral code</strong>
                <span>{user?.referralCode || "Not available"}</span>
              </span>
              <ChevronDown className="user-topbar-chevron" size={16} aria-hidden="true" />
            </button>
            {profileMenuOpen ? (
              <div className="user-topbar-menu-panel" role="menu">
                <Link
                  to="/dashboard/profile"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <UserRound size={17} aria-hidden="true" />
                  Profile
                </Link>
                <button type="button" role="menuitem" onClick={logout}>
                  <LogOut size={17} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
