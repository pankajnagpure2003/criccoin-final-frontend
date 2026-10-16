import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="panel">
      <h3>Profile</h3>
      <dl className="profile-list">
        <div>
          <dt>Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Mobile</dt>
          <dd>{user.mobile || "-"}</dd>
        </div>
        <div>
          <dt>Country</dt>
          <dd>{user.country || "-"}</dd>
        </div>
        <div>
          <dt>Referral code</dt>
          <dd>{user.referralCode}</dd>
        </div>
      </dl>
    </div>
  );
}
