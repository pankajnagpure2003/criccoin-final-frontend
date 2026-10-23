import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../api/admin.api.js";
import { approveClaimRequest, getClaimRequests, rejectClaimRequest } from "../api/investment.api.js";

const FILTERS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

function formatUsdt(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function formatWhen(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

function methodLabel(id) {
  if (id === "upi") return "UPI";
  if (id === "wallet_address") return "Wallet address";
  if (id === "bank_transfer") return "Bank transfer";
  return id || "-";
}

function labelize(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function payoutLines(payout = {}) {
  return Object.entries(payout).filter(([, value]) => value);
}

export default function AdminClaimRequestsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [hashes, setHashes] = useState({});
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load(nextStatus = status) {
    const data = await getClaimRequests(nextStatus);
    setRequests(data.requests || []);
  }

  useEffect(() => {
    load().catch((err) => {
      setError(err.message);
      if (err.status === 401) {
        logoutAdmin();
        navigate("/admin/login");
      }
    });
  }, [navigate, status]);

  async function onApprove(item) {
    const txHash = (hashes[item.id] || "").trim();
    if (txHash.length < 8) {
      setError("Enter the transaction hash before approving.");
      setInfo("");
      return;
    }
    setError("");
    setInfo("");
    setBusyId(item.id);
    try {
      const data = await approveClaimRequest(item.id, { txHash }, status);
      setRequests(data.requests || []);
      setInfo("Claim approved. Tokens are credited and the transaction hash is saved.");
    } catch (err) {
      setError(err.message);
      if (err.status === 401) {
        logoutAdmin();
        navigate("/admin/login");
      }
    } finally {
      setBusyId("");
    }
  }

  async function onReject(item) {
    setError("");
    setInfo("");
    setBusyId(item.id);
    try {
      const data = await rejectClaimRequest(item.id, { reason: reasons[item.id] || "" }, status);
      setRequests(data.requests || []);
      setInfo("Claim request rejected. The user can send it again.");
    } catch (err) {
      setError(err.message);
      if (err.status === 401) {
        logoutAdmin();
        navigate("/admin/login");
      }
    } finally {
      setBusyId("");
    }
  }

  return (
    <>
      <header className="topbar">
        <h2>Claim requests</h2>
      </header>
      <div className="app-content stack">
        <div className="filter-row">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={status === filter.id ? "ghost-btn active" : "ghost-btn"}
              onClick={() => setStatus(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="info">{info}</p> : null}
        <div className="panel">
          <p className="muted">
            Check the user, payout details, plan, invested amount, and token value at the current rate. Pay manually, then submit the transaction hash. Approving credits that token amount to the user's token wallet.
          </p>
          {requests.length === 0 ? (
            <p className="muted">No claim requests in this list.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Invested</th>
                    <th>Token value</th>
                    <th>Payment details</th>
                    <th>Transaction</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.user?.name || "-"}</strong>
                        <p className="payout-lines">{item.user?.email || "-"}</p>
                        <p className="payout-lines">{item.user?.mobile || "-"}</p>
                        <p className="payout-lines">{item.user?.country || "-"}</p>
                        <p className="payout-lines">Referral: {item.user?.referralCode || "-"}</p>
                        <p className="payout-lines">{item.user?.isVerified ? "Verified" : "Not verified"}</p>
                      </td>
                      <td>
                        <strong>{item.referralPlan?.name || "-"}</strong>
                        <p className="payout-lines">
                          {item.referralPlan?.durationDays ? `${item.referralPlan.durationDays} days` : "Duration not set"}
                        </p>
                        <p className="payout-lines">Purchased: {formatWhen(item.lockedAt)}</p>
                        <p className="payout-lines">Claim opens: {formatWhen(item.unlocksAt)}</p>
                        <p className="payout-lines">Requested: {formatWhen(item.claimRequestedAt)}</p>
                      </td>
                      <td>{formatUsdt(item.amountUsdt)} USDT</td>
                      <td>
                        {item.rateConfigured ? (
                          <>
                            <strong>{formatUsdt(item.tokenValue)} tokens</strong>
                            <p className="payout-lines">1 USDT = {formatUsdt(item.tokenRate)} tokens</p>
                          </>
                        ) : (
                          <span className="muted">Token rate is not set</span>
                        )}
                      </td>
                      <td>
                        <p className="payout-lines">{methodLabel(item.claimPayoutMethod)}</p>
                        {payoutLines(item.claimPayout).map(([key, value]) => (
                          <p className="payout-lines" key={key}>
                            {labelize(key)}: {value}
                          </p>
                        ))}
                        {item.claimNote ? <p className="muted">{item.claimNote}</p> : null}
                      </td>
                      <td>
                        {item.claimStatus === "pending" ? (
                          <input
                            className="mini-input"
                            placeholder="Transaction hash"
                            value={hashes[item.id] || ""}
                            onChange={(event) => setHashes((current) => ({ ...current, [item.id]: event.target.value }))}
                          />
                        ) : (
                          item.claimTxHash || "-"
                        )}
                        {item.claimRejectReason ? <p className="muted">{item.claimRejectReason}</p> : null}
                      </td>
                      <td>
                        <span className={`badge ${item.claimStatus || "pending"}`}>{item.claimStatus || "pending"}</span>
                        {item.claimStatus === "pending" ? (
                          <div className="row-actions claim-actions">
                            <button
                              className="gold-btn compact"
                              type="button"
                              disabled={busyId === item.id || !item.rateConfigured}
                              onClick={() => onApprove(item)}
                            >
                              {busyId === item.id ? "Saving..." : "Approve"}
                            </button>
                            <input
                              className="mini-input"
                              placeholder="Reject reason"
                              value={reasons[item.id] || ""}
                              onChange={(event) => setReasons((current) => ({ ...current, [item.id]: event.target.value }))}
                            />
                            <button className="danger-btn" type="button" disabled={busyId === item.id} onClick={() => onReject(item)}>
                              Reject
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
