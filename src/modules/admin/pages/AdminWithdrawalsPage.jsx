import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../api/admin.api.js";
import { approveWithdrawal, getAdminWithdrawalProof, getAdminWithdrawals, rejectWithdrawal } from "../api/withdrawal.api.js";
import ProofImage from "../../user/components/ProofImage.jsx";

const FILTERS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "", label: "All" },
];

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function methodLabel(id) {
  if (id === "upi") return "UPI";
  if (id === "wallet_address") return "Wallet address";
  if (id === "bank_transfer") return "Bank transfer";
  return id;
}

function payoutLines(payout = {}) {
  return Object.entries(payout).filter(([, value]) => value);
}

function labelize(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

export default function AdminWithdrawalsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [withdrawals, setWithdrawals] = useState([]);
  const [files, setFiles] = useState({});
  const [references, setReferences] = useState({});
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load(nextStatus = status) {
    const data = await getAdminWithdrawals(nextStatus);
    setWithdrawals(data.withdrawals || []);
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
    const file = files[item._id];
    if (!file) {
      setError("Attach the payment screenshot before approving.");
      setInfo("");
      return;
    }
    setError("");
    setInfo("");
    setBusyId(item._id);
    try {
      const formData = new FormData();
      formData.append("proof", file);
      formData.append("reference", references[item._id] || "");
      await approveWithdrawal(item._id, formData);
      setInfo("Withdrawal approved. The screenshot is now visible to the user.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function onReject(item) {
    setError("");
    setInfo("");
    setBusyId(item._id);
    try {
      await rejectWithdrawal(item._id, { reason: reasons[item._id] || "" });
      setInfo("Withdrawal rejected and reserved USDT returned.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  return (
      <div className="app-content stack">
        <div className="filter-row">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
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
          {withdrawals.length === 0 ? (
            <p className="muted">No withdrawals in this list.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Payout</th>
                    <th>Proof</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.user?.name || "-"}
                        <p className="muted">{item.user?.email}</p>
                        {item.note ? <p className="muted">{item.note}</p> : null}
                      </td>
                      <td>{formatUsdt(item.amountUsdt)} USDT</td>
                      <td>
                        <p className="payout-lines">{methodLabel(item.method)}</p>
                        {payoutLines(item.payout).map(([key, value]) => (
                          <p className="payout-lines" key={key}>
                            {labelize(key)}: {value}
                          </p>
                        ))}
                      </td>
                      <td>
                        {item.status === "pending" ? (
                          <div className="stack">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(event) =>
                                setFiles((current) => ({ ...current, [item._id]: event.target.files?.[0] || null }))
                              }
                            />
                            <input
                              className="mini-input"
                              placeholder="Payment reference"
                              value={references[item._id] || ""}
                              onChange={(event) =>
                                setReferences((current) => ({ ...current, [item._id]: event.target.value }))
                              }
                            />
                          </div>
                        ) : item.hasProof ? (
                          <>
                            {item.paymentReference ? <p className="muted">Ref: {item.paymentReference}</p> : null}
                            <ProofImage id={item._id} loader={getAdminWithdrawalProof} />
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {item.status === "pending" ? (
                          <div className="row-actions">
                            <button
                              type="button"
                              className="gold-btn compact"
                              disabled={busyId === item._id}
                              onClick={() => onApprove(item)}
                            >
                              Approve
                            </button>
                            <input
                              className="mini-input"
                              placeholder="Reject reason"
                              value={reasons[item._id] || ""}
                              onChange={(event) =>
                                setReasons((current) => ({ ...current, [item._id]: event.target.value }))
                              }
                            />
                            <button
                              type="button"
                              className="danger-btn"
                              disabled={busyId === item._id}
                              onClick={() => onReject(item)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className={`badge ${item.status}`}>{item.status}</span>
                            {item.rejectReason ? <p className="muted">{item.rejectReason}</p> : null}
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
