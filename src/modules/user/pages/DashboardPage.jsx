import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  BadgeCheck,
  Copy,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import { getWallet } from "../api/deposit.api.js";
import { getInvestments } from "../api/investment.api.js";
import { getMe, logoutUser } from "../api/userAuth.api.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [balanceUsdt, setBalanceUsdt] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [lockedUsdt, setLockedUsdt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }

    getMe()
      .then(setProfile)
      .catch((err) => {
        setError(err.message);
        logoutUser();
      });
    getWallet()
      .then((data) => {
        setBalanceUsdt(data.wallet?.availableUsdt ?? data.wallet?.balanceUsdt ?? 0);
        setTokenBalance(data.wallet?.tokenBalance ?? 0);
      })
      .catch(() => {
        setBalanceUsdt(null);
        setTokenBalance(null);
      });
    getInvestments()
      .then((data) => setLockedUsdt(data.lockedUsdt ?? 0))
      .catch(() => setLockedUsdt(null));
  }, [navigate]);

  if (error) {
    return (
      <div className="panel">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return <p className="dashboard-loading">Loading your dashboard...</p>;
  }

  const user = profile.user;

  return (
    <div className="user-overview">
      <section className="overview-heading">
        <div>
          <p className="overview-kicker">YOUR ACCOUNT</p>
          <h1>Dashboard</h1>
          <p className="overview-description">Your wallet and account activity at a glance.</p>
        </div>
        <span className="account-protected"><BadgeCheck size={16} aria-hidden="true" /> Account protected</span>
      </section>

      <div className="stats overview-stats">
        <article className="stat-card metric-card metric-wallet">
          <span className="metric-icon"><WalletCards size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>Wallet balance</p>
            <strong>
              {balanceUsdt === null ? "-" : Number(balanceUsdt).toLocaleString("en-IN", { maximumFractionDigits: 6 })}
              <small>USDT</small>
            </strong>
            <span>Available to use</span>
          </div>
        </article>
        <article className="stat-card">
          <p>Purchased</p>
          <strong>{lockedUsdt === null ? "-" : `${Number(lockedUsdt).toLocaleString("en-IN", { maximumFractionDigits: 6 })} USDT`}</strong>
        </article>
        <article className="stat-card">
          <p>Tokens</p>
          <strong>{tokenBalance === null ? "-" : Number(tokenBalance).toLocaleString("en-IN", { maximumFractionDigits: 6 })}</strong>
        </article>
        <article className="stat-card">
          <p>Referral code</p>
          <strong>{profile.user.referralCode}</strong>
        </article>
        <article className="stat-card metric-card metric-community">
          <span className="metric-icon"><UsersRound size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>People referred</p>
            <strong>{profile.referralCount}</strong>
            <span>Your community</span>
          </div>
        </article>
        <article className={`stat-card metric-card metric-status ${user.isVerified ? "is-verified" : "is-pending"}`}>
          <span className="metric-icon"><BadgeCheck size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>Account status</p>
            <strong>{user.isVerified ? "Verified" : "Pending"}</strong>
            <span>{user.isVerified ? "You're all set" : "Verification in progress"}</span>
          </div>
        </article>
      </div>

      <div className="overview-bottom">
        <section className="panel overview-account-panel">
          <div className="overview-section-title">
            <span className="overview-section-icon"><BadgeCheck size={18} aria-hidden="true" /></span>
            <div>
              <h2>Account details</h2>
              <p>Your personal information</p>
            </div>
            <Link to="/dashboard/profile" className="overview-link">View profile <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          <dl className="overview-details">
            <div><dt>Full name</dt><dd>{user.name || "-"}</dd></div>
            <div><dt>Email address</dt><dd>{user.email || "-"}</dd></div>
            <div><dt>Mobile number</dt><dd>{user.mobile || "-"}</dd></div>
            <div><dt>Country</dt><dd>{user.country || "-"}</dd></div>
          </dl>
        </section>

        <section className="panel overview-quick-panel">
          <div className="overview-section-title">
            <span className="overview-section-icon"><ArrowRight size={18} aria-hidden="true" /></span>
            <div>
              <h2>Quick actions</h2>
              <p>Manage your wallet</p>
            </div>
          </div>
          <div className="overview-quick-actions">
            <Link to="/dashboard/deposit" className="overview-quick-action">
              <span className="quick-action-icon"><ArrowDownToLine size={18} aria-hidden="true" /></span>
              <span><strong>Deposit</strong><small>Add funds to your wallet</small></span>
              <ArrowRight className="quick-action-arrow" size={15} aria-hidden="true" />
            </Link>
            <Link to="/dashboard/withdraw" className="overview-quick-action">
              <span className="quick-action-icon"><ArrowUpFromLine size={18} aria-hidden="true" /></span>
              <span><strong>Withdraw</strong><small>Request a payout</small></span>
              <ArrowRight className="quick-action-arrow" size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
