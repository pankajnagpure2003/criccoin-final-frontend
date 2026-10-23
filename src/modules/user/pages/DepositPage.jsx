import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, TrendingUp, WalletCards } from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import PaymentMethodIcon from "../components/PaymentMethodIcon.jsx";
import { createDeposit, getDepositOptions, getMyDeposits, getWallet, openCryptapiDeposit, refreshCryptapiDeposit } from "../api/deposit.api.js";

const METHOD_HINT = {
  bank_transfer: "Pay from your bank, then submit the UTR. Wallet is credited in USDT after approval.",
  upi: "Pay to the UPI ID, then submit the UPI reference. Wallet is credited in USDT after approval.",
  cryptapi: "Send USDT on the network shown below. The same amount is added to your wallet after blockchain confirmation.",
};

function formatInr(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function formatWhen(value) {
  return new Date(value).toLocaleString();
}

function quote(amount, rate) {
  const fiat = Number(amount);
  const inrPerUsdt = Number(rate);
  if (!(fiat > 0) || !(inrPerUsdt > 0)) {
    return 0;
  }
  return Math.round((fiat / inrPerUsdt) * 1e6) / 1e6;
}

function methodName(id) {
  if (id === "upi") return "UPI";
  if (id === "cryptapi") return "USDT";
  return "Bank transfer";
}

function paidLabel(deposit) {
  if (deposit.method === "cryptapi" || deposit.fiatCurrency === "USDT") {
    return `${formatUsdt(deposit.usdtAmount || deposit.fiatAmount)} USDT`;
  }
  return `${formatInr(deposit.fiatAmount)} ${deposit.fiatCurrency}`;
}

function InstructionList({ method }) {
  if (!method || method.kind === "gateway") {
    return null;
  }

  const rows =
    method.id === "bank_transfer"
      ? [
          ["Account name", method.instructions?.accountName],
          ["Account number", method.instructions?.accountNumber],
          ["IFSC", method.instructions?.ifsc],
          ["Bank", method.instructions?.bankName],
          ["Branch", method.instructions?.branch],
        ]
      : [
          ["UPI ID", method.instructions?.upiId],
          ["Name", method.instructions?.payeeName],
        ];

  const filled = rows.filter(([, value]) => value);
  if (filled.length === 0) {
    return <p className="muted">Payment details are not set yet. Ask admin before you pay.</p>;
  }

  return (
    <dl className="profile-list">
      {filled.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            {value}{" "}
            <button
              type="button"
              className="text-link"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              Copy
            </button>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function DepositPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [rate, setRate] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [methodId, setMethodId] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cryptoSession, setCryptoSession] = useState(null);

  const selected = methods.find((method) => method.id === methodId) || methods[0];
  const estimated = useMemo(() => quote(amount, rate?.inrPerUsdt), [amount, rate]);

  async function load() {
    const [options, walletData, history] = await Promise.all([getDepositOptions(), getWallet(), getMyDeposits()]);
    setMethods(options.methods || []);
    setRate(options.rate || null);
    setWallet(walletData.wallet);
    setDeposits(history.deposits || []);
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

  useEffect(() => {
    if (selected?.id !== "cryptapi") {
      return undefined;
    }

    let active = true;
    async function tick(create) {
      try {
        const data = create ? await openCryptapiDeposit() : await refreshCryptapiDeposit();
        const [walletData, history] = await Promise.all([getWallet(), getMyDeposits()]);
        if (!active) {
          return;
        }
        setCryptoSession(data.session);
        setWallet(walletData.wallet);
        setDeposits(history.deposits || []);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      }
    }

    tick(true);
    const timer = setInterval(() => tick(false), 20000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [selected?.id]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await createDeposit({
        method: selected?.id,
        amount,
        reference,
        note,
      });
      setReference("");
      setNote("");
      setAmount("");
      setInfo("Deposit submitted. USDT will show in your wallet after admin approval.");
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
    <div className="stack deposit-page">
      <div className="stats">
        <article className="stat-card money-summary-card">
          <span className="summary-card-icon"><WalletCards size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Wallet balance</p>
            <strong>{formatUsdt(wallet?.availableUsdt ?? wallet?.balanceUsdt)} USDT</strong>
          </div>
        </article>
        <article className="stat-card money-summary-card">
          <span className="summary-card-icon"><TrendingUp size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Conversion rate</p>
            <strong>{rate?.inrPerUsdt ? `1 USDT = ${formatInr(rate.inrPerUsdt)} INR` : "-"}</strong>
          </div>
        </article>
        <article className="stat-card money-summary-card">
          <span className="summary-card-icon"><CircleDollarSign size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Estimated credit</p>
            <strong>{estimated ? `${formatUsdt(estimated)} USDT` : "-"}</strong>
          </div>
        </article>
      </div>

      <div className="panel">
        <h3>Deposit</h3>
        <p className="muted">Bank transfer and UPI are reviewed manually. USDT deposits confirm on-chain and credit the same amount to your wallet.</p>
        <div className="method-grid">
          {methods.map((method) => (
            <button
              key={method.id}
              type="button"
              className={selected?.id === method.id ? "method-card active" : "method-card"}
              onClick={() => setMethodId(method.id)}
            >
              <PaymentMethodIcon methodId={method.id} />
              <span className="method-card-copy">
                {method.label}
                <small>{method.kind === "gateway" ? method.instructions?.networkLabel || "On-chain" : "Manual approval"}</small>
              </span>
            </button>
          ))}
        </div>
        <p className="muted method-hint">{METHOD_HINT[selected?.id]}</p>
        <InstructionList method={selected} />
        {selected?.id === "cryptapi" ? (
          <div className="stack">
            <p className="muted">
              Network: {cryptoSession?.networkLabel || selected.instructions?.networkLabel}. Send only USDT on this network. Amounts below the minimum can be lost.
            </p>
            {error ? <p className="error">{error}</p> : null}
            {cryptoSession?.addressIn ? (
              <>
                <p>
                  Minimum: <strong>{formatUsdt(cryptoSession.minimumUsdt)} USDT</strong>
                </p>
                <dl className="profile-list">
                  <div>
                    <dt>Deposit address</dt>
                    <dd>
                      {cryptoSession.addressIn}{" "}
                      <button type="button" className="text-link" onClick={() => navigator.clipboard.writeText(cryptoSession.addressIn)}>
                        Copy
                      </button>
                    </dd>
                  </div>
                </dl>
                {cryptoSession.qrCode ? (
                  <img className="qr-shot" src={`data:image/png;base64,${cryptoSession.qrCode}`} alt="USDT deposit QR code" />
                ) : null}
                <p className="muted">Waiting for your transfer. This page checks for a confirmation every few seconds.</p>
              </>
            ) : error ? null : (
              <p className="muted">Preparing your USDT deposit address...</p>
            )}
          </div>
        ) : null}

        {selected?.kind !== "gateway" ? (
        <form className="auth-form deposit-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Amount (INR)</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="1000"
              required
            />
          </label>
          <label className="field">
            <span>{selected?.id === "upi" ? "UPI reference" : "UTR / reference"}</span>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Transaction reference"
              required
            />
          </label>
          <label className="field">
            <span>Note</span>
            <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional" />
          </label>
          {error ? <p className="error">{error}</p> : null}
          {info ? <p className="info">{info}</p> : null}
          <button className="gold-btn" type="submit" disabled={submitting || !selected}>
            {submitting ? "Submitting..." : "Submit for approval"}
          </button>
        </form>
        ) : null}
      </div>

      <div className="panel">
        <h3>Deposit history</h3>
        {deposits.length === 0 ? (
          <p className="muted">No deposits yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Method</th>
                  <th>Paid</th>
                  <th>USDT</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit._id}>
                    <td>{formatWhen(deposit.createdAt)}</td>
                    <td>{methodName(deposit.method)}</td>
                    <td>{paidLabel(deposit)}</td>
                    <td>{deposit.usdtAmount ? `${formatUsdt(deposit.usdtAmount)} USDT` : "-"}</td>
                    <td>{deposit.reference}</td>
                    <td>
                      <span className={`badge ${deposit.status}`}>{deposit.status}</span>
                      {deposit.note ? <p className="muted">{deposit.note}</p> : null}
                      {deposit.rejectReason ? <p className="muted">{deposit.rejectReason}</p> : null}
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
