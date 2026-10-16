import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../api/authClient.js";
import { getUsers, logoutAdmin } from "../api/admin.api.js";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authClient.isAuthenticated("admin")) {
      navigate("/admin/login");
      return;
    }

    getUsers()
      .then((data) => setUsers(data.users || []))
      .catch((err) => {
        setError(err.message);
        logoutAdmin();
      });
  }, [navigate]);

  function logout() {
    logoutAdmin();
    navigate("/admin/login");
  }

  if (error) {
    return (
      <main className="auth-screen">
        <div className="panel">
          <p className="error">{error}</p>
          <button className="gold-btn" type="button" onClick={() => navigate("/admin/login")}>
            Go to admin login
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <span className="brand-mark">October</span>
          <p className="brand-tag">ADMIN</p>
        </div>
        <nav>
          <a className="active" href="/admin/users">
            Users
          </a>
        </nav>
        <button type="button" className="sidebar-logout" onClick={logout}>
          Logout
        </button>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <h2>Users</h2>
        </header>
        <div className="app-content">
          <div className="panel">
            {users.length === 0 ? (
              <p className="muted">No users yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Country</th>
                      <th>Verified</th>
                      <th>Referral</th>
                      <th>Sponsor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile || "-"}</td>
                        <td>{user.country || "-"}</td>
                        <td>{user.isVerified ? "Yes" : "No"}</td>
                        <td>{user.referralCode}</td>
                        <td>{user.referredBy?.email || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
