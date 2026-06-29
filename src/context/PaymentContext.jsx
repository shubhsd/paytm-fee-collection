import { createContext, useCallback, useContext, useState } from "react";

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  // The single order being paid: merchant + collected form fields + amount.
  const [order, setOrder] = useState(null);
  // Result of the dummy payment attempt.
  const [result, setResult] = useState(null);
  // Saved form inputs, so pressing back from a later page restores them.
  const [drafts, setDrafts] = useState({});

  const saveDraft = useCallback((key, data) => {
    setDrafts((d) => ({ ...d, [key]: data }));
  }, []);
  const clearDrafts = useCallback(() => setDrafts({}), []);

  return (
    <PaymentContext.Provider
      value={{ order, setOrder, result, setResult, drafts, saveDraft, clearDrafts }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within PaymentProvider");
  return ctx;
}

export function formatINR(value) {
  const n = Number(value || 0);
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}
