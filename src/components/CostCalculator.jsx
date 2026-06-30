import { formatINR } from "../context/PaymentContext";

// Project Cost (A) → 1% cess (B = 1% of A) → net payable (99% of B).
export function computeCost(amountStr) {
  const a = Number(amountStr || 0);
  const cess = a * 0.01; // B
  const payable = cess * 0.99; // 99% of B
  return { a, cess, payable };
}

export default function CostCalculator({ value, onChange, error }) {
  const { cess, payable } = computeCost(value);

  return (
    <div className="field">
      <label className="web-label">Project Cost (A)</label>
      <div className={`field-box ${error ? "invalid" : ""}`}>
        <span className="rupee" style={{ marginRight: 6 }}>
          ₹
        </span>
        <input
          inputMode="decimal"
          placeholder="Enter project cost"
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <p className="field-error">{error}</p>}

      <div className="calc-box">
        <div className="calc-row">
          <span>1% of total cost (B)</span>
          <span>{formatINR(cess)}</span>
        </div>
        <div className="calc-row total">
          <span>Net cess after 1% deduction (99% of B)</span>
          <span>{formatINR(payable)}</span>
        </div>
      </div>
    </div>
  );
}
