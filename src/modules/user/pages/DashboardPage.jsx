import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  BadgeCheck,
  Coins,
  Copy,
  ShoppingBag,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import { getMyDeposits, getWallet } from "../api/deposit.api.js";
import { getInvestments } from "../api/investment.api.js";
import { getMyWithdrawals } from "../api/withdrawal.api.js";
import { getMe, logoutUser } from "../api/userAuth.api.js";

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function formatWhen(value) {
  return value ? new Date(value).toLocaleString() : "-";
}

function newestFirst(items) {
  return [...items].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()).slice(0, 10);
}

function depositMethod(method) {
  if (method === "upi") return "UPI";
  if (method === "cryptapi") return "USDT";
  return "Bank transfer";
}

function depositAmount(deposit) {
  if (deposit.method === "cryptapi" || deposit.fiatCurrency === "USDT") {
    return `${formatUsdt(deposit.usdtAmount || deposit.fiatAmount)} USDT`;
  }
  return `${Number(deposit.fiatAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${deposit.fiatCurrency || ""}`.trim();
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [balanceUsdt, setBalanceUsdt] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [lockedUsdt, setLockedUsdt] = useState(null);
  const [deposits, setDeposits] = useState(null);
  const [withdrawals, setWithdrawals] = useState(null);
  const [depositHistoryError, setDepositHistoryError] = useState("");
  const [withdrawalHistoryError, setWithdrawalHistoryError] = useState("");
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
    getMyDeposits()
      .then((data) => setDeposits(newestFirst(data.deposits || [])))
      .catch((err) => setDepositHistoryError(err.message));
    getMyWithdrawals()
      .then((data) => setWithdrawals(newestFirst(data.withdrawals || [])))
      .catch((err) => setWithdrawalHistoryError(err.message));
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
        <article className="stat-card metric-card">
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
        <article className="stat-card metric-card">
          <span className="metric-icon"><ShoppingBag size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>Purchased</p>
            <strong>{lockedUsdt === null ? "-" : `${Number(lockedUsdt).toLocaleString("en-IN", { maximumFractionDigits: 6 })} USDT`}</strong>
            <span>Total purchases</span>
          </div>
        </article>
        <article className="stat-card metric-card">
          <span className="metric-icon"><Coins size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>Tokens</p>
            <strong>{tokenBalance === null ? "-" : Number(tokenBalance).toLocaleString("en-IN", { maximumFractionDigits: 6 })}</strong>
            <span>Your token balance</span>
          </div>
        </article>
        <article className="stat-card metric-card">
          <span className="metric-icon"><Copy size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>Referral code</p>
            <strong>{profile.user.referralCode}</strong>
            <span>Invite your friends</span>
          </div>
        </article>
        <article className="stat-card metric-card">
          <span className="metric-icon"><UsersRound size={21} aria-hidden="true" /></span>
          <div className="metric-copy">
            <p>People referred</p>
            <strong>{profile.referralCount}</strong>
            <span>Your community</span>
          </div>
        </article>
        <article className="stat-card metric-card">
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

      <div className="overview-history-grid">
        <section className="panel overview-history-panel">
          <div className="overview-section-title">
            <span className="overview-section-icon"><ArrowDownToLine size={18} aria-hidden="true" /></span>
            <div>
              <h2>Recent deposits</h2>
              <p>Latest 10 deposit requests</p>
            </div>
            <Link to="/dashboard/deposit" className="overview-link">View all <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {depositHistoryError ? (
            <p className="error overview-history-message">{depositHistoryError}</p>
          ) : deposits === null ? (
            <p className="muted overview-history-message">Loading deposits...</p>
          ) : deposits.length === 0 ? (
            <p className="muted overview-history-message">No deposits yet.</p>
          ) : (
            <div className="overview-history-list">
              {deposits.map((deposit) => (
                <article className="overview-history-item" key={deposit._id}>
                  <div className="overview-history-item-copy">
                    <strong>{depositAmount(deposit)}</strong>
                    <span>{depositMethod(deposit.method)} · {formatWhen(deposit.createdAt)}</span>
                  </div>
                  <span className={`badge ${deposit.status}`}>{deposit.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel overview-history-panel">
          <div className="overview-section-title">
            <span className="overview-section-icon"><ArrowUpFromLine size={18} aria-hidden="true" /></span>
            <div>
              <h2>Recent withdrawals</h2>
              <p>Latest 10 withdrawal requests</p>
            </div>
            <Link to="/dashboard/withdraw" className="overview-link">View all <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {withdrawalHistoryError ? (
            <p className="error overview-history-message">{withdrawalHistoryError}</p>
          ) : withdrawals === null ? (
            <p className="muted overview-history-message">Loading withdrawals...</p>
          ) : withdrawals.length === 0 ? (
            <p className="muted overview-history-message">No withdrawals yet.</p>
          ) : (
            <div className="overview-history-list">
              {withdrawals.map((withdrawal) => (
                <article className="overview-history-item" key={withdrawal._id}>
                  <div className="overview-history-item-copy">
                    <strong>{formatUsdt(withdrawal.amountUsdt)} USDT</strong>
                    <span>{withdrawal.method || "Withdrawal"} · {formatWhen(withdrawal.createdAt)}</span>
                  </div>
                  <span className={`badge ${withdrawal.status}`}>{withdrawal.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
