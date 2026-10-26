import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Network, Search, UsersRound } from "lucide-react";
import { authClient } from "../../../api/authClient.js";
import TeamViews from "../../user/components/TeamViews.jsx";
import { getAdminTeam, getUsers, logoutAdmin } from "../api/admin.api.js";

function memberLabel(user) {
  return `${user.name || "User"} · ${user.referralCode || user.email}`;
}

export default function AdminTeamPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState(null);
  const [showDemoData, setShowDemoData] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authClient.isAuthenticated("admin")) {
      navigate("/admin/login");
      return;
    }

    getUsers()
      .then((data) => {
        const nextUsers = data.users || [];
        setUsers(nextUsers);
        setSelectedId((current) => current || nextUsers[0]?._id || "");
      })
      .catch((err) => {
        setError(err.message || "Could not load users.");
        if (err.status === 401) {
          logoutAdmin();
          navigate("/admin/login");
        }
      })
      .finally(() => setLoadingUsers(false));
  }, [navigate]);

  useEffect(() => {
    if (!selectedId) {
      setTeam(null);
      return;
    }

    let cancelled = false;
    setLoadingTeam(true);
    setError("");
    getAdminTeam(selectedId)
      .then((data) => {
        if (!cancelled) {
          setTeam(data);
        }
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setError(err.message || "Could not load this referral team.");
        setTeam(null);
        if (err.status === 401) {
          logoutAdmin();
          navigate("/admin/login");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingTeam(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, selectedId]);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter((user) =>
      [user.name, user.email, user.referralCode, user.mobile].filter(Boolean).join(" ").toLowerCase().includes(query)
    );
  }, [search, users]);

  const selectedUser = users.find((user) => user._id === selectedId);
  const userOptions =
    selectedUser && !visibleUsers.some((user) => user._id === selectedUser._id)
      ? [selectedUser, ...visibleUsers]
      : visibleUsers;
  const summaryItems = [
    { label: "Direct members", value: showDemoData ? 5 : team?.summary.directMembers ?? "-", Icon: UsersRound },
    { label: "Total team", value: showDemoData ? 50 : team?.summary.totalMembers ?? "-", Icon: Network },
    { label: "Verified members", value: showDemoData ? 25 : team?.summary.verifiedMembers ?? "-", Icon: CheckCircle2 },
    { label: "Team levels", value: showDemoData ? 10 : team?.summary.levels ?? "-", Icon: Network },
  ];

  return (
    <div className="app-content my-team-page admin-my-team-page">
      <header className="my-team-heading">
        <span className="my-team-heading-icon"><Network size={22} aria-hidden="true" /></span>
        <div>
          <p>REFERRAL NETWORK MANAGEMENT</p>
          <h1>My Team</h1>
          <span>Choose a user to inspect their referral tree.</span>
        </div>
      </header>

      <section className="my-team-root-picker">
        <label className="field">
          <span>Search user</span>
          <span className="my-team-search-input">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, mobile or referral code"
            />
          </span>
        </label>
        <label className="field">
          <span>Select team owner</span>
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            disabled={loadingUsers || visibleUsers.length === 0}
          >
            <option value="">{loadingUsers ? "Loading users..." : "Select a user"}</option>
            {userOptions.map((user) => (
              <option value={user._id} key={user._id}>{memberLabel(user)}</option>
            ))}
          </select>
        </label>
        {selectedUser ? (
          <span className="my-team-selected-user">Viewing: {memberLabel(selectedUser)}</span>
        ) : null}
      </section>

      {error ? <p className="error">{error}</p> : null}
      {loadingTeam ? <p className="dashboard-loading">Loading referral tree...</p> : null}
      {!loadingUsers && users.length === 0 && !error ? <p className="muted">No users are available yet.</p> : null}
      {!loadingTeam && team ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}
