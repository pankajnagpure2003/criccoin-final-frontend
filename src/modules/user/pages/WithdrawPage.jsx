import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../api/authClient.js";
import ProofImage from "../components/ProofImage.jsx";
import { getWallet } from "../api/deposit.api.js";
import { createWithdrawal, getMyWithdrawals, getWithdrawalOptions } from "../api/withdrawal.api.js";

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function formatWhen(value) {
  return new Date(value).toLocaleString();
}

function methodLabel(methods, id) {
  return methods.find((method) => method.id === id)?.label || id;
}

function payoutText(payout = {}) {
  return Object.entries(payout)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}: ${value}`)
    .join(" · ");
}

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [methodId, setMethodId] = useState("");
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [payout, setPayout] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selected = methods.find((method) => method.id === methodId) || methods[0];

  async function load() {
    const [options, walletData, history] = await Promise.all([
      getWithdrawalOptions(),
      getWallet(),
      getMyWithdrawals(),
    ]);
    setMethods(options.methods || []);
    setWallet(walletData.wallet);
    setWithdrawals(history.withdrawals || []);
    setMethodId((current) => current || options.methods?.[0]?.id || "");
  }

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  function selectMethod(id) {
    setMethodId(id);
    setPayout({});
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await createWithdrawal({
        method: selected?.id,
        amount,
        note,
        payout,
      });
      setAmount("");
      setNote("");
      setPayout({});
      setInfo("Withdrawal requested. USDT stays reserved until admin sends the payment screenshot.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="stack">
      <div className="stats">
        <article className="stat-card">
          <p>Available</p>
          <strong>{formatUsdt(wallet?.availableUsdt)} USDT</strong>
        </article>
        <article className="stat-card">
          <p>On hold</p>
          <strong>{formatUsdt(wallet?.heldUsdt)} USDT</strong>
        </article>
        <article className="stat-card">
          <p>Wallet</p>
          <strong>{formatUsdt(wallet?.balanceUsdt)} USDT</strong>
        </article>
      </div>

      <div className="panel">
        <h3>Withdraw</h3>
        <p className="muted">
          Choose where you want the payout. The USDT amount is reserved now. After admin pays by bank transfer, UPI, or wallet address, the screenshot appears on this request.
        </p>
        <div className="method-grid">
          {methods.map((method) => (
            <button
              key={method.id}
              type="button"
              className={selected?.id === method.id ? "method-card active" : "method-card"}
              onClick={() => selectMethod(method.id)}
            >
              {method.label}
              <small>Manual payout</small>
            </button>
          ))}
        </div>
        <div className="withdraw-form-box">
          <div className="withdraw-form-heading">
            <h4>Withdrawal details</h4>
            <p>Enter the amount and payout information for your request.</p>
          </div>
          <form className="auth-form deposit-form" onSubmit={onSubmit}>
            <label className="field">
              <span>Amount (USDT)</span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="10"
                required
              />
            </label>
            {(selected?.fields || []).map((field) => (
              <label className="field" key={field.key}>
                <span>{field.label}</span>
                <input
                  value={payout[field.key] || ""}
                  placeholder={field.placeholder || ""}
                  required={field.required}
                  onChange={(event) => setPayout((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              </label>
            ))}
            <label className="field">
              <span>Note</span>
              <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional" />
            </label>
            {error ? <p className="error">{error}</p> : null}
            {info ? <p className="info">{info}</p> : null}
            <button className="gold-btn" type="submit" disabled={submitting || !selected}>
              {submitting ? "Submitting..." : "Request withdrawal"}
            </button>
          </form>
        </div>
      </div>

      <div className="panel">
        <h3>Withdrawal history</h3>
        {withdrawals.length === 0 ? (
          <p className="muted">No withdrawals yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Payout to</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((item) => (
                  <tr key={item._id}>
                    <td>{formatWhen(item.createdAt)}</td>
                    <td>{methodLabel(methods, item.method)}</td>
                    <td>{formatUsdt(item.amountUsdt)} USDT</td>
                    <td>{payoutText(item.payout)}</td>
                    <td>
                      <span className={`badge ${item.status}`}>{item.status}</span>
                      {item.paymentReference ? <p className="muted">Ref: {item.paymentReference}</p> : null}
                      {item.rejectReason ? <p className="muted">{item.rejectReason}</p> : null}
                      {item.hasProof ? <ProofImage id={item._id} /> : null}
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
