import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, FileText, RotateCcw, Search, UsersRound } from "lucide-react";
import logoImg from "../../../assets/criccoin-logo-trans.png";
import { COUNTRIES } from "../../user/data/countries.js";
import { getUsers, logoutAdmin, quickLoginUser, updateUser } from "../api/admin.api.js";

const PAGE_SIZES = [10, 25, 50];

const SEARCH_TARGETS = [
  { id: "general", label: "General Registry Search", placeholder: "Filter general text fields..." },
  { id: "name", label: "Name", placeholder: "Search by name..." },
  { id: "email", label: "Email", placeholder: "Search by email..." },
  { id: "mobile", label: "Mobile", placeholder: "Search by mobile..." },
  { id: "country", label: "Country", placeholder: "Search by country..." },
  { id: "referral", label: "Referral code", placeholder: "Search by referral code..." },
  { id: "sponsor", label: "Sponsor", placeholder: "Search by sponsor..." },
  { id: "registered", label: "Registration date", placeholder: "Search by registration date..." },
  { id: "investment", label: "Total investment", placeholder: "Search by total investment..." },
  { id: "status", label: "Status", placeholder: "Active or deactive..." },
];

const EXPORT_COLUMNS = [
  "Name",
  "Email",
  "Mobile",
  "Country",
  "Verified",
  "Status",
  "Referral",
  "Sponsor",
  "Registration date",
  "Total investment",
];

