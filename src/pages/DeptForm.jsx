import { useState } from "react";
import { usePayment, formatINR } from "../context/PaymentContext";
import { useVersion } from "../hooks/useVersion";
import { BrowserBar, PortalHeader, SecureFooter } from "../components/Chrome";
import { ENTITIES } from "../data/departments";

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
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <PortalHeader
          subtitle="Payment Details"
          onBack={() => go("/")}
        />

        <div className="pad">
          <h2 className="form-title">Enter your details</h2>

          <div className="field">
            <div className={`field-box ${err("name") ? "invalid" : ""}`}>
              <input
                placeholder="Name*"
                value={v.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            {err("name") && <p className="field-error">{err("name")}</p>}
          </div>

          <div className="field">
            <div className={`field-box ${err("surname") ? "invalid" : ""}`}>
              <input
                placeholder="Surname*"
                value={v.surname}
                onChange={(e) => set("surname", e.target.value)}
              />
            </div>
            {err("surname") && <p className="field-error">{err("surname")}</p>}
          </div>

          <div className="field">
            <div className={`field-box ${err("mobile") ? "invalid" : ""}`}>
              <input
                inputMode="numeric"
                placeholder="Mobile Number*"
                value={v.mobile}
                onChange={(e) =>
                  set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </div>
            {err("mobile") && <p className="field-error">{err("mobile")}</p>}
          </div>

          <div className="field">
            <div className={`field-box ${err("idno") ? "invalid" : ""}`}>
              <input
                placeholder="ID*"
                value={v.idno}
                onChange={(e) => set("idno", e.target.value)}
              />
            </div>
            {err("idno") && <p className="field-error">{err("idno")}</p>}
          </div>

          <div className="field">
            <div className={`field-box select-box ${err("entity") ? "invalid" : ""}`}>
              <select
                className={v.entity ? "" : "placeholder"}
                value={v.entity}
                onChange={(e) => set("entity", e.target.value)}
              >
                <option value="" disabled>
                  Select Entity*
                </option>
                {ENTITIES.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            {err("entity") && <p className="field-error">{err("entity")}</p>}
          </div>

          <div className="field">
            <div className="amount-inline">
              <span className="amount-label">Amount*</span>
              <span className="amount-entry">
                <span className="rupee">₹</span>
                <input
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={v.amount}
                  onChange={(e) =>
                    set("amount", e.target.value.replace(/[^\d.]/g, ""))
                  }
                />
              </span>
            </div>
            {err("amount") && <p className="field-error">{err("amount")}</p>}
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
