import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const DEMO_MEMBERS = [
  { name: "Aarav Sharma", username: "aarav.demo", amount: 250 },
  { name: "Diya Patel", username: "diya.demo", amount: 500 },
  { name: "Vivaan Singh", username: "vivaan.demo", amount: 1000 },
  { name: "Anaya Verma", username: "anaya.demo", amount: 150 },
  { name: "Advik Gupta", username: "advik.demo", amount: 750 },
  { name: "Ira Mehta", username: "ira.demo", amount: 300 },
  { name: "Reyansh Kumar", username: "reyansh.demo", amount: 1200 },
  { name: "Saanvi Shah", username: "saanvi.demo", amount: 450 },
  { name: "Arjun Reddy", username: "arjun.demo", amount: 900 },
  { name: "Aadhya Joshi", username: "aadhya.demo", amount: 200 },
];

function createDemoMember(person, index, parentId, level) {
  const [firstName, ...lastNameParts] = person.name.split(" ");
  return {
    id: `demo-member-${index + 1}`,
    name: person.name,
    firstName,
    lastName: lastNameParts.join(" "),
    username: person.username,
    email: `${person.username}@example.test`,
    referralCode: `DEMO${String(index + 1).padStart(4, "0")}`,
    isVerified: index % 2 === 0,
    isActive: true,
    level,
    createdAt: new Date(Date.UTC(2026, 0, 5 + index * 3)).toISOString(),
    selfInvestmentUsdt: person.amount,
    teamBusinessUsdt: 0,
    referredBy: parentId,
    children: [],
  };
}

function createDemoTree(tree) {
  const directMembers = DEMO_MEMBERS.slice(0, 5).map((member, index) =>
    createDemoMember(member, index, tree.id, 1)
  );
  const secondLevelMembers = DEMO_MEMBERS.slice(5).map((member, index) =>
    createDemoMember(member, index + 5, directMembers[index].id, 2)
  );

  for (const [index, member] of secondLevelMembers.entries()) {
    directMembers[index].teamBusinessUsdt = member.selfInvestmentUsdt;
    directMembers[index].children = [member];
  }

  return { ...tree, children: directMembers };
}

function matchesFilters(member, filters) {
  if (filters.directOnly && member.level !== 1) {
    return false;
  }
  if (!matchesDate(member.createdAt, filters.fromDate, filters.toDate)) {
    return false;
  }
  const query = filters.username.trim().toLowerCase();
  return !query || [
    member.username,
    member.referralCode,
    member.name,
    member.firstName,
    member.lastName,
    member.email,
  ].filter(Boolean).join(" ").toLowerCase().includes(query);
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

export default function TeamViews({ tree, onDemoModeChange }) {
  const [showDemoData, setShowDemoData] = useState(
    import.meta.env.DEV && (tree?.children?.length || 0) === 0
  );
  const [username, setUsername] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [directOnly, setDirectOnly] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() =>
    import.meta.env.DEV && (tree?.children?.length || 0) === 0
      ? new Set(DEMO_MEMBERS.slice(0, 5).map((_, index) => `demo-member-${index + 1}`))
      : new Set()
  );
  const [filters, setFilters] = useState({ username: "", fromDate: "", toDate: "", directOnly: false });
  const displayTree = useMemo(
    () => (showDemoData && tree ? createDemoTree(tree) : tree),
    [showDemoData, tree]
  );

  useEffect(() => {
    if (import.meta.env.DEV) {
      setShowDemoData((tree?.children?.length || 0) === 0);
    }
  }, [tree?.id]);

  useEffect(() => {
    onDemoModeChange?.(import.meta.env.DEV && showDemoData);
  }, [onDemoModeChange, showDemoData]);

  useEffect(() => {
    if (import.meta.env.DEV && showDemoData) {
      setExpandedIds(new Set(DEMO_MEMBERS.slice(0, 5).map((_, index) => `demo-member-${index + 1}`)));
    }
  }, [showDemoData]);

  const { visibleRows, matchingCount, totalCount } = useMemo(() => {
    const matchingIds = new Set();
    const ancestorIds = new Set();
    let total = 0;

    function inspect(member) {
      let hasMatch = false;
      for (const child of member?.children || []) {
        total += 1;
        const childMatches = matchesFilters(child, filters);
        if (childMatches) {
          matchingIds.add(child.id);
          hasMatch = true;
        }
        if (inspect(child)) {
          ancestorIds.add(child.id);
          hasMatch = true;
        }
      }
      return hasMatch;
    }

    if (displayTree) {
      inspect(displayTree);
    }

    const rows = [];
    function collectVisible(member) {
      for (const child of member?.children || []) {
        if (matchingIds.has(child.id) || ancestorIds.has(child.id)) {
          rows.push(child);
        }
        if (!filters.directOnly && expandedIds.has(child.id)) {
          collectVisible(child);
        }
      }
    }

    collectVisible(displayTree);
    return {
      visibleRows: rows,
      matchingCount: matchingIds.size,
      totalCount: total,
    };
  }, [displayTree, filters, expandedIds]);

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
    setExpandedIds(new Set());
  }

  function toggleMember(memberId) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }

  return (
    <div className="team-views">
      {import.meta.env.DEV ? (
        <div className="team-demo-control">
          <span>{showDemoData ? "Demo: 10 referrals, 5 direct parents" : "Showing live referral data"}</span>
          <button
            type="button"
            className="team-demo-toggle"
            aria-pressed={showDemoData}
            onClick={() => setShowDemoData((current) => !current)}
          >
            {showDemoData ? "Show live data" : "Show demo data"}
          </button>
        </div>
      ) : null}
      <section className="team-level-panel" aria-label="Level Wise Team">
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
              {visibleRows.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="team-member-table-identity" style={{ "--member-depth": member.level - 1 }}>
                      {member.children.length > 0 ? (
                        <button
                          className="team-member-row-toggle"
                          type="button"
                          aria-label={`${expandedIds.has(member.id) ? "Collapse" : "Expand"} referrals for ${member.username || member.name}`}
                          aria-expanded={expandedIds.has(member.id)}
                          disabled={filters.directOnly}
                          onClick={() => toggleMember(member.id)}
                        >
                          {expandedIds.has(member.id)
                            ? <ChevronDown size={15} aria-hidden="true" />
                            : <ChevronRight size={15} aria-hidden="true" />}
                        </button>
                      ) : <span className="team-member-row-spacer" aria-hidden="true" />}
                      <span>{member.username || member.referralCode || "-"}</span>
                    </span>
                  </td>
                  <td>{member.firstName || member.name?.split(/\s+/)[0] || "-"}</td>
                  <td>{member.lastName || member.name?.split(/\s+/).slice(1).join(" ") || "-"}</td>
                  <td>{member.email || "-"}</td>
                  <td><span className="team-level-tag">Level {member.level}</span></td>
                  <td>{formatUsdt(member.selfInvestmentUsdt)}</td>
                  <td>{formatUsdt(member.teamBusinessUsdt)}</td>
                  <td>{formatDate(member.createdAt)}</td>
                </tr>
              ))}
              {matchingCount === 0 ? (
                <tr>
                  <td className="team-level-empty" colSpan="9">
                    {totalCount === 0 ? "No one has joined this team yet." : "No team members match these filters."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="team-level-result-count">Showing {visibleRows.length} rows · {matchingCount} matching of {totalCount} team members</p>
      </section>
    </div>
  );
}
