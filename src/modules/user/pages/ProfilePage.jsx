import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Globe2, Hash, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import { getMe } from "../api/userAuth.api.js";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const profileItems = [
    { label: "Full name", value: user.name || "-", Icon: UserRound },
    { label: "Email address", value: user.email || "-", Icon: Mail },
    { label: "Mobile number", value: user.mobile || "-", Icon: Phone },
    { label: "Country", value: user.country || "-", Icon: MapPin },
    { label: "Referral code", value: user.referralCode || "-", Icon: Hash },
  ];

  return (
    <div className="panel profile-panel">
      <header className="profile-heading">
        <span className="profile-avatar" aria-hidden="true">
          {user.name?.trim()?.charAt(0)?.toUpperCase() || <UserRound size={26} />}
        </span>
        <div className="profile-heading-copy">
          <p className="profile-kicker">ACCOUNT OVERVIEW</p>
          <h3>{user.name || "Your profile"}</h3>
          <p>{user.email || "Your personal account details"}</p>
        </div>
        <span className={`profile-status${user.isVerified ? " is-verified" : " is-pending"}`}>
          <BadgeCheck size={16} aria-hidden="true" />
          {user.isVerified ? "Verified" : "Pending"}
        </span>
      </header>

      <section className="profile-info-section" aria-labelledby="profile-info-title">
        <div className="profile-info-heading">
          <Globe2 size={17} aria-hidden="true" />
          <h4 id="profile-info-title">Personal information</h4>
        </div>
        <dl className="profile-info-grid">
          {profileItems.map(({ label, value, Icon }) => (
            <div className="profile-info-card" key={label}>
              <span className="profile-info-icon"><Icon size={18} aria-hidden="true" /></span>
              <div>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
