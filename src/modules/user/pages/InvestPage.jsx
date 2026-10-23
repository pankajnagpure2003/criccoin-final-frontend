import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, PackageOpen, ShoppingBag, TrendingUp, WalletCards, X } from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import PaymentMethodIcon from "../components/PaymentMethodIcon.jsx";
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

function canRequestClaim(investment) {
  return investment.status === "locked" && investment.claimStatus !== "pending" && new Date(investment.unlocksAt).getTime() <= Date.now();
}

function claimBadgeClass(investment) {
  if (investment.status === "claimed") return "claimed";
  if (investment.claimStatus === "pending") return "pending";
  if (investment.claimStatus === "rejected") return "rejected";
  return "locked";
}

function claimBadgeText(investment) {
  if (investment.status === "claimed") return "Claimed";
  if (investment.claimStatus === "pending") return "Requested";
  if (investment.claimStatus === "rejected") return "Rejected";
  return "Purchased";
}

function LockAction({ investment, onClaim }) {
  if (investment.status === "claimed") {
    return <span className="muted">Claimed</span>;
  }
  if (investment.claimStatus === "pending") {
    return <span className="muted">Requested</span>;
  }

  const ready = canRequestClaim(investment);
  return (
    <button className="gold-btn compact" type="button" disabled={!ready} onClick={() => onClaim(investment.id)}>
      {ready ? "Claim" : "Purchased"}
    </button>
  );
}