function formatDate(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function statusLabel(user) {
  return user.isActive === false ? "Deactive" : "Active";
}

function searchText(user, target) {
  const date = formatDate(user.createdAt);
  const total = formatUsdt(user.totalInvestmentUsdt);
  const sponsor = [user.referredBy?.name, user.referredBy?.email, user.sponsorCode].filter(Boolean).join(" ");
  const fields = {
    name: `${user.firstName || ""} ${user.lastName || ""} ${user.name || ""}`,
    email: user.email,
    mobile: user.mobile,
    country: user.country,
    referral: user.referralCode,
    sponsor,
    registered: date,
    investment: `${user.totalInvestmentUsdt ?? ""} ${total}`,
    status: statusLabel(user),
  };
  if (target === "general") {
    return [...Object.values(fields), user.isVerified ? "verified" : "unverified"].join(" ");
  }
  return fields[target] || "";
}

function exportRows(users) {
  return users.map((user) => [
    user.name || "",
    user.email || "",
    user.mobile || "",
    user.country || "",
    user.isVerified ? "Yes" : "No",
    statusLabel(user),
    user.referralCode || "",
    user.referredBy?.email || "",
    formatDate(user.createdAt),
    formatUsdt(user.totalInvestmentUsdt),
  ]);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function downloadExcel(users) {
  const logoResponse = await fetch(logoImg);
  if (!logoResponse.ok) {
    throw new Error("Could not load the Criccoin logo for export.");
  }
  const logoBlob = await logoResponse.blob();
  const logoDataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not prepare the Criccoin logo for export."));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read the Criccoin logo."));
    reader.readAsDataURL(logoBlob);
  });
  const head = `<tr>${EXPORT_COLUMNS.map((label) => `<th>${escapeHtml(label)}</th>`).join("")}</tr>`;
  const body = exportRows(users)
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body { font-family: Segoe UI, sans-serif; color: #111; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; font-size: 12px; text-align: left; }
    th { background: #f4f4f4; }
    .brand { text-align: center; }
    .brand img { width: 64px; height: 64px; object-fit: contain; }
    .brand-name { font-size: 22px; font-weight: 700; }
    .brand-subtitle { font-size: 14px; color: #555; }
  </style></head><body><table>
    <tr><td colspan="${EXPORT_COLUMNS.length}" class="brand"><img src="${logoDataUrl}" alt="Criccoin logo"><br><span class="brand-name">Criccoin</span><br><span class="brand-subtitle">User Management</span></td></tr>
    ${head}${body}
  </table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "users.xls";
  link.click();
  URL.revokeObjectURL(url);
}

function openPdf(users) {
  const popup = window.open("", "_blank");
  if (!popup) {
    return false;
  }
  const head = `<tr>${EXPORT_COLUMNS.map((label) => `<th>${escapeHtml(label)}</th>`).join("")}</tr>`;
  const body = exportRows(users)
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  popup.document.write(`<!DOCTYPE html><html><head><title>User Management</title>
    <style>
      body { font-family: Segoe UI, sans-serif; padding: 24px; color: #111; }
      .pdf-brand { display: grid; justify-items: center; gap: 4px; margin-bottom: 18px; text-align: center; }
      .pdf-brand img { width: 64px; height: 64px; object-fit: contain; }
      .pdf-brand h1 { font-size: 22px; margin: 0; }
      .pdf-brand p { font-size: 14px; margin: 0; color: #555; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ccc; padding: 6px 8px; font-size: 12px; text-align: left; }
      th { background: #f4f4f4; }
    </style></head><body>
    <header class="pdf-brand">
      <img class="pdf-brand-logo" src="${escapeHtml(logoImg)}" alt="Criccoin logo">
      <h1>Criccoin</h1>
      <p>User Management</p>
    </header>
    <table><thead>${head}</thead><tbody>${body}</tbody></table>
    </body></html>`);
  popup.document.close();
  const logo = popup.document.querySelector(".pdf-brand-logo");
  const printDocument = () => {
    popup.focus();
    popup.print();
  };
  if (logo.complete) {
    printDocument();
  } else {
    logo.addEventListener("load", printDocument, { once: true });
    logo.addEventListener("error", printDocument, { once: true });
  }
  return true;
}

function draftFromUser(user) {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    mobile: user.mobile || "",
    country: user.country || "",
    referralCode: user.referralCode || "",
    sponsorId: user.sponsorCode || "",
    totalInvestmentUsdt: String(user.totalInvestmentUsdt ?? 0),
    password: "",
    confirmPassword: "",
    isVerified: Boolean(user.isVerified),
    isActive: user.isActive !== false,
  };
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const editRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [target, setTarget] = useState("general");
  const [parameter, setParameter] = useState("");
  const [applied, setApplied] = useState({ target: "general", parameter: "" });
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState(null);
  const [busy, setBusy] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeTarget = SEARCH_TARGETS.find((item) => item.id === target) || SEARCH_TARGETS[0];
  const editingUser = users.find((user) => user._id === editingId) || null;
  const countryOptions =
    editForm?.country && !COUNTRIES.includes(editForm.country) ? [editForm.country, ...COUNTRIES] : COUNTRIES;

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users || []))
      .catch((err) => {
        setError(err.message);
        if (err.status === 401) {
          logoutAdmin();
          navigate("/admin/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const visibleUsers = useMemo(() => {
    const query = applied.parameter.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter((user) => searchText(user, applied.target).toLowerCase().includes(query));
  }, [users, applied]);

  const pageCount = Math.max(1, Math.ceil(visibleUsers.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageStart = visibleUsers.length === 0 ? 0 : (safePage - 1) * pageSize;
  const pageUsers = visibleUsers.slice(pageStart, pageStart + pageSize);
  const pageNumbers = useMemo(() => {
    const end = Math.min(pageCount, Math.max(safePage + 2, 5));
    const start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pageCount, safePage]);

  function fail(err) {
    setError(err.message);
    if (err.status === 401) {
      logoutAdmin();
      navigate("/admin/login");
    }
  }

  function replaceUser(next) {
    setUsers((current) => current.map((user) => (user._id === next._id ? next : user)));
  }

  function executeSearch(event) {
    event.preventDefault();
    setApplied({ target, parameter });
    setPage(1);
    setInfo("");
    setError("");
  }

  function resetSearch() {
    setTarget("general");
    setParameter("");
    setApplied({ target: "general", parameter: "" });
    setPage(1);
    setInfo("");
    setError("");
  }

  async function onExcelExport() {
    setError("");
    try {
      await downloadExcel(visibleUsers);
    } catch (err) {
      setError(err.message);
    }
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setEditForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function startEdit(user) {
    setEditingId(user._id);
    setEditForm(draftFromUser(user));
    setError("");
    setInfo("");
    setTimeout(() => editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function cancelEdit() {
    setEditingId("");
    setEditForm(null);
  }

  async function onQuickLogin(user) {
    setBusy({ id: user._id, action: "login" });
    setError("");
    setInfo("");
    try {
      await quickLoginUser(user._id);
      const popup = window.open("/dashboard", "_blank");
      if (!popup) {
        setError("Allow pop-ups, then open the user dashboard.");
        return;
      }
      setInfo(`Opened ${user.name}'s dashboard in a new tab.`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(null);
    }
  }

  async function toggleActive(user) {
    setBusy({ id: user._id, action: "status" });
    setError("");
    setInfo("");
    try {
      const data = await updateUser(user._id, { isActive: user.isActive === false });
      replaceUser(data.user);
      if (editingId === user._id) {
        setEditForm((current) => (current ? { ...current, isActive: data.user.isActive !== false } : current));
      }
      setInfo(data.user.isActive === false ? `${data.user.name} is deactive.` : `${data.user.name} is active.`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(null);
    }
  }

  async function saveUser(event) {
    event.preventDefault();
    if (!editForm) {
      return;
    }
    if (editForm.password || editForm.confirmPassword) {
      if (editForm.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (editForm.password !== editForm.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    const amount = Number(editForm.totalInvestmentUsdt);
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Total investment must be 0 or more");
      return;
    }

    setBusy({ id: editingId, action: "save" });
    setError("");
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        mobile: editForm.mobile,
        country: editForm.country,
        referralCode: editForm.referralCode,
        sponsorId: editForm.sponsorId,
        totalInvestmentUsdt: amount,
        isVerified: editForm.isVerified,
        isActive: editForm.isActive,
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }
      const data = await updateUser(editingId, payload);
      replaceUser(data.user);
      cancelEdit();
      setInfo("User updated.");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <h2>User Management</h2>
      </header>
      <div className="app-content admin-users-page">
        <div className="panel admin-users-panel">
          <div className="admin-users-heading">
            <span className="admin-users-heading-icon"><UsersRound size={20} aria-hidden="true" /></span>
            <div>
              <h3>Manage accounts</h3>
              <p>Search, review, and update registered users.</p>
            </div>
            {!loading ? (
              <span className="admin-users-count">
                {users.length} {users.length === 1 ? "user" : "users"}
              </span>
            ) : null}
          </div>
          <form className="user-search" onSubmit={executeSearch}>
            <label className="field">
              <span>Search Target Type</span>
              <select value={target} onChange={(event) => setTarget(event.target.value)}>
                {SEARCH_TARGETS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Search Parameter</span>
              <input
                value={parameter}
                onChange={(event) => setParameter(event.target.value)}
                placeholder={activeTarget.placeholder}
              />
            </label>
            <button className="gold-btn compact" type="submit">
              <Search size={16} aria-hidden="true" />
              Execute Search
            </button>
            <button className="ghost-btn user-reset" type="button" onClick={resetSearch}>
              <RotateCcw size={16} />
              Reset
            </button>
          </form>
          <div className="export-row">
            <button className="pdf-btn" type="button" onClick={() => openPdf(visibleUsers) || setError("Allow pop-ups to export PDF.")}>
              <FileText size={16} />
              PDF
            </button>
            <button className="excel-btn" type="button" onClick={onExcelExport}>
              <FileSpreadsheet size={16} />
              Excel
            </button>
          </div>
          {error ? <p className="error">{error}</p> : null}
          {info ? <p className="info">{info}</p> : null}
          {editForm && editingUser ? (
            <form className="user-edit" ref={editRef} onSubmit={saveUser}>
              <h3>Edit {editingUser.name}</h3>
              <div className="grid-2">
                <label className="field">
                  <span>First name</span>
                  <input name="firstName" value={editForm.firstName} onChange={updateField} required />
                </label>
                <label className="field">
                  <span>Last name</span>
                  <input name="lastName" value={editForm.lastName} onChange={updateField} required />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" type="email" value={editForm.email} onChange={updateField} required />
                </label>
                <label className="field">
                  <span>Mobile</span>
                  <input name="mobile" value={editForm.mobile} onChange={updateField} required />
                </label>
                <label className="field">
                  <span>Country</span>
                  <select name="country" value={editForm.country} onChange={updateField} required>
                    <option value="">Select country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Referral code</span>
                  <input name="referralCode" value={editForm.referralCode} onChange={updateField} required />
                </label>
                <label className="field">
                  <span>Sponsor ID</span>
                  <input name="sponsorId" value={editForm.sponsorId} onChange={updateField} required />
                </label>
                <label className="field">
                  <span>Total investment (USDT)</span>
                  <input
                    name="totalInvestmentUsdt"
                    inputMode="decimal"
                    value={editForm.totalInvestmentUsdt}
                    onChange={updateField}
                    required
                  />
                </label>
                <label className="field">
                  <span>New password</span>
                  <input
                    name="password"
                    type="password"
                    value={editForm.password}
                    onChange={updateField}
                    placeholder="Leave blank to keep current"
                    autoComplete="new-password"
                  />
                </label>
                <label className="field">
                  <span>Repeat password</span>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={updateField}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </label>
              </div>
              <div className="action-row">
                <label className="check-row">
                  <input name="isVerified" type="checkbox" checked={editForm.isVerified} onChange={updateField} />
                  Verified
                </label>
                <label className="check-row">
                  <input name="isActive" type="checkbox" checked={editForm.isActive} onChange={updateField} />
                  Active
                </label>
              </div>
              <p className="muted">Registration date: {formatDate(editingUser.createdAt)}. Leave the password blank to keep the current one.</p>
              <div className="action-row">
                <button className="gold-btn compact" type="submit" disabled={busy?.id === editingId && busy?.action === "save"}>
                  {busy?.id === editingId && busy?.action === "save" ? "Saving..." : "Save user"}
                </button>
                <button className="ghost-btn" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
          {loading ? <p className="muted">Loading users...</p> : null}
          {!loading && users.length === 0 ? <p className="muted">No users yet.</p> : null}
          {!loading && users.length > 0 && visibleUsers.length === 0 ? (
            <p className="muted">No users match this search.</p>
          ) : null}
          {visibleUsers.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Country</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Referral</th>
                    <th>Sponsor</th>
                    <th>Registration date</th>
                    <th>Total investment</th>
                    <th>Edit</th>
                    <th>Quick login</th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile || "-"}</td>
                      <td>{user.country || "-"}</td>
                      <td>{user.isVerified ? "Yes" : "No"}</td>
                      <td>
                        <div className="row-actions">
                          <span className={user.isActive === false ? "badge rejected" : "badge approved"}>{statusLabel(user)}</span>
                          <button
                            className="ghost-btn"
                            type="button"
                            disabled={busy?.id === user._id}
                            onClick={() => toggleActive(user)}
                          >
                            {busy?.id === user._id && busy?.action === "status"
                              ? "Saving..."
                              : user.isActive === false
                                ? "Active"
                                : "Deactive"}
                          </button>
                        </div>
                      </td>
                      <td>{user.referralCode}</td>
                      <td>{user.referredBy?.email || "-"}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatUsdt(user.totalInvestmentUsdt)} USDT</td>
                      <td>
                        <button className="ghost-btn" type="button" onClick={() => startEdit(user)}>
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="gold-btn compact"
                          type="button"
                          disabled={user.isActive === false || busy?.id === user._id}
                          onClick={() => onQuickLogin(user)}
                        >
                          {busy?.id === user._id && busy?.action === "login" ? "Opening..." : "Quick login"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {visibleUsers.length > 0 ? (
            <div className="pager">
              <p className="muted">
                {pageStart + 1}–{pageStart + pageUsers.length} of {visibleUsers.length}
              </p>
              <div className="pager-controls">
                <label className="pager-size">
                  <span>Rows</span>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                  >
                    {PAGE_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="ghost-btn pager-btn" type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
                  Previous
                </button>
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={number === safePage ? "gold-btn compact pager-btn" : "ghost-btn pager-btn"}
                    type="button"
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  className="ghost-btn pager-btn"
                  type="button"
                  disabled={safePage === pageCount}
                  onClick={() => setPage(safePage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
