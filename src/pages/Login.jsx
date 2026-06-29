import { useState } from "react";
import { usePayment } from "../context/PaymentContext";
import { useVersion } from "../hooks/useVersion";
import { BrowserBar, PortalHeader, SecureFooter } from "../components/Chrome";

export default function Login() {
  const { go } = useVersion();
  const { drafts, saveDraft } = usePayment();
  const [mode, setMode] = useState(() => drafts.login?.mode || "customer"); // "customer" | "mobile"
  const [loginId, setLoginId] = useState(() => drafts.login?.loginId || "");
  const [password, setPassword] = useState(() => drafts.login?.password || "");
  const [submitted, setSubmitted] = useState(false);

  const idValid =
    mode === "mobile" ? /^\d{10}$/.test(loginId) : loginId.trim().length >= 4;
  const pwValid = password.length >= 4;
  const valid = idValid && pwValid;

  function proceed() {
    setSubmitted(true);
    if (!valid) return;
    saveDraft("login", { mode, loginId, password });
    // Carry the masked login id forward to the OTP screen.
    go("/otp", { state: { loginId, mode } });
  }

  return (
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <PortalHeader subtitle="Login" onBack={() => go("/")} />

        <div className="pad">
          <h2 className="form-title">Log in to continue</h2>

          <div className="seg-toggle">
            <button
              className={mode === "customer" ? "on" : ""}
              onClick={() => {
                setMode("customer");
                setLoginId("");
              }}
            >
              Customer ID
            </button>
            <button
              className={mode === "mobile" ? "on" : ""}
              onClick={() => {
                setMode("mobile");
                setLoginId("");
              }}
            >
              Mobile Number
            </button>
          </div>

          <div className="field">
            <div className={`field-box ${submitted && !idValid ? "invalid" : ""}`}>
              <input
                inputMode={mode === "mobile" ? "numeric" : "text"}
                placeholder={
                  mode === "mobile" ? "Mobile Number*" : "Customer ID*"
                }
                value={loginId}
                onChange={(e) =>
                  setLoginId(
                    mode === "mobile"
                      ? e.target.value.replace(/\D/g, "").slice(0, 10)
                      : e.target.value
                  )
                }
              />
            </div>
            {submitted && !idValid && (
              <p className="field-error">
                {mode === "mobile"
                  ? "Enter a valid 10-digit mobile number"
                  : "Enter a valid Customer ID"}
              </p>
            )}
          </div>

          <div className="field">
            <div className={`field-box ${submitted && !pwValid ? "invalid" : ""}`}>
              <input
                type="password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {submitted && !pwValid && (
              <p className="field-error">Enter your password</p>
            )}
          </div>

          <p className="field-helper">Demo login — any password (4+ chars) works.</p>
        </div>

        <SecureFooter />
      </div>

      <div className="sticky-cta">
        <button className="btn" disabled={submitted && !valid} onClick={proceed}>
          Proceed
        </button>
      </div>
    </div>
  );
}
