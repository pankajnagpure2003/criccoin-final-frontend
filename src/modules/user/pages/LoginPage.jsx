import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userAuth.api.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordField from "../components/PasswordField.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await loginUser(form);
      navigate("/dashboard");
    } catch (err) {
      if (err.data?.needsVerification) {
        navigate(`/verify-otp?email=${encodeURIComponent(err.data.email || form.email)}`);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1>Welcome back</h1>
      <p className="lead">Sign in to continue to your dashboard.</p>
      {error ? <p className="error">{error}</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <PasswordField name="password" placeholder="Password" value={form.password} onChange={update} />
        <Link className="form-links" to="/forgot-password">
          Forgot password?
        </Link>
        <button className="gold-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="auth-footer">
        New here? <Link to="/signup">Sign Up</Link>
      </p>
    </AuthShell>
  );
}
