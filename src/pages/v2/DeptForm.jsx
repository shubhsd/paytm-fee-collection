import { useState } from "react";
import { usePayment, formatINR } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";
import { ENTITIES } from "../../data/departments";
import { TextField, SelectField, AmountField } from "./fields";

export default function DeptForm() {
  const { go } = useVersion();
  const { setOrder, drafts, saveDraft } = usePayment();
  const [v, setV] = useState(
    () =>
      drafts.dept || {
        name: "",
        surname: "",
        mobile: "",
        idno: "",
        entity: "",
        amount: "",
      }
  );
  const [submitted, setSubmitted] = useState(false);
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }));

  const errors = {
    name: !v.name.trim() ? "Please enter your name" : "",
    surname: !v.surname.trim() ? "Please enter your surname" : "",
    mobile: !/^\d{10}$/.test(v.mobile) ? "Enter a valid 10-digit mobile number" : "",
    idno: !v.idno.trim() ? "Please enter your ID" : "",
    entity: !v.entity ? "Please select an entity" : "",
    amount: !(Number(v.amount) > 0) ? "Enter a valid amount" : "",
  };
  const valid = Object.values(errors).every((e) => !e);
  const amount = Number(v.amount || 0);
  const err = (k) => (submitted ? errors[k] : "");

  function proceed() {
    setSubmitted(true);
    if (!valid) return;
    saveDraft("dept", v);
    setOrder({
      merchantName: v.entity,
      amount,
      details: [
        { label: "Name", value: `${v.name} ${v.surname}`.trim() },
        { label: "Mobile", value: v.mobile },
        { label: "ID", value: v.idno },
        { label: "Entity", value: v.entity },
      ],
    });
    go("/checkout");
  }

  return (
    <main className="web-main">
      <button className="web-back" onClick={() => go("/")}>
        ← Back to services
      </button>
      <h1 className="web-title">Punjab Labour Department</h1>
      <p className="web-subtitle">Enter your details to proceed with the payment.</p>

      <div className="web-grid">
        <div className="web-card">
          <div className="web-fields">
            <TextField
              label="Name"
              value={v.name}
              onChange={(e) => set("name", e.target.value)}
              error={err("name")}
            />
            <TextField
              label="Surname"
              value={v.surname}
              onChange={(e) => set("surname", e.target.value)}
              error={err("surname")}
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
          <SelectField
            label="Entity"
            placeholder="Select Entity"
            value={v.entity}
            onChange={(e) => set("entity", e.target.value)}
            error={err("entity")}
            options={ENTITIES}
          />
          <AmountField
            value={v.amount}
            onChange={(e) => set("amount", e.target.value.replace(/[^\d.]/g, ""))}
            error={err("amount")}
          />
        </div>

        <aside className="web-aside">
          <div className="web-card web-summary">
            <h3 className="web-summary-title">Payment summary</h3>
            <div className="web-summary-row">
              <span>Entity</span>
              <span>{v.entity || "—"}</span>
            </div>
            <div className="web-summary-row">
              <span>Name</span>
              <span>{`${v.name} ${v.surname}`.trim() || "—"}</span>
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
