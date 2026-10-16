import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../api/authClient.js";
import { getMe, logoutUser } from "../api/userAuth.api.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }

    getMe()
      .then(setProfile)
      .catch((err) => {
        setError(err.message);
        logoutUser();
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="panel">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="stats">
        <article className="stat-card">
          <p>Referral code</p>
          <strong>{profile.user.referralCode}</strong>
        </article>
        <article className="stat-card">
          <p>People referred</p>
          <strong>{profile.referralCount}</strong>
        </article>
        <article className="stat-card">
          <p>Status</p>
          <strong>{profile.user.isVerified ? "Verified" : "Pending"}</strong>
        </article>
      </div>
      <div className="panel">
        <h3>Account</h3>
        <p>
          {profile.user.name} · {profile.user.email}
        </p>
        <p className="muted">
          {profile.user.mobile} · {profile.user.country}
        </p>
      </div>
    </div>
  );
}
