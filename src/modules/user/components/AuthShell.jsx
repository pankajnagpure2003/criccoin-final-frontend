import { Link } from "react-router-dom";

export default function AuthShell({ children }) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link to="/" className="back-pill">
          Back to website →
        </Link>
        <div className="brand">
          <span className="brand-mark">Criccoin</span>
          <p className="brand-tag">TRADE · INVEST · GROW</p>
        </div>
        {children}
      </section>
    </main>
  );
}
