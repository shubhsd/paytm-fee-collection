import { useState } from "react";
import { usePayment } from "../../context/PaymentContext";
import { useVersion } from "../../hooks/useVersion";
import { TextField } from "./fields";

export default function Login() {
  const { go } = useVersion();
  const { drafts, saveDraft } = usePayment();
  const [mode, setMode] = useState(() => drafts.login?.mode || "customer");
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
    go("/otp", { state: { loginId, mode } });
  }

  return (
    <main className="web-main web-main-narrow">
      <button className="web-back" onClick={() => go("/")}>
        ← Back to services
      </button>
      <h1 className="web-title">Log in to continue</h1>
      <p className="web-subtitle">
        Access Punjab Labour Department · Department portal.
      </p>

      <div className="web-card">
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

        <TextField
          label={mode === "mobile" ? "Mobile Number" : "Customer ID"}
          inputMode={mode === "mobile" ? "numeric" : "text"}
          value={loginId}
          onChange={(e) =>
            setLoginId(
              mode === "mobile"
                ? e.target.value.replace(/\D/g, "").slice(0, 10)
                : e.target.value
            )
          }
          error={
            submitted && !idValid
              ? mode === "mobile"
                ? "Enter a valid 10-digit mobile number"
                : "Enter a valid Customer ID"
              : ""
          }
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={submitted && !pwValid ? "Enter your password" : ""}
        />
        <p className="field-helper">Demo login — any password (4+ chars) works.</p>

        <button
          className="btn"
          style={{ marginTop: 18 }}
          disabled={submitted && !valid}
          onClick={proceed}
        >
          Proceed
        </button>
      </div>
    </main>
  );
}
