import { useState } from "react";
import { usePayment, formatINR } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";
import { ENTITIES } from "../../data/departments";
import CostCalculator, { computeCost } from "../../components/CostCalculator";
import { SelectField } from "./fields";

export default function EntitySelect() {
  const { go } = useVersion();
  const { setOrder, drafts, saveDraft } = usePayment();
  const [entity, setEntity] = useState(() => drafts.entity?.entity || "");
  const [amountStr, setAmountStr] = useState(() => drafts.entity?.amountStr || "");
  const [submitted, setSubmitted] = useState(false);

  const cost = computeCost(amountStr);
  const entityValid = !!entity;
  const amountValid = cost.a > 0;
  const valid = entityValid && amountValid;

  function proceed() {
    setSubmitted(true);
    if (!valid) return;
    saveDraft("entity", { entity, amountStr });
    setOrder({
      merchantName: entity,
      amount: cost.payable,
      details: [
        { label: "Department", value: entity },
        { label: "Project Cost (A)", value: formatINR(cost.a) },
        { label: "1% of total cost (B)", value: formatINR(cost.cess) },
      ],
    });
    go("/checkout");
  }

  return (
    <main className="web-main">
      <button className="web-back" onClick={() => go(-1)}>
        ← Back
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
          <CostCalculator
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value.replace(/[^\d.]/g, ""))}
            error={submitted && !amountValid ? "Enter the project cost" : ""}
          />
        </div>

        <aside className="web-aside">
          <div className="web-card web-summary">
            <h3 className="web-summary-title">Payment summary</h3>
            <div className="web-summary-row">
              <span>Entity</span>
              <span>{entity || "—"}</span>
            </div>
            <div className="web-summary-row">
              <span>Project Cost (A)</span>
              <span>{cost.a > 0 ? formatINR(cost.a) : "—"}</span>
            </div>
            <div className="web-summary-row">
              <span>1% of total cost (B)</span>
              <span>{cost.a > 0 ? formatINR(cost.cess) : "—"}</span>
            </div>
            <div className="web-summary-row total">
              <span>Net cess payable</span>
              <span>{cost.payable > 0 ? formatINR(cost.payable) : "—"}</span>
            </div>
            <button
              className="btn"
              disabled={submitted && !valid}
              onClick={proceed}
            >
              Proceed to Pay{cost.payable > 0 ? ` ${formatINR(cost.payable)}` : ""}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
