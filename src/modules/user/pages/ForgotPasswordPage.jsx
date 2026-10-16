import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/userAuth.api.js";
import AuthShell from "../components/AuthShell.jsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await forgotPassword({ email });
      const target = data.needsVerification ? "/verify-otp" : "/reset-password";
      navigate(`${target}?email=${encodeURIComponent(data.email || email)}`);
    } catch (err) {
      if (err.data?.needsVerification) {
        navigate(`/verify-otp?email=${encodeURIComponent(err.data.email || email)}`);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1>Forgot password</h1>
      <p className="lead">Enter your email and we will send a reset OTP.</p>
      {error ? <p className="error">{error}</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="gold-btn" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
      <p className="auth-footer">
        Remembered it? <Link to="/login">Sign In</Link>
      </p>
    </AuthShell>
  );
}
