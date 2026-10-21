import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../api/authClient.js";
import { getMe } from "../api/userAuth.api.js";

export default function ReferralPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

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
    await navigator.clipboard.writeText(shareLink);
  }

  return (
    <div className="panel featured">
      <h3>Referral</h3>
      <p>
        Your code: <strong className="gold-text">{profile.user.referralCode}</strong>
      </p>
      <p>People referred: {profile.referralCount}</p>
      <p className="muted">Share this signup link. Sponsor ID will fill automatically.</p>
      <code className="share-link">{shareLink}</code>
      <button className="gold-btn compact" type="button" onClick={copy}>
        Copy link
      </button>
    </div>
  );
}
