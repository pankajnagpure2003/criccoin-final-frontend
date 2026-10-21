import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, logoutAdmin } from "../api/admin.api.js";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users || []))
      .catch((err) => {
        setError(err.message);
        if (err.status === 401) {
          logoutAdmin();
          navigate("/admin/login");
        }
      });
  }, [navigate]);

  return (
    <>
      <header className="topbar">
        <h2>Users</h2>
      </header>
      <div className="app-content">
        <div className="panel">
          {error ? <p className="error">{error}</p> : null}
          {!error && users.length === 0 ? <p className="muted">No users yet.</p> : null}
          {users.length > 0 ? (
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
          ) : null}
        </div>
      </div>
    </>
  );
}
