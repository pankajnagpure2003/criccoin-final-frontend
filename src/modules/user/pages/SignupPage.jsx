import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signupUser } from "../api/userAuth.api.js";
import { COUNTRIES } from "../data/countries.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordField from "../components/PasswordField.jsx";

export default function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    sponsorId: params.get("ref") || "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.sponsorId.trim()) {
      setError("Sponsor ID is required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signupUser(form);
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1>Create your account</h1>
      <p className="lead">A valid sponsor ID is required to create an account.</p>
      {error ? <p className="error">{error}</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          name="sponsorId"
          placeholder="Sponsor ID"
          value={form.sponsorId}
          onChange={update}
          required
        />
        <div className="grid-2">
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={update} required />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={update} required />
        </div>
        <div className="grid-2">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
          <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={update} required />
        </div>
        <select name="country" value={form.country} onChange={update} required>
          <option value="">Select Country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <div className="grid-2">
          <PasswordField name="password" placeholder="Password" value={form.password} onChange={update} />
          <PasswordField
            name="confirmPassword"
            placeholder="Repeat Password"
            value={form.confirmPassword}
            onChange={update}
          />
        </div>
        <button className="gold-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </AuthShell>
  );
}
