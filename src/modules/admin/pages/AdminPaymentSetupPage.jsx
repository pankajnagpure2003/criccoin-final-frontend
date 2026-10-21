import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    return <p className="app-content">Loading...</p>;
  }

  return (
    <>
      <header className="topbar">
        <h2>Payment setup</h2>
      </header>
      <div className="app-content">
        <form className="stack" onSubmit={onSubmit}>
          <div className="panel">
            <h3>USDT conversion</h3>
            <p className="muted">User pays in INR. On approval, this rate converts that amount into USDT for the wallet. You can still edit the USDT amount on each deposit.</p>
            <label className="field">
              <span>INR for 1 USDT</span>
              <input
                inputMode="decimal"
                value={form.inrPerUsdt}
                onChange={(event) => setForm((current) => ({ ...current, inrPerUsdt: event.target.value }))}
                required
              />
            </label>
          </div>
          <div className="panel">
            <h3>Bank transfer</h3>
            <div className="auth-form">
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
          </div>
          <div className="panel">
            <h3>USDT deposit wallet</h3>
            <p className="muted">
              Users send USDT to a CryptAPI address, and it is forwarded here. Set PUBLIC_API_URL to a public HTTPS address so payments can confirm while the deposit page is closed.
            </p>
            <div className="auth-form">
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
                <span>Receiving USDT address</span>
                <input
                  value={form.cryptapi.address}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cryptapi: { ...current.cryptapi, address: event.target.value } }))
                  }
                  placeholder="Your USDT wallet address"
                />
              </label>
            </div>
          </div>
          <div className="panel">
            <h3>UPI</h3>
            <div className="auth-form">
              <label className="field">
                <span>UPI ID</span>
                <input value={form.upi.upiId} onChange={(event) => setUpi("upiId", event.target.value)} />
              </label>
              <label className="field">
                <span>Payee name</span>
                <input value={form.upi.payeeName} onChange={(event) => setUpi("payeeName", event.target.value)} />
              </label>
            </div>
          </div>
          {error ? <p className="error">{error}</p> : null}
          {info ? <p className="info">{info}</p> : null}
          <button className="gold-btn compact" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save setup"}
          </button>
        </form>
      </div>
    </>
  );
}
