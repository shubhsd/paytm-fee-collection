// Lightweight labelled fields for the v2 web forms. They reuse the shared
// .field-box styling but add a top label for the desktop layout.

export function TextField({
  label,
  value,
  onChange,
  error,
  inputMode = "text",
  type = "text",
  placeholder,
}) {
  return (
    <div className="field">
      <label className="web-label">{label}</label>
      <div className={`field-box ${error ? "invalid" : ""}`}>
        <input
          type={type}
          inputMode={inputMode}
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function SelectField({ label, value, onChange, error, options, placeholder }) {
  return (
    <div className="field">
      <label className="web-label">{label}</label>
      <div className={`field-box select-box ${error ? "invalid" : ""}`}>
        <select
          className={value ? "" : "placeholder"}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder || `Select ${label}`}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function AmountField({ value, onChange, error }) {
  return (
    <div className="field">
      <label className="web-label">Amount</label>
      <div className={`field-box ${error ? "invalid" : ""}`}>
        <span className="rupee" style={{ marginRight: 6 }}>
          ₹
        </span>
        <input
          inputMode="decimal"
          placeholder="Enter amount"
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
