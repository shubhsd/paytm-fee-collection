import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useVersion } from "../../hooks/useVersion";

export default function Otp() {
  const { go } = useVersion();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const target = state?.loginId
    ? state.mode === "mobile"
      ? `+91 ${String(state.loginId).replace(/\d(?=\d{4})/g, "•")}`
      : `Customer ID ${state.loginId}`
    : "your registered mobile number";

  const valid = /^\d{6}$/.test(otp);

  function proceed() {
    setSubmitted(true);
    if (!valid) return;
    go("/entity");
  }

  return (
    <main className="web-main web-main-narrow">
      <button className="web-back" onClick={() => go(-1)}>
        ← Back
      </button>
      <h1 className="web-title">Verify OTP</h1>
      <p className="web-subtitle">
        We&apos;ve sent a 6-digit code to {target}.
      </p>

      <div className="web-card">
        <div className="field">
          <label className="web-label">Enter OTP</label>
          <div className={`field-box ${submitted && !valid ? "invalid" : ""}`}>
            <input
              inputMode="numeric"
              className="otp-input"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          {submitted && !valid && (
            <p className="field-error">Enter the 6-digit OTP</p>
          )}
        </div>
        <p className="field-helper">Demo OTP — enter any 6 digits to continue.</p>

        <button
          className="btn"
          style={{ marginTop: 18 }}
          disabled={submitted && !valid}
          onClick={proceed}
        >
          Verify &amp; Proceed
        </button>
      </div>
    </main>
  );
}
