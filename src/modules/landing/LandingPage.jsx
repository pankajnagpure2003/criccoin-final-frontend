import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="landing">
      <div className="brand">
        <span className="brand-mark">Criccoin</span>
      </div>
      <h1>Hello World</h1>
      <p className="lead">Trade · Invest · Grow</p>
      <div className="landing-actions">
        <Link className="gold-btn compact" to="/signup">
          Sign Up
        </Link>
        <Link className="ghost-btn" to="/login">
          Sign In
        </Link>
      </div>
    </main>
  );
}
