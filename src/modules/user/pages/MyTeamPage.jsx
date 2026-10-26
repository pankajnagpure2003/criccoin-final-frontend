import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Network, UsersRound } from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import TeamViews from "../components/TeamViews.jsx";
import { getMyTeam } from "../api/userAuth.api.js";

export default function MyTeamPage() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState("");
  const [showDemoData, setShowDemoData] = useState(false);

  useEffect(() => {
    if (!authClient.isAuthenticated("user")) {
      navigate("/login");
      return;
    }

    getMyTeam()
      .then(setTeam)
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login");
          return;
        }
        setError(err.message || "Could not load your team.");
      });
  }, [navigate]);

  if (!team && !error) {
    return <p className="app-content dashboard-loading">Loading your team...</p>;
  }

  if (error) {
    return <div className="app-content"><p className="error">{error}</p></div>;
  }

  const summaryItems = [
    { label: "Direct members", value: showDemoData ? 5 : team.summary.directMembers, Icon: UsersRound },
    { label: "Total team", value: showDemoData ? 50 : team.summary.totalMembers, Icon: Network },
    { label: "Verified members", value: showDemoData ? 25 : team.summary.verifiedMembers, Icon: CheckCircle2 },
    { label: "Team levels", value: showDemoData ? 10 : team.summary.levels, Icon: Network },
  ];

  return (
    <div className="my-team-page">
      <header className="my-team-heading">
        <span className="my-team-heading-icon"><Network size={22} aria-hidden="true" /></span>
        <div>
          <p>YOUR REFERRAL NETWORK</p>
          <h1>My Team</h1>
          <span>Explore your direct referrals and the community growing below them.</span>
        </div>
      </header>
      <div className="my-team-stats">
        {summaryItems.map(({ label, value, Icon }) => (
          <article className="my-team-stat" key={label}>
            <span><Icon size={18} aria-hidden="true" /></span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </article>
        ))}
      </div>
      <TeamViews tree={team.tree} onDemoModeChange={setShowDemoData} />
    </div>
  );
}
