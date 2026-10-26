import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Coins, CreditCard, Save, Wallet } from "lucide-react";
import { getDepositSettings, saveDepositSettings } from "../api/deposit.api.js";
import { logoutAdmin } from "../api/admin.api.js";

const EMPTY = {
  inrPerUsdt: "",
  bank: {
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branch: "",
  },
  upi: {
    upiId: "",
    payeeName: "",
  },
  cryptapi: {
    network: "trc20",
    address: "",
  },
};

export default function AdminPaymentSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDepositSettings()
      .then((data) => {
        const settings = data.settings || {};
        setForm({
          inrPerUsdt: settings.inrPerUsdt ?? "",
          bank: { ...EMPTY.bank, ...settings.bank },
          upi: { ...EMPTY.upi, ...settings.upi },
          cryptapi: { ...EMPTY.cryptapi, ...settings.cryptapi },
        });
      })
      .catch((err) => {
        setError(err.message);
        if (err.status === 401) {
          logoutAdmin();
          navigate("/admin/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function setBank(field, value) {
    setForm((current) => ({ ...current, bank: { ...current.bank, [field]: value } }));
  }

  function setUpi(field, value) {
    setForm((current) => ({ ...current, upi: { ...current.upi, [field]: value } }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSaving(true);
    try {
      const data = await saveDepositSettings(form);
      setForm({
        inrPerUsdt: data.settings.inrPerUsdt,
        bank: { ...EMPTY.bank, ...data.settings.bank },
        upi: { ...EMPTY.upi, ...data.settings.upi },
        cryptapi: { ...EMPTY.cryptapi, ...data.settings.cryptapi },
      });
      setInfo("Payment setup saved. New approvals use this INR to USDT rate.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="app-content dashboard-loading">Loading payment settings...</p>;
  }

  return (
    <div className="app-content admin-payment-page">
      <section className="admin-payment-intro">
        <div>
          <p className="admin-payment-eyebrow">PAYMENT CONFIGURATION</p>
          <h1>Manage payment methods</h1>
          <p>Manage the rates and payment details customers see when they deposit.</p>
        </div>
        <div className="admin-payment-status">
          <span className="admin-payment-status-icon"><CheckCircle2 size={18} aria-hidden="true" /></span>
          <span>
            <strong>Configuration</strong>
            <small>Updates apply to new deposits</small>
          </span>
        </div>
      </section>

      <form className="admin-payment-form" onSubmit={onSubmit}>
        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="info">{info}</p> : null}
        <section className="panel admin-payment-card admin-payment-rate">
          <div className="admin-payment-card-heading">
            <span className="admin-payment-icon"><Coins size={20} aria-hidden="true" /></span>
            <div>
              <h2>USDT conversion rate</h2>
              <p>Set the rate used when converting INR deposits into USDT.</p>
            </div>
          </div>
          <div className="admin-payment-rate-control">
            <label className="field">
              <span>INR for 1 USDT</span>
              <span className="admin-payment-input-wrap">
                <span className="admin-payment-input-prefix" aria-hidden="true">INR</span>
                <input
                  inputMode="decimal"
                  value={form.inrPerUsdt}
                  onChange={(event) => setForm((current) => ({ ...current, inrPerUsdt: event.target.value }))}
                  required
                />
              </span>
            </label>
            <p>Users pay in INR. When you approve a deposit, this rate calculates the USDT credited to their wallet. You can still adjust the credited amount for each deposit.</p>
          </div>
        </section>

        <div className="admin-payment-method-grid">
          <section className="panel admin-payment-card">
            <div className="admin-payment-card-heading">
              <span className="admin-payment-icon"><Building2 size={20} aria-hidden="true" /></span>
              <div>
                <h2>Bank transfer</h2>
                <p>Bank details shown to users for deposits.</p>
              </div>
            </div>
            <div className="admin-payment-fields">
              <label className="field">
                <span>Account name</span>
                <input value={form.bank.accountName} onChange={(event) => setBank("accountName", event.target.value)} />
              </label>
              <label className="field">
                <span>Account number</span>
                <input value={form.bank.accountNumber} onChange={(event) => setBank("accountNumber", event.target.value)} />
              </label>
              <label className="field">
                <span>IFSC</span>
                <input value={form.bank.ifsc} onChange={(event) => setBank("ifsc", event.target.value)} />
              </label>
              <label className="field">
                <span>Bank name</span>
                <input value={form.bank.bankName} onChange={(event) => setBank("bankName", event.target.value)} />
              </label>
              <label className="field">
                <span>Branch</span>
                <input value={form.bank.branch} onChange={(event) => setBank("branch", event.target.value)} />
              </label>
            </div>
          </section>

          <section className="panel admin-payment-card">
            <div className="admin-payment-card-heading">
              <span className="admin-payment-icon"><Wallet size={20} aria-hidden="true" /></span>
              <div>
                <h2>USDT deposit wallet</h2>
                <p>Choose a network and add the receiving address.</p>
              </div>
            </div>
            <div className="admin-payment-fields">
              <label className="field">
                <span>Network</span>
                <select
                  value={form.cryptapi.network}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cryptapi: { ...current.cryptapi, network: event.target.value } }))
                  }
                >
                  <option value="trc20">TRC20</option>
                  <option value="erc20">ERC20</option>
                  <option value="bep20">BEP20</option>
                </select>
              </label>
              <label className="field">
                <span>Receiving wallet address</span>
                <input
                  value={form.cryptapi.address}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cryptapi: { ...current.cryptapi, address: event.target.value } }))
                  }
                  placeholder="Your USDT wallet address"
                />
              </label>
            </div>
            <p className="admin-payment-help">Payments are forwarded to this wallet. For automatic confirmations while the deposit page is closed, set <code>PUBLIC_API_URL</code> to a public HTTPS address.</p>
          </section>

          <section className="panel admin-payment-card">
            <div className="admin-payment-card-heading">
              <span className="admin-payment-icon"><CreditCard size={20} aria-hidden="true" /></span>
              <div>
                <h2>UPI</h2>
                <p>UPI payment details shown to users.</p>
              </div>
            </div>
            <div className="admin-payment-fields">
              <label className="field">
                <span>UPI ID</span>
                <input value={form.upi.upiId} onChange={(event) => setUpi("upiId", event.target.value)} />
              </label>
              <label className="field">
                <span>Payee name</span>
                <input value={form.upi.payeeName} onChange={(event) => setUpi("payeeName", event.target.value)} />
              </label>
            </div>
          </section>
        </div>

        <div className="admin-payment-actions">
          <p>Review your details before saving. Changes only affect new deposits.</p>
          <button className="gold-btn compact" type="submit" disabled={saving}>
            <Save size={17} aria-hidden="true" />
            {saving ? "Saving changes..." : "Save payment setup"}
          </button>
        </div>
      </form>
    </div>
  );
}
