import { useState } from "react";
import { usePayment, formatINR } from "../context/PaymentContext";
import { useVersion } from "../hooks/useVersion";
import { BrowserBar, PortalHeader, SecureFooter } from "../components/Chrome";
import { ENTITIES } from "../data/departments";

export default function EntitySelect() {
  const { go } = useVersion();
  const { setOrder, drafts, saveDraft } = usePayment();
  const [entity, setEntity] = useState(() => drafts.entity?.entity || "");
  const [amountStr, setAmountStr] = useState(() => drafts.entity?.amountStr || "");
  const [submitted, setSubmitted] = useState(false);

  const amount = Number(amountStr || 0);
  const entityValid = !!entity;
  const amountValid = amount > 0;
  const valid = entityValid && amountValid;

  function proceed() {
    setSubmitted(true);
    if (!valid) return;
    saveDraft("entity", { entity, amountStr });
    setOrder({
      merchantName: entity,
      amount,
      details: [{ label: "Entity", value: entity }],
    });
    go("/checkout");
  }

  return (
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <PortalHeader subtitle="Select Entity" onBack={() => go("/")} />

        <div className="pad">
          <h2 className="form-title">Entity &amp; amount</h2>

          <div className="field">
            <div
              className={`field-box select-box ${
                submitted && !entityValid ? "invalid" : ""
              }`}
            >
              <select
                className={entity ? "" : "placeholder"}
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
              >
                <option value="" disabled>
                  Select Entity Name*
                </option>
                {ENTITIES.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            {submitted && !entityValid && (
              <p className="field-error">Please select an entity</p>
            )}
          </div>

          <div className="field">
            <div className="amount-inline">
              <span className="amount-label">Amount*</span>
              <span className="amount-entry">
                <span className="rupee">₹</span>
                <input
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={amountStr}
                  onChange={(e) =>
                    setAmountStr(e.target.value.replace(/[^\d.]/g, ""))
                  }
                />
              </span>
            </div>
            {submitted && !amountValid && (
              <p className="field-error">Enter a valid amount</p>
            )}
          </div>
        </div>

        <SecureFooter />
      </div>

      <div className="sticky-cta">
        <button className="btn" disabled={submitted && !valid} onClick={proceed}>
          Proceed to Pay{amount > 0 ? ` ${formatINR(amount)}` : ""}
        </button>
      </div>
    </div>
  );
}
