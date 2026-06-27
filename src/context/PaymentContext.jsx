import { createContext, useContext, useState } from "react";

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  // The single order being paid: merchant + collected form fields + amount.
  const [order, setOrder] = useState(null);
  // Result of the dummy payment attempt.
  const [result, setResult] = useState(null);

  return (
    <PaymentContext.Provider value={{ order, setOrder, result, setResult }}>
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
