import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useVersion } from "../hooks/useVersion";
import { BrowserBar, PortalHeader, SecureFooter } from "../components/Chrome";

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
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <PortalHeader subtitle="Verify OTP" onBack={() => go(-1)} />

        <div className="pad">
          <h2 className="form-title">Enter OTP</h2>
          <p className="field-helper" style={{ marginTop: -4 }}>
            We&apos;ve sent a 6-digit code to {target}.
          </p>

          <div className="field" style={{ marginTop: 14 }}>
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
        </div>

        <SecureFooter />
      </div>

      <div className="sticky-cta">
        <button className="btn" disabled={submitted && !valid} onClick={proceed}>
          Verify &amp; Proceed
        </button>
      </div>
    </div>
  );
}
