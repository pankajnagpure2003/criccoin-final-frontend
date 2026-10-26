import { useMemo, useState } from "react";
import { ListTree, Network } from "lucide-react";
import TeamTree from "./TeamTree.jsx";

function flattenTeam(member, rows = []) {
  for (const child of member?.children || []) {
    rows.push(child);
    flattenTeam(child, rows);
  }
  return rows;
}

function formatUsdt(value) {
  return `${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} USDT`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

function toDayStart(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function toDayEnd(value) {
  return value ? new Date(`${value}T23:59:59.999`) : null;
}

function matchesDate(value, from, to) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return !from && !to;
  }
  const start = toDayStart(from);
  const end = toDayEnd(to);
  return (!start || date >= start) && (!end || date <= end);
}

export default function TeamViews({ tree }) {
  const [activeView, setActiveView] = useState("level");
  const [username, setUsername] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [directOnly, setDirectOnly] = useState(false);
  const [filters, setFilters] = useState({ username: "", fromDate: "", toDate: "", directOnly: false });

  const rows = useMemo(() => flattenTeam(tree), [tree]);
  const filteredRows = useMemo(() => {
    const query = filters.username.trim().toLowerCase();
    return rows.filter((member) => {
      if (filters.directOnly && member.level !== 1) {
        return false;
      }
      if (!matchesDate(member.createdAt, filters.fromDate, filters.toDate)) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [
        member.username,
        member.referralCode,
        member.name,
        member.firstName,
        member.lastName,
        member.email,
      ].filter(Boolean).join(" ").toLowerCase().includes(query);
    });
  }, [filters, rows]);

  function applyFilters(event) {
    event.preventDefault();
    setFilters({ username, fromDate, toDate, directOnly });
  }

  function clearFilters() {
    setUsername("");
    setFromDate("");
    setToDate("");
    setDirectOnly(false);
    setFilters({ username: "", fromDate: "", toDate: "", directOnly: false });
  }

  return (
    <div className="team-views">
      <div className="team-view-tabs" role="tablist" aria-label="Team display">
        <button
          id="team-level-tab"
          className={activeView === "level" ? "team-view-tab active" : "team-view-tab"}
          type="button"
          role="tab"
          aria-selected={activeView === "level"}
          aria-controls="team-level-panel"
          onClick={() => setActiveView("level")}
        >
          <ListTree size={17} aria-hidden="true" />
          Level Wise Team
        </button>
        <button
          id="team-tree-tab"
          className={activeView === "tree" ? "team-view-tab active" : "team-view-tab"}
          type="button"
          role="tab"
          aria-selected={activeView === "tree"}
          aria-controls="team-tree-panel"
          onClick={() => setActiveView("tree")}
        >
          <Network size={17} aria-hidden="true" />
          Team Tree View
        </button>
      </div>

      {activeView === "level" ? (
        <section id="team-level-panel" className="team-level-panel" role="tabpanel" aria-labelledby="team-level-tab">
          <form className="team-level-filters" onSubmit={applyFilters}>
            <label>
              <span className="visually-hidden">Search team member</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Search by username"
              />
            </label>
            <label>
              <span className="visually-hidden">Joined from</span>
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </label>
            <label>
              <span className="visually-hidden">Joined to</span>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
              />
            </label>
            <label className="team-direct-filter">
              <input
                type="checkbox"
                checked={directOnly}
                onChange={(event) => setDirectOnly(event.target.checked)}
              />
              Direct Only
            </label>
            <button className="gold-btn compact" type="submit">Apply filters</button>
            <button className="ghost-btn" type="button" onClick={clearFilters}>Clear</button>
          </form>
          <div className="team-level-table-wrap table-wrap">
            <table className="team-level-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Username</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email ID</th>
                  <th>Level</th>
                  <th>Self Investment</th>
                  <th>Team Business</th>
                  <th>Join Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((member, index) => (
                  <tr key={member.id}>
                    <td>{index + 1}</td>
                    <td>{member.username || member.referralCode || "-"}</td>
                    <td>{member.firstName || member.name?.split(/\s+/)[0] || "-"}</td>
                    <td>{member.lastName || member.name?.split(/\s+/).slice(1).join(" ") || "-"}</td>
                    <td>{member.email || "-"}</td>
                    <td><span className="team-level-tag">Level {member.level}</span></td>
                    <td>{formatUsdt(member.selfInvestmentUsdt)}</td>
                    <td>{formatUsdt(member.teamBusinessUsdt)}</td>
                    <td>{formatDate(member.createdAt)}</td>
                  </tr>
                ))}
                {filteredRows.length === 0 ? (
                  <tr>
                    <td className="team-level-empty" colSpan="9">
                      {rows.length === 0 ? "No one has joined this team yet." : "No team members match these filters."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="team-level-result-count">Showing {filteredRows.length} of {rows.length} team members</p>
        </section>
      ) : (
        <section id="team-tree-panel" className="my-team-tree-card" role="tabpanel" aria-labelledby="team-tree-tab">
          <div className="my-team-tree-heading">
            <div>
              <h2>Referral tree</h2>
              <p>Select a member to expand or collapse their referrals.</p>
            </div>
          </div>
          <TeamTree tree={tree} />
        </section>
      )}
    </div>
  );
}
