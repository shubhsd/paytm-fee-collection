import { Navigate } from "react-router-dom";
import { usePayment, formatINR } from "../context/PaymentContext";
import { useVersion } from "../hooks/useVersion";
import { BrowserBar, SecureFooter } from "../components/Chrome";
import { CheckCircleIcon, CrossCircleIcon } from "../components/icons";

export default function Result() {
  const { order, result, setResult, setOrder, clearDrafts } = usePayment();
  const { go, base } = useVersion();

  if (!result) return <Navigate to={base} replace />;

  const ok = result.success;

  function done() {
    setResult(null);
    setOrder(null);
    clearDrafts();
    go("/", { replace: true });
  }

  function retry() {
    setResult(null);
    go("/checkout", { replace: true });
  }

  return (
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <div className="center-state fade-in">
          <div className={`result-badge ${ok ? "ok" : "fail"}`}>
            {ok ? <CheckCircleIcon /> : <CrossCircleIcon />}
          </div>
          <div className="state-title">
            {ok ? "Payment Successful" : "Payment Failed"}
          </div>
          <div className="state-sub">
            {ok
              ? `Your payment of ${formatINR(result.amount)} has been received.`
              : "We couldn't process your payment. No money was deducted."}
          </div>

          <div className="receipt">
            <div className="r-row">
              <span className="r-key">Amount</span>
              <span className="r-val">{formatINR(result.amount)}</span>
            </div>
            <div className="r-row">
              <span className="r-key">Paid to</span>
              <span className="r-val">{result.merchantName}</span>
            </div>
            <div className="r-row">
              <span className="r-key">Transaction ID</span>
              <span className="r-val">{result.txnId}</span>
            </div>
            <div className="r-row">
              <span className="r-key">Date &amp; time</span>
              <span className="r-val">{result.when}</span>
            </div>
            <div className="r-row">
              <span className="r-key">Status</span>
              <span
                className="r-val"
                style={{ color: ok ? "var(--success)" : "var(--danger)" }}
              >
                {ok ? "SUCCESS" : "FAILED"}
              </span>
            </div>

            {ok &&
              order?.details?.map((d) => (
                <div className="r-row" key={d.label}>
                  <span className="r-key">{d.label}</span>
                  <span className="r-val">{d.value}</span>
                </div>
              ))}
          </div>
        </div>

        <SecureFooter />
      </div>

      <div className="sticky-cta">
        {ok ? (
          <button className="btn" onClick={done}>
            Done
          </button>
        ) : (
          <>
            <button className="btn btn-dark" onClick={retry} style={{ marginBottom: 10 }}>
              Retry Payment
            </button>
            <button className="btn btn-outline" onClick={done}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
