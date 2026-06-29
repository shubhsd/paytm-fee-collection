import { useEffect } from "react";
import { usePayment } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";
import { SERVICES } from "../../data/departments";

export default function Home() {
  const { go } = useVersion();
  const { clearDrafts, setOrder } = usePayment();

  // Landing on home starts a fresh transaction.
  useEffect(() => {
    clearDrafts();
    setOrder(null);
  }, [clearDrafts, setOrder]);

  return (
    <main className="web-main">
      <section className="v2-hero">
        <img
          className="v2-hero-logo"
          src="/punjab-gov.svg"
          alt="Government of Punjab"
        />
        <h1 className="v2-hero-title">Online payments, made simple</h1>
        <p className="v2-hero-sub">
          Securely pay fees and dues to Punjab Labour Department services.
          Choose a service to get started.
        </p>
      </section>

      <section className="v2-services">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            className="v2-service-card"
            onClick={() => go(s.to)}
          >
            <span className="v2-service-icon">{s.icon}</span>
            <span className="v2-service-title">{s.title}</span>
            <span className="v2-service-sub">{s.sub}</span>
            <span className="v2-service-cta">Continue →</span>
          </button>
        ))}
      </section>
    </main>
  );
}
