import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../api/admin.api.js";
import AuthShell from "../../user/components/AuthShell.jsx";
import PasswordField from "../../user/components/PasswordField.jsx";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(form);
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1>Admin login</h1>
      <p className="lead">Sign in to view registered users.</p>
      {error ? <p className="error">{error}</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={update} required />
        <PasswordField name="password" placeholder="Password" value={form.password} onChange={update} />
        <button className="gold-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="auth-footer">
        <Link to="/">Back to website</Link>
      </p>
    </AuthShell>
  );
}
