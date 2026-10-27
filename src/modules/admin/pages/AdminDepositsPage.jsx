import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleArrowDown, CircleCheck, CircleX, Clock3, Layers3 } from "lucide-react";
import { approveDeposit, getAdminDeposits, rejectDeposit } from "../api/deposit.api.js";
import { logoutAdmin } from "../api/admin.api.js";

const FILTERS = [
  { id: "pending", label: "Pending", Icon: Clock3 },
  { id: "approved", label: "Approved", Icon: CircleCheck },
  { id: "rejected", label: "Rejected", Icon: CircleX },
  { id: "", label: "All", Icon: Layers3 },
];

function formatInr(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function quote(amount, rate) {
  const fiat = Number(amount);
  const inrPerUsdt = Number(rate);
  if (!(fiat > 0) || !(inrPerUsdt > 0)) {
    return "";
  }
  return String(Math.round((fiat / inrPerUsdt) * 1e6) / 1e6);
}

export default function AdminDepositsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [deposits, setDeposits] = useState([]);
  const [rate, setRate] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load(nextStatus = status) {
    const data = await getAdminDeposits(nextStatus);
    const nextRate = data.rate?.inrPerUsdt;
    setDeposits(data.deposits || []);
    setRate(data.rate || null);
    setDrafts((current) => {
      const next = { ...current };
      for (const deposit of data.deposits || []) {
        if (deposit.status === "pending" && next[deposit._id] === undefined) {
          next[deposit._id] = quote(deposit.fiatAmount, nextRate);
        }
      }
      return next;
    });
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

  async function onApprove(deposit) {
    setError("");
    setInfo("");
    setBusyId(deposit._id);
    try {
      await approveDeposit(deposit._id, { usdtAmount: drafts[deposit._id] });
      setInfo("Deposit approved and USDT credited to the user wallet.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function onReject(deposit) {
    setError("");
    setInfo("");
    setBusyId(deposit._id);
    try {
      await rejectDeposit(deposit._id, { reason: reasons[deposit._id] || "" });
      setInfo("Deposit rejected.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  return (
      <div className="app-content stack admin-request-page admin-deposit-page">
        <header className="admin-request-heading">
          <span className="admin-request-icon deposit-request-icon">
            <CircleArrowDown size={25} aria-hidden="true" />
          </span>
          <div>
            <p className="admin-request-eyebrow">PAYMENT OPERATIONS</p>
            <h1>Deposit requests</h1>
            <p>Review incoming payments, verify details, and credit USDT to user wallets.</p>
          </div>
          <span className="admin-request-count">{deposits.length} requests shown</span>
        </header>
        <p className="admin-page-note admin-request-rate">
          {rate?.inrPerUsdt ? `Current conversion rate: 1 USDT = ${formatInr(rate.inrPerUsdt)} INR` : "Set the conversion rate"}
        </p>
        <div className="filter-row admin-request-filters" aria-label="Filter deposits by status">
          {FILTERS.map(({ id, label, Icon }) => (
            <button
              key={label}
              type="button"
              className={status === id ? "ghost-btn active" : "ghost-btn"}
              onClick={() => setStatus(id)}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="info">{info}</p> : null}
        <div className="panel admin-request-panel">
          {deposits.length === 0 ? (
            <div className="admin-request-empty">
              <strong>No deposits to show</strong>
              <span>There are no deposit requests in this status.</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="admin-request-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Method</th>
                    <th>Paid</th>
                    <th>Reference</th>
                    <th>USDT credit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit._id}>
                      <td>
                        {deposit.user?.name || "-"}
                        <p className="muted">{deposit.user?.email}</p>
                      </td>
                      <td>{deposit.method === "upi" ? "UPI" : deposit.method === "cryptapi" ? "USDT" : "Bank transfer"}</td>
                      <td>
                        {deposit.fiatCurrency === "USDT" ? `${formatUsdt(deposit.fiatAmount)} USDT` : `${formatInr(deposit.fiatAmount)} ${deposit.fiatCurrency}`}
                      </td>
                      <td>
                        {deposit.reference}
                        {deposit.note ? <p className="muted">{deposit.note}</p> : null}
                      </td>
                      <td>
                        {deposit.status === "pending" && deposit.method !== "cryptapi" ? (
                          <input
                            className="mini-input"
                            inputMode="decimal"
                            value={drafts[deposit._id] || ""}
                            onChange={(event) =>
                              setDrafts((current) => ({ ...current, [deposit._id]: event.target.value }))
                            }
                          />
                        ) : (
                          deposit.usdtAmount ? `${formatUsdt(deposit.usdtAmount)} USDT` : "-"
                        )}
                      </td>
                      <td>
                        {deposit.status === "pending" && deposit.method !== "cryptapi" ? (
                          <div className="row-actions">
                            <button
                              type="button"
                              className="gold-btn compact"
                              disabled={busyId === deposit._id}
                              onClick={() => onApprove(deposit)}
                            >
                              Approve
                            </button>
                            <input
                              className="mini-input"
                              placeholder="Reject reason"
                              value={reasons[deposit._id] || ""}
                              onChange={(event) =>
                                setReasons((current) => ({ ...current, [deposit._id]: event.target.value }))
                              }
                            />
                            <button
                              type="button"
                              className="danger-btn"
                              disabled={busyId === deposit._id}
                              onClick={() => onReject(deposit)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className={`badge ${deposit.status}`}>{deposit.status}</span>
                            {deposit.rejectReason ? <p className="muted">{deposit.rejectReason}</p> : null}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
