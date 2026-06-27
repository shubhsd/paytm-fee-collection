import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePayment, formatINR } from "../context/PaymentContext";
import { BrowserBar } from "../components/Chrome";

const STEPS = [
  "Connecting to your bank…",
  "Authorising the payment…",
  "Confirming transaction…",
];

export default function Processing() {
  const { order, setResult } = usePayment();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    if (!order) return;
    timers.current.push(setTimeout(() => setStep(1), 1100));
    timers.current.push(setTimeout(() => setStep(2), 2200));
    timers.current.push(
      setTimeout(() => {
        // Dummy outcome: succeed ~90% of the time.
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
        navigate("/result", { replace: true });
      }, 3400)
    );
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <div className="center-state">
          <div className="spinner" />
          <div className="state-title">{formatINR(order.amount)}</div>
          <div className="state-sub">{STEPS[step]}</div>
          <div className="dont-close">
            Please do not press back or close this window
          </div>
        </div>
      </div>
    </div>
  );
}
