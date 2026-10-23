import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, Link2, UsersRound } from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import { getMe } from "../api/userAuth.api.js";

export default function ReferralPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }
    getMe()
      .then(setProfile)
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!profile) {
    return <p>Loading...</p>;
  }

  const shareLink = `${window.location.origin}/signup?ref=${profile.user.referralCode}`;

  async function copy() {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
    } catch {
      setCopyError("Could not copy the link. Please copy it manually.");
      setCopied(false);
    }
  }

  return (
    <div className="panel featured referral-panel">
      <header className="referral-heading">
        <span className="referral-heading-icon"><UsersRound size={22} aria-hidden="true" /></span>
        <div>
          <p className="referral-kicker">GROW THE COMMUNITY</p>
          <h3>Invite friends</h3>
          <p className="referral-description">Share your link and invite people to join Criccoin.</p>
        </div>
      </header>

      <div className="referral-summary">
        <div className="referral-code-card">
          <span>Your referral code</span>
          <strong>{profile.user.referralCode || "-"}</strong>
        </div>
        <div className="referral-count-card">
          <span className="referral-count-icon"><UsersRound size={18} aria-hidden="true" /></span>
          <div>
            <span>People referred</span>
            <strong>{profile.referralCount}</strong>
          </div>
        </div>
      </div>

      <section className="referral-share">
        <div className="referral-share-heading">
          <span className="referral-share-icon"><Link2 size={17} aria-hidden="true" /></span>
          <div>
            <h4>Your invite link</h4>
            <p>Sponsor ID fills automatically when they sign up.</p>
          </div>
        </div>
        <div className="referral-link-row">
          <code className="share-link">{shareLink}</code>
          <button className="gold-btn compact referral-copy-button" type="button" onClick={copy}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <p className={`referral-copy-feedback${copyError ? " is-error" : ""}`} aria-live="polite">
          {copyError || (copied ? "Invite link copied to clipboard." : "")}
        </p>
      </section>
    </div>
  );
}
