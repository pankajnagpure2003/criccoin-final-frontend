import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createReferralPlan,
  deleteReferralPlan,
  getReferralPlans,
  getTokenRate,
  saveTokenRate,
  setReferralPlanActive,
  updateReferralPlan,
} from "../api/investment.api.js";
import { logoutAdmin } from "../api/admin.api.js";

const MAX_LEVELS = 20;
const EMPTY_FORM = { name: "", startDate: "", endDate: "", amountUsdt: "", totalPercent: "", active: true };

function percentCents(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return null;
  }
  return Math.round(Number(amount.toFixed(2)) * 100);
}

function formatPercent(cents) {
  return (cents / 100).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function AdminInvestmentSetupPage() {
  const navigate = useNavigate();
  const [tokensPerUsdt, setTokensPerUsdt] = useState("");
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingRate, setSavingRate] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    Promise.all([getTokenRate(), getReferralPlans()])
      .then(([rateData, planData]) => {
        const settings = rateData.settings || {};
        setTokensPerUsdt(settings.configured ? String(settings.tokensPerUsdt) : "");
        setPlans(planData.plans || []);
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

  const planCheck = useMemo(() => {
    const totalCents = percentCents(form.totalPercent);
    const levelCents = levels.map((level) => percentCents(level.percent));
    const sumCents = levelCents.reduce((sum, cents) => sum + (cents || 0), 0);
    const totalOk = totalCents !== null && totalCents >= 0 && totalCents <= 10000;
    const levelsOk =
      totalCents === 0
        ? levels.length === 0
        : levels.length > 0 &&
          levels.length <= MAX_LEVELS &&
          levelCents.every((cents) => cents !== null && cents > 0);
    const amount = Number(form.amountUsdt);
    const amountOk = Number.isFinite(amount) && amount > 0;
    const datesOk = Boolean(form.startDate && form.endDate && form.endDate >= form.startDate);
    return {
      totalCents,
      sumCents,
      exact: totalOk && levelsOk && datesOk && amountOk && sumCents === totalCents && form.name.trim().length > 0,
    };
  }, [form.amountUsdt, form.endDate, form.name, form.startDate, form.totalPercent, levels]);

  function addLevel() {
    setLevels((current) => (current.length >= MAX_LEVELS ? current : [...current, { percent: "" }]));
  }

  function updateLevel(index, percent) {
    setLevels((current) => current.map((level, levelIndex) => (levelIndex === index ? { percent } : level)));
  }

  function removeLevel(index) {
    setLevels((current) => current.filter((_, levelIndex) => levelIndex !== index));
  }

  function resetForm() {
    setEditingId("");
    setForm(EMPTY_FORM);
    setLevels([]);
  }

  function startNew() {
    resetForm();
    setError("");
    setInfo("");
  }

  function startEdit(plan) {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
      amountUsdt: plan.amountUsdt ? String(plan.amountUsdt) : "",
      totalPercent: String(plan.totalPercent),
      active: Boolean(plan.active),
    });
    setLevels((plan.levels || []).map((level) => ({ percent: String(level.percent) })));
    setError("");
    setInfo("");
  }

  async function onSaveRate(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSavingRate(true);
    try {
      const data = await saveTokenRate({ tokensPerUsdt });
      setTokensPerUsdt(String(data.settings.tokensPerUsdt));
      setInfo("Token rate saved. Claims use this rate at the time of claim.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingRate(false);
    }
  }

  async function onSavePlan(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    if (!planCheck.exact) {
      setError("Add a name, amount, valid dates, and level percents that add up to the total.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      amountUsdt: form.amountUsdt,
      totalPercent: form.totalPercent,
      active: form.active,
      levels: levels.map((level) => ({ percent: level.percent })),
    };
    setSavingPlan(true);
    try {
      const data = editingId ? await updateReferralPlan(editingId, payload) : await createReferralPlan(payload);
      setPlans(data.plans || []);
      resetForm();
      setInfo(editingId ? "Plan updated. Existing locks keep their old copy." : "Plan saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPlan(false);
    }
  }

  async function onToggleActive(plan) {
    setError("");
    setInfo("");
    try {
      const data = await setReferralPlanActive(plan.id, !plan.active);
      setPlans(data.plans || []);
      setInfo(plan.active ? `${plan.name} is inactive.` : `${plan.name} is active.`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(plan) {
    if (!window.confirm(`Delete ${plan.name}? Locks already using it stay as they are.`)) {
      return;
    }
    setError("");
    setInfo("");
    try {
      const data = await deleteReferralPlan(plan.id);
      setPlans(data.plans || []);
      if (editingId === plan.id) {
        startNew();
      }
      setInfo("Plan deleted.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="app-content">Loading...</p>;
  }

  const sumLabel = planCheck.totalCents === null ? "-" : `${formatPercent(planCheck.sumCents)}%`;
  const totalLabel = planCheck.totalCents === null ? "-" : `${formatPercent(planCheck.totalCents)}%`;

  return (
    <>
      <header className="topbar">
        <h2>Investment setup</h2>
      </header>
      <div className="app-content">
        <div className="stack">
          {error ? <p className="error">{error}</p> : null}
          {info ? <p className="info">{info}</p> : null}

          <form className="panel stack" onSubmit={onSaveRate}>
            <h3>Token rate</h3>
            <p className="muted">Claim converts locked USDT at the rate active that day. Example: 100 USDT at 1 USDT = 2 tokens pays 200 tokens.</p>
            <label className="field">
              <span>Tokens for 1 USDT</span>
              <input
                inputMode="decimal"
                value={tokensPerUsdt}
                onChange={(event) => setTokensPerUsdt(event.target.value)}
                placeholder="1"
                required
              />
            </label>
            <button className="gold-btn" type="submit" disabled={savingRate}>
              {savingRate ? "Saving..." : "Save token rate"}
            </button>
          </form>

          <div className="panel stack">
            <h3>Referral plans</h3>
            <p className="muted">
              Several plans can stay active together. A user pays each plan's amount exactly, and only while that plan is active and today is between its start and end date. Updating one plan does not change another plan, and locks already made keep their own copy.
            </p>
            {plans.length === 0 ? (
              <p className="muted">No plans yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Levels</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.name}</td>
                        <td>{plan.amountUsdt > 0 ? `${plan.amountUsdt} USDT` : "-"}</td>
                        <td>{plan.startDate && plan.endDate ? `${plan.startDate} to ${plan.endDate}` : "-"}</td>
                        <td>{plan.totalPercent}%</td>
                        <td>{plan.levels.map((level) => `L${level.level} ${level.percent}%`).join(", ") || "-"}</td>
                        <td>
                          {plan.active ? <span className="badge approved">Active</span> : <span className="badge">Inactive</span>}
                          {plan.open ? <p className="muted">Open today</p> : null}
                        </td>
                        <td>
                          <div className="action-row">
                            <button className="gold-btn compact" type="button" onClick={() => onToggleActive(plan)}>
                              {plan.active ? "Deactivate" : "Activate"}
                            </button>
                            <button className="ghost-btn" type="button" onClick={() => startEdit(plan)}>
                              Edit
                            </button>
                            <button className="danger-btn" type="button" onClick={() => onDelete(plan)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form className="panel stack" onSubmit={onSavePlan}>
            <h3>{editingId ? "Edit plan" : "New plan"}</h3>
            <label className="field">
              <span>Plan name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Standard"
                required
              />
            </label>
            <label className="field">
              <span>Start date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>End date</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Amount (USDT)</span>
              <input
                inputMode="decimal"
                value={form.amountUsdt}
                onChange={(event) => setForm((current) => ({ ...current, amountUsdt: event.target.value }))}
                placeholder="100"
                required
              />
            </label>
            <label className="field">
              <span>Total referral percent</span>
              <input
                inputMode="decimal"
                value={form.totalPercent}
                onChange={(event) => setForm((current) => ({ ...current, totalPercent: event.target.value }))}
                placeholder="20"
                required
              />
            </label>
            <div className="stack">
              {levels.map((level, index) => (
                <div className="level-row" key={`level-${index}`}>
                  <label className="field">
                    <span>Level {index + 1} percent</span>
                    <input
                      inputMode="decimal"
                      value={level.percent}
                      onChange={(event) => updateLevel(index, event.target.value)}
                      required
                    />
                  </label>
                  <button className="danger-btn" type="button" onClick={() => removeLevel(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
              />
              <span>Active</span>
            </label>
            <p className="muted">
              Level total {sumLabel}. Plan total {totalLabel}.
              {planCheck.exact ? " Totals match." : " Totals must match before save."}
            </p>
            <div className="action-row">
              <button className="gold-btn compact" type="button" onClick={addLevel} disabled={levels.length >= MAX_LEVELS}>
                Add level
              </button>
              {editingId ? (
                <button className="ghost-btn" type="button" onClick={startNew}>
                  New plan
                </button>
              ) : null}
              <button className="gold-btn compact" type="submit" disabled={savingPlan || !planCheck.exact}>
                {savingPlan ? "Saving..." : editingId ? "Update plan" : "Save plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
