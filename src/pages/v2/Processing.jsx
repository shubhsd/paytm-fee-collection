import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { usePayment, formatINR } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";

const STEPS = [
  "Connecting to your bank…",
  "Authorising the payment…",
  "Confirming transaction…",
];

export default function Processing() {
  const { order, setResult } = usePayment();
  const { go, base } = useVersion();
  const [step, setStep] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    if (!order) return;
    timers.current.push(setTimeout(() => setStep(1), 1100));
    timers.current.push(setTimeout(() => setStep(2), 2200));
    timers.current.push(
      setTimeout(() => {
        const success = Math.random() < 0.9;
        const txnId =
          "T" +
          Date.now().toString().slice(-8) +
          Math.floor(100 + Math.random() * 900);
        setResult({
          success,
          txnId,
          amount: order.amount,
          merchantName: order.merchantName,
          when: new Date().toLocaleString("en-IN"),
        });
        go("/result", { replace: true });
      }, 3400)
    );
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) return <Navigate to={base} replace />;

  return (
    <main className="web-main web-main-narrow">
      <div className="web-card center-state">
        <div className="spinner" />
        <div className="state-title">{formatINR(order.amount)}</div>
        <div className="state-sub">{STEPS[step]}</div>
        <div className="dont-close">
          Please do not press back or close this window
        </div>
      </div>
    </main>
  );
}
