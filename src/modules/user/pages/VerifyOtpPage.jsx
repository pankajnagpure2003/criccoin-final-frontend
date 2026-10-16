import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resendOtp, verifyOtp } from "../api/userAuth.api.js";
import AuthShell from "../components/AuthShell.jsx";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = useMemo(() => params.get("email") || "", [params]);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      navigate("/dashboard");
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
      const data = await resendOtp({ email });
      setInfo(data.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthShell>
      <h1>Verify your email</h1>
      <p className="lead">Enter the 6-digit OTP sent to {email || "your email"}.</p>
      {error ? <p className="error">{error}</p> : null}
      {info ? <p className="info">{info}</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
        />
        <button className="gold-btn" type="submit" disabled={loading || !email}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <p className="auth-footer">
        Didn’t get it?{" "}
        <button type="button" className="text-link" onClick={onResend}>
          Resend OTP
        </button>
      </p>
      <p className="auth-footer">
        <Link to="/signup">Back to signup</Link>
      </p>
    </AuthShell>
  );
}
