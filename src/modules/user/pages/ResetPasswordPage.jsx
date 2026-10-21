import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/userAuth.api.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordField from "../components/PasswordField.jsx";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = useMemo(() => params.get("email") || "", [params]);
  const [form, setForm] = useState({ otp: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, ...form });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError("");
    setInfo("");
    try {
      const data = await forgotPassword({ email });
      setInfo(data.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthShell>
      <h1>Reset password</h1>
      <p className="lead">Enter the OTP sent to {email || "your email"} and choose a new password.</p>
      {error ? <p className="error">{error}</p> : null}
      {info ? <p className="info">{info}</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          name="otp"
          placeholder="Enter OTP"
          value={form.otp}
          onChange={update}
          required
          maxLength={6}
        />
        <PasswordField name="password" placeholder="New password" value={form.password} onChange={update} />
        <PasswordField
          name="confirmPassword"
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={update}
        />
        <button className="gold-btn" type="submit" disabled={loading || !email}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
      <p className="auth-footer">
        Didn’t get it?{" "}
        <button type="button" className="text-link" onClick={onResend}>
          Resend OTP
        </button>
      </p>
      <p className="auth-footer">
        <Link to="/login">Back to Log in</Link>
      </p>
    </AuthShell>
  );
}
