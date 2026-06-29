// Payment methods + UPI apps, shared by both versions' checkout screens.
export const METHODS = [
  { id: "upi", icon: "📱", title: "UPI", sub: "Google Pay, PhonePe, BHIM & more" },
  { id: "card", icon: "💳", title: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
  { id: "corpcard", icon: "🏢", title: "Corporate Card", sub: "Business & purchasing cards" },
  { id: "netbanking", icon: "🏦", title: "Net Banking", sub: "All major banks supported" },
];

export const UPI_APPS = [
  { id: "gpay", name: "Google Pay", logo: "/upi-gpay.svg" },
  { id: "phonepe", name: "PhonePe", logo: "/upi-phonepe.svg" },
  { id: "paytm", name: "Paytm", logo: "/upi-paytm.svg" },
];

export const BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra",
];

// Shared validation for the selected method's inputs.
export function methodValid(method, pay) {
  if (method === "upi")
    return !!pay.upiApp || /^[\w.\-]{2,}@[\w.\-]{2,}$/.test(pay.vpa || "");
  if (method === "card" || method === "corpcard")
    return (
      (pay.card || "").replace(/\s/g, "").length >= 12 &&
      (pay.exp || "").length >= 4 &&
      (pay.cvv || "").length >= 3
    );
  if (method === "netbanking") return !!pay.bank;
  return false;
}
