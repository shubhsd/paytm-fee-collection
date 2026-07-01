import { useState } from "react";
import { usePayment, formatINR } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";
import { ENTITIES } from "../../data/departments";
import CostCalculator, { computeCost } from "../../components/CostCalculator";
import { TextField, SelectField } from "./fields";

export default function DeptForm() {
  const { go } = useVersion();
  const { setOrder, drafts, saveDraft } = usePayment();
  const [v, setV] = useState(
    () =>
      drafts.dept || {
        entity: "",
        name: "",
        mobile: "",
        idno: "",
        amount: "",
      }
  );
  const [submitted, setSubmitted] = useState(false);
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const cost = computeCost(v.amount);

  const errors = {
    entity: !v.entity ? "Please select a department" : "",
    name: !v.name.trim() ? "Please enter your name" : "",
    mobile: !/^\d{10}$/.test(v.mobile) ? "Enter a valid 10-digit mobile number" : "",
    idno: !v.idno.trim() ? "Please enter your ID" : "",
    amount: !(cost.a > 0) ? "Enter the project cost" : "",
  };
  const valid = Object.values(errors).every((e) => !e);
  const err = (k) => (submitted ? errors[k] : "");

  function proceed() {
    setSubmitted(true);
    if (!valid) return;
    saveDraft("dept", v);
    setOrder({
      merchantName: v.entity,
      amount: cost.payable,
      details: [
        { label: "Department", value: v.entity },
        { label: "Name", value: v.name },
        { label: "Mobile", value: v.mobile },
        { label: "ID", value: v.idno },
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
      <h1 className="web-title">Punjab Labour Department</h1>
      <p className="web-subtitle">Enter your details to proceed with the payment.</p>

      <div className="web-grid">
        <div className="web-card">
          <SelectField
            label="Department"
            placeholder="Select Department"
            value={v.entity}
            onChange={(e) => set("entity", e.target.value)}
            error={err("entity")}
            options={ENTITIES}
          />
          <div className="web-fields">
            <TextField
              label="Name"
              value={v.name}
              onChange={(e) => set("name", e.target.value)}
              error={err("name")}
            />
            <TextField
              label="Mobile Number"
              inputMode="numeric"
              value={v.mobile}
              onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              error={err("mobile")}
            />
            <TextField
              label="ID"
              value={v.idno}
              onChange={(e) => set("idno", e.target.value)}
              error={err("idno")}
            />
          </div>
          <CostCalculator
            value={v.amount}
            onChange={(e) => set("amount", e.target.value.replace(/[^\d.]/g, ""))}
            error={err("amount")}
          />
        </div>

        <aside className="web-aside">
          <div className="web-card web-summary">
            <h3 className="web-summary-title">Payment summary</h3>
            <div className="web-summary-row">
              <span>Department</span>
              <span>{v.entity || "—"}</span>
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
