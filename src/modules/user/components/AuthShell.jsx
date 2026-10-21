import { Link } from "react-router-dom";
import logoImg from "../../../assets/criccoin-logo-trans.png";

export default function AuthShell({ children }) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link to="/" className="back-pill">
          Back to website
        </Link>
        <div className="brand">
          <img className="brand-logo" src={logoImg} alt="CRICCOIN" />
          <span className="brand-mark">CRICCOIN</span>
          <p className="brand-tag">PLAY · PARTICIPATE · BUILD</p>
        </div>
        {children}
      </section>
    </main>
  );
}
