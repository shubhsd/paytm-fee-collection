import { useMemo, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getMerchant } from "../data/merchants";
import { usePayment, formatINR } from "../context/PaymentContext";
import { BrowserBar, SecureFooter, CreateLinkFooter } from "../components/Chrome";
import { CheckIcon, HelpIcon } from "../components/icons";

// Should this field be visible given current values?
function isVisible(field, values) {
  if (!field.showWhen) return true;
  return values[field.showWhen.field] === field.showWhen.equals;
}

// Is this field required given current values?
function isRequired(field, values) {
  if (field.required) return true;
  if (field.requiredWhen)
    return values[field.requiredWhen.field] === field.requiredWhen.equals;
  return false;
}

export default function MerchantForm() {
  const { merchantId } = useParams();
  const merchant = getMerchant(merchantId);
  const navigate = useNavigate();
  const { setOrder } = usePayment();

  const [values, setValues] = useState({});
  const [touched, setTouched] = useState({});
  const [terms, setTerms] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const visibleFields = useMemo(
    () => (merchant ? merchant.fields.filter((f) => isVisible(f, values)) : []),
    [merchant, values]
  );

  if (!merchant) return <Navigate to="/" replace />;

  const setVal = (name, v) => setValues((prev) => ({ ...prev, [name]: v }));
  const blur = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  function errorFor(field) {
    const v = (values[field.name] ?? "").toString().trim();
    if (isRequired(field, values) && !v) return "This field is required";
    if (v && field.pattern && !field.pattern.test(v))
      return field.errorMessage || "Invalid value";
    if (field.type === "amount" && v && Number(v) <= 0)
      return "Enter a valid amount";
    return null;
  }

  const showError = (field) =>
    (touched[field.name] || submitAttempted) && errorFor(field);

  const amountField = merchant.fields.find((f) => f.type === "amount");
  const amount = amountField ? Number(values[amountField.name] || 0) : 0;

  const formValid =
    visibleFields.every((f) => !errorFor(f)) && (!merchant.terms || terms);

  function handleSubmit() {
    setSubmitAttempted(true);
    if (!formValid) return;

    // Build a human-readable summary of the collected details for the receipt.
    const details = visibleFields
      .filter((f) => f.type !== "amount")
      .map((f) => ({ label: f.label, value: values[f.name] }));

    setOrder({
      merchantId: merchant.id,
      merchantName:
        merchant.layout === "hero" ? merchant.name : merchant.headerTitle,
      amount,
      details,
    });
    navigate("/checkout");
  }

  /* -------- field renderers -------- */
  const renderField = (field) => {
    const errored = showError(field);

    if (field.type === "select") {
      const val = values[field.name] || "";
      return (
        <div className="field" key={field.name}>
          <div className={`field-box select-box ${errored ? "invalid" : ""}`}>
            <select
              className={val ? "" : "placeholder"}
              value={val}
              onChange={(e) => setVal(field.name, e.target.value)}
              onBlur={() => blur(field.name)}
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {errored ? (
            <p className="field-error">{errored}</p>
          ) : (
            field.helper && <p className="field-helper">{field.helper}</p>
          )}
        </div>
      );
    }

    if (field.type === "amount") {
      return (
        <div className="field" key={field.name}>
          <div className="amount-inline">
            <span className="amount-label">{field.label}*</span>
            <span className="amount-entry">
              <span className="rupee">₹</span>
              <input
                inputMode="decimal"
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) =>
                  setVal(field.name, e.target.value.replace(/[^\d.]/g, ""))
                }
                onBlur={() => blur(field.name)}
              />
            </span>
          </div>
          {errored && <p className="field-error">{errored}</p>}
        </div>
      );
    }

    // text
    return (
      <div className="field" key={field.name}>
        <div className={`field-box ${errored ? "invalid" : ""}`}>
          <input
            type="text"
            inputMode={field.inputMode || "text"}
            placeholder={field.placeholder}
            value={values[field.name] || ""}
            onChange={(e) => setVal(field.name, e.target.value)}
            onBlur={() => blur(field.name)}
          />
        </div>
        {errored ? (
          <p className="field-error">{errored}</p>
        ) : (
          field.helper && <p className="field-helper">{field.helper}</p>
        )}
      </div>
    );
  };

  const ctaLabel =
    merchant.proceedLabel +
    (amount > 0 && amountField ? ` ${formatINR(amount)}` : "");

  return (
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        {/* Header — two layouts */}
        {merchant.layout === "hero" ? (
          <div className="merchant-hero">
            <div className="merchant-logo">{merchant.logo}</div>
            <div className="merchant-eyebrow">{merchant.eyebrow}</div>
            <h1 className="merchant-name">{merchant.name}</h1>
            <div className="merchant-sub">{merchant.subtitle}</div>
          </div>
        ) : (
          <div className="help-bar">
            <span className="qmark">
              <HelpIcon style={{ width: 20, height: 20 }} />
            </span>
            <span className="help-link">Help</span>
          </div>
        )}

        <div className="pad">
          {merchant.layout === "help" && (
            <h1 className="merchant-name" style={{ fontSize: 22, marginTop: 0 }}>
              {merchant.headerTitle}
            </h1>
          )}

          {merchant.boxed ? (
            <div className="detail-card">
              <h2 className="detail-card-title">{merchant.formTitle}</h2>
              {visibleFields.map(renderField)}
            </div>
          ) : (
            <>
              <h2 className="form-title">{merchant.formTitle}</h2>
              {visibleFields.map(renderField)}
            </>
          )}

          {merchant.terms && (
            <label className="terms">
              <span
                className={`checkbox ${terms ? "on" : ""}`}
                onClick={() => setTerms((t) => !t)}
                role="checkbox"
                aria-checked={terms}
              >
                <CheckIcon />
              </span>
              <span>
                I accept all the{" "}
                <a href="#terms" onClick={(e) => e.preventDefault()}>
                  Terms &amp; Conditions
                </a>
              </span>
            </label>
          )}
        </div>

        {merchant.layout === "hero" ? <CreateLinkFooter /> : <SecureFooter />}
      </div>

      <div className="sticky-cta">
        <button className="btn" disabled={!formValid} onClick={handleSubmit}>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
