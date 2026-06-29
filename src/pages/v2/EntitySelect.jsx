import { useState } from "react";
import { usePayment, formatINR } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";
import { ENTITIES } from "../../data/departments";
import { SelectField, AmountField } from "./fields";

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
    <main className="web-main">
      <button className="web-back" onClick={() => go("/")}>
        ← Back to services
      </button>
      <h1 className="web-title">Select entity &amp; amount</h1>
      <p className="web-subtitle">Choose the entity you want to pay and the amount.</p>

      <div className="web-grid">
        <div className="web-card">
          <SelectField
            label="Entity Name"
            placeholder="Select Entity Name"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            error={submitted && !entityValid ? "Please select an entity" : ""}
            options={ENTITIES}
          />
          <AmountField
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value.replace(/[^\d.]/g, ""))}
            error={submitted && !amountValid ? "Enter a valid amount" : ""}
          />
        </div>

        <aside className="web-aside">
          <div className="web-card web-summary">
            <h3 className="web-summary-title">Payment summary</h3>
            <div className="web-summary-row">
              <span>Entity</span>
              <span>{entity || "—"}</span>
            </div>
            <div className="web-summary-row total">
              <span>Amount</span>
              <span>{amount > 0 ? formatINR(amount) : "—"}</span>
            </div>
            <button
              className="btn"
              disabled={submitted && !valid}
              onClick={proceed}
            >
              Proceed to Pay{amount > 0 ? ` ${formatINR(amount)}` : ""}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
