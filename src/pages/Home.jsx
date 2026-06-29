import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../context/PaymentContext";
import { useVersion } from "../hooks/useVersion";
import { SERVICES } from "../data/departments";

export default function Home() {
  const { go } = useVersion();
  const navigate = useNavigate();
  const { clearDrafts, setOrder } = usePayment();

  // Landing on the home screen starts a fresh transaction.
  useEffect(() => {
    clearDrafts();
    setOrder(null);
  }, [clearDrafts, setOrder]);

  return (
    <div className="page scroll-area">
      <div className="scan-wrap">
        <button className="ver-switch" onClick={() => navigate("/")}>
          ⇄ Switch version
        </button>

        <div className="dept-hero">
          <img
            className="dept-logo"
            src="/punjab-gov.svg"
            alt="Government of Punjab"
          />
          <h1 className="dept-title">Punjab Labour Department</h1>
          <p className="dept-sub">Government of Punjab · Payment Portal</p>
        </div>

        <div className="home-services">
          <p className="qr-choice-title">Select a service</p>
          <div className="option-list">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                className="option-card"
                onClick={() => go(s.to)}
              >
                <span className="opt-icon">{s.icon}</span>
                <span className="opt-text">
                  <span className="opt-title">{s.title}</span>
                  <span className="opt-sub">{s.sub}</span>
                </span>
                <span className="opt-chev" aria-hidden>
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