export default function InvestPage() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [tokenRate, setTokenRate] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [claimTargetId, setClaimTargetId] = useState("");
  const [methodId, setMethodId] = useState("");
  const [payout, setPayout] = useState({});
  const [claimNote, setClaimNote] = useState("");
  const [claimError, setClaimError] = useState("");
  const [lockedUsdt, setLockedUsdt] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(false);

  function applyPayload(data) {
    setInvestments(data.investments || []);
    setWallet(data.wallet || null);
    setTokenRate(data.tokenRate || null);
    setPlans(data.plans || []);
    setPayoutMethods(data.payoutMethods || []);
    setMethodId((current) => current || data.payoutMethods?.[0]?.id || "");
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

  function closeClaim() {
    if (claiming) {
      return;
    }
    setClaimTargetId("");
    setClaimError("");
  }

  function openClaim(id) {
    setClaimTargetId(id);
    setPayout({});
    setClaimNote("");
    setClaimError("");
    setInfo("");
  }

  useEffect(() => {
    if (!claimTargetId) {
      return undefined;
    }
    function onKey(event) {
      if (event.key === "Escape") {
        closeClaim();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [claimTargetId, claiming]);

  async function onClaim(event) {
    event.preventDefault();
    setClaimError("");
    setInfo("");
    setClaiming(true);
    try {
      const data = await claimInvestment(claimTargetId, { method: methodId, payout, note: claimNote });
      applyPayload(data);
      setClaimTargetId("");
      setPayout({});
      setClaimNote("");
      setInfo("Claim request sent. Tokens are added after admin pays and submits the transaction hash.");
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaiming(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const rateText = tokenRate?.configured ? `${formatUsdt(tokenRate.tokensPerUsdt)} tokens` : "Not set yet";
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) || null;
  const claimTarget = investments.find((investment) => investment.id === claimTargetId) || null;
  const selectedMethod = payoutMethods.find((method) => method.id === methodId) || payoutMethods[0];
  const claimTokens =
    claimTarget && tokenRate?.configured ? formatUsdt(Number(claimTarget.amountUsdt) * Number(tokenRate.tokensPerUsdt)) : "";

  return (
    <div className="stack">
      {error ? <p className="error">{error}</p> : null}
      {info ? <p className="info">{info}</p> : null}
      <div className="stats">
        <article className="stat-card featured money-summary-card">
          <span className="summary-card-icon"><WalletCards size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Available</p>
            <strong>{wallet ? `${formatUsdt(wallet.availableUsdt)} USDT` : "-"}</strong>
          </div>
        </article>
        <article className="stat-card money-summary-card">
          <span className="summary-card-icon"><ShoppingBag size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Purchased</p>
            <strong>{formatUsdt(lockedUsdt)} USDT</strong>
          </div>
        </article>
        <article className="stat-card money-summary-card">
          <span className="summary-card-icon"><Coins size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Token balance</p>
            <strong>{wallet ? formatUsdt(wallet.tokenBalance) : "-"}</strong>
          </div>
        </article>
        <article className="stat-card money-summary-card">
          <span className="summary-card-icon"><TrendingUp size={21} aria-hidden="true" /></span>
          <div className="summary-card-copy">
            <p>Rate today</p>
            <strong>{rateText}</strong>
          </div>
        </article>
      </div>

      <div className="panel">
        <h3>Purchase</h3>
        <p className="muted">
          Pick a plan. The purchase uses that plan's amount exactly. When the duration ends, Claim sends a request to admin. Admin pays manually, submits the transaction hash, and the tokens are credited at the rate active that day. Referral does not reduce this amount.
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
                <PackageOpen size={21} aria-hidden="true" />
                <span className="method-card-copy">
                  <strong>{plan.name}</strong>
                  <small>
                    {plan.amountUsdt > 0 ? `${formatUsdt(plan.amountUsdt)} USDT` : "Amount not set"}
                    {" · "}
                    {plan.durationDays > 0 ? `${plan.durationDays} days` : "Duration not set"}
                    {" · "}
                    {plan.totalPercent}% referral
                  </small>
                </span>
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

      {claimTarget ? (
        <div className="claim-modal" role="presentation" onClick={closeClaim}>
          <div
            className="claim-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-request-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="claim-dialog-close" type="button" aria-label="Close" onClick={closeClaim} disabled={claiming}>
              <X size={18} />
            </button>
            <h3 id="claim-request-title">Claim request</h3>
            <p className="muted">
              {claimTarget.referralPlan?.name || "Plan"} · {formatUsdt(claimTarget.amountUsdt)} USDT
              {claimTokens ? ` · about ${claimTokens} tokens at today's rate` : ""}. Add the payment details admin should use. The final token amount uses the rate when admin approves.
            </p>
            {claimTarget.claimStatus === "rejected" && claimTarget.claimRejectReason ? (
              <p className="error">{claimTarget.claimRejectReason}</p>
            ) : null}
            <div className="method-grid">
              {payoutMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={selectedMethod?.id === method.id ? "method-card active" : "method-card"}
                  onClick={() => {
                    setMethodId(method.id);
                    setPayout({});
                  }}
                >
                  <PaymentMethodIcon methodId={method.id} />
                  <span className="method-card-copy">
                    {method.label}
                    <small>Payout details</small>
                  </span>
                </button>
              ))}
            </div>
            <form className="auth-form deposit-form" onSubmit={onClaim}>
              {(selectedMethod?.fields || []).map((field) => (
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
                <input value={claimNote} onChange={(event) => setClaimNote(event.target.value)} placeholder="Optional" />
              </label>
              {claimError ? <p className="error">{claimError}</p> : null}
              <div className="action-row">
                <button className="gold-btn compact" type="submit" disabled={claiming || !selectedMethod}>
                  {claiming ? "Sending..." : "Send claim request"}
                </button>
                <button className="ghost-btn" type="button" onClick={closeClaim}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

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
                    <th>Transaction hash</th>
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
                        <span className={`badge ${claimBadgeClass(investment)}`}>{claimBadgeText(investment)}</span>
                        {investment.claimRejectReason && investment.claimStatus === "rejected" ? (
                          <p className="muted">{investment.claimRejectReason}</p>
                        ) : null}
                      </td>
                      <td>{investment.tokensCredited ? formatUsdt(investment.tokensCredited) : "-"}</td>
                      <td>{investment.claimTxHash || "-"}</td>
                      <td>
                        <LockAction investment={investment} onClaim={openClaim} />
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
                    <span className={`badge ${claimBadgeClass(investment)}`}>{claimBadgeText(investment)}</span>
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
                  {investment.claimTxHash ? (
                    <p className="muted">Transaction hash: {investment.claimTxHash}</p>
                  ) : null}
                  {investment.claimRejectReason && investment.claimStatus === "rejected" ? (
                    <p className="muted">{investment.claimRejectReason}</p>
                  ) : null}
                  <LockAction investment={investment} onClaim={openClaim} />
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
