import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../api/authClient.js";
import { claimInvestment, createInvestment, getInvestments } from "../api/investment.api.js";

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function formatWhen(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

function canClaim(investment) {
  return investment.status === "locked" && new Date(investment.unlocksAt).getTime() <= Date.now();
}

function LockAction({ investment, claimingId, onClaim }) {
  if (investment.status !== "locked") {
    return <span className="muted">Claimed</span>;
  }

  const ready = canClaim(investment);
  return (
    <button
      className="gold-btn compact"
      type="button"
      disabled={!ready || claimingId === investment.id}
      onClick={() => onClaim(investment.id)}
    >
      {claimingId === investment.id ? "Claiming..." : ready ? "Claim" : "Purchased"}
    </button>
  );
}

export default function InvestPage() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [tokenRate, setTokenRate] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [lockedUsdt, setLockedUsdt] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claimingId, setClaimingId] = useState("");

  function applyPayload(data) {
    setInvestments(data.investments || []);
    setWallet(data.wallet || null);
    setTokenRate(data.tokenRate || null);
    setPlans(data.plans || []);
    setSelectedPlanId((current) => {
      const nextPlans = data.plans || [];
      const currentPlan = nextPlans.find((plan) => plan.id === current);
      if (currentPlan?.open) {
        return current;
      }
      return nextPlans.find((plan) => plan.open)?.id || "";
    });
    setLockedUsdt(data.lockedUsdt || 0);
  }

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }

    getInvestments()
      .then(applyPayload)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      const data = await createInvestment({ planId: selectedPlanId });
      applyPayload(data);
      setInfo(
        data.investment?.referralPlan?.durationDays
          ? `USDT purchased in ${data.investment.referralPlan.name} for ${data.investment.referralPlan.durationDays} days.`
          : "USDT purchased."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onClaim(id) {
    setError("");
    setInfo("");
    setClaimingId(id);
    try {
      const data = await claimInvestment(id);
      applyPayload(data);
      const claimed = (data.investments || []).find((investment) => investment.id === id);
      setInfo(claimed?.tokensCredited ? `${formatUsdt(claimed.tokensCredited)} tokens added.` : "Tokens claimed.");
    } catch (err) {
      setError(err.message);
    } finally {
      setClaimingId("");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const rateText = tokenRate?.configured ? `${formatUsdt(tokenRate.tokensPerUsdt)} tokens` : "Not set yet";
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) || null;

  return (
    <div className="stack">
      {error ? <p className="error">{error}</p> : null}
      {info ? <p className="info">{info}</p> : null}
      <div className="stats">
        <article className="stat-card featured">
          <p>Available</p>
          <strong>{wallet ? `${formatUsdt(wallet.availableUsdt)} USDT` : "-"}</strong>
        </article>
        <article className="stat-card">
          <p>Purchased</p>
          <strong>{formatUsdt(lockedUsdt)} USDT</strong>
        </article>
        <article className="stat-card">
          <p>Token balance</p>
          <strong>{wallet ? formatUsdt(wallet.tokenBalance) : "-"}</strong>
        </article>
        <article className="stat-card">
          <p>Rate today</p>
          <strong>{rateText}</strong>
        </article>
      </div>

      <div className="panel">
        <h3>Purchase</h3>
        <p className="muted">
          Pick a plan. The purchase uses that plan's amount exactly. Claim opens after the plan duration, counted from the purchase. You can purchase more than one plan. On claim, tokens = purchased USDT × the token rate that day. Referral does not reduce this amount.
        </p>
        {plans.length === 0 ? <p className="error">No active plan yet.</p> : null}
        {plans.length > 0 ? (
          <div className="method-grid">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={selectedPlanId === plan.id ? "method-card active" : "method-card"}
                disabled={!plan.open}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {plan.name}
                <small>
                  {plan.amountUsdt > 0 ? `${formatUsdt(plan.amountUsdt)} USDT` : "Amount not set"}
                  {" · "}
                  {plan.durationDays > 0 ? `${plan.durationDays} days` : "Duration not set"}
                  {" · "}
                  {plan.totalPercent}% referral
                </small>
              </button>
            ))}
          </div>
        ) : null}
        <form className="auth-form deposit-form" onSubmit={onSubmit}>
          {selectedPlan ? (
            <p>
              You will purchase <strong>{formatUsdt(selectedPlan.amountUsdt)} USDT</strong> in {selectedPlan.name} for {selectedPlan.durationDays} days.
            </p>
          ) : null}
          <button className="gold-btn" type="submit" disabled={submitting || !selectedPlan}>
            {submitting ? "Purchasing..." : selectedPlan ? `Purchase ${formatUsdt(selectedPlan.amountUsdt)} USDT` : "Choose a plan"}
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Purchases</h3>
        {investments.length === 0 ? (
          <p className="muted">No purchases yet.</p>
        ) : (
          <>
            <div className="lock-table table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Purchased</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Duration</th>
                    <th>Claim date</th>
                    <th>Status</th>
                    <th>Tokens</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id}>
                      <td>{formatWhen(investment.lockedAt)}</td>
                      <td>{investment.referralPlan?.name || "-"}</td>
                      <td>{formatUsdt(investment.amountUsdt)} USDT</td>
                      <td>{investment.referralPlan?.durationDays ? `${investment.referralPlan.durationDays} days` : "-"}</td>
                      <td>{formatWhen(investment.unlocksAt)}</td>
                      <td>
                        <span className={`badge ${investment.status}`}>{investment.status === "locked" ? "Purchased" : "Claimed"}</span>
                      </td>
                      <td>{investment.tokensCredited ? formatUsdt(investment.tokensCredited) : "-"}</td>
                      <td>
                        <LockAction investment={investment} claimingId={claimingId} onClaim={onClaim} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lock-cards">
              {investments.map((investment) => (
                <article className="lock-card" key={investment.id}>
                  <div className="lock-card-head">
                    <div>
                      <p className="muted">Plan</p>
                      <strong>{investment.referralPlan?.name || "-"}</strong>
                    </div>
                    <span className={`badge ${investment.status}`}>{investment.status === "locked" ? "Purchased" : "Claimed"}</span>
                  </div>
                  <div className="lock-card-grid">
                    <div>
                      <span>Amount</span>
                      <strong>{formatUsdt(investment.amountUsdt)} USDT</strong>
                    </div>
                    <div>
                      <span>Tokens</span>
                      <strong>{investment.tokensCredited ? formatUsdt(investment.tokensCredited) : "-"}</strong>
                    </div>
                    <div>
                      <span>Purchased</span>
                      <strong>{formatWhen(investment.lockedAt)}</strong>
                    </div>
                    <div>
                      <span>Duration</span>
                      <strong>{investment.referralPlan?.durationDays ? `${investment.referralPlan.durationDays} days` : "-"}</strong>
                    </div>
                    <div>
                      <span>Claim date</span>
                      <strong>{formatWhen(investment.unlocksAt)}</strong>
                    </div>
                  </div>
                  <LockAction investment={investment} claimingId={claimingId} onClaim={onClaim} />
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
