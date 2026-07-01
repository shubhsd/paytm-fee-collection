import { useState } from "react";
import { Navigate } from "react-router-dom";
import { usePayment, formatINR } from "../context/PaymentContext";
import { useVersion } from "../hooks/useVersion";
import { BrowserBar, SecureFooter } from "../components/Chrome";
import { ChevronLeft } from "../components/icons";
import { METHODS, UPI_APPS, BANKS, methodValid } from "../data/payment";

export default function Checkout() {
  const { order } = usePayment();
  const { go, base } = useVersion();
  const [method, setMethod] = useState("upi");
  const [pay, setPay] = useState({});

  if (!order) return <Navigate to={base} replace />;

  const set = (k, v) => setPay((p) => ({ ...p, [k]: v }));
  const isValid = methodValid(method, pay);

  function handlePay() {
    go("/processing", { state: { method } });
  }

  return (
    <div className="page">
      <BrowserBar />
      <div className="scroll-area">
        <div className="checkout-head">
          <button className="back" onClick={() => go(-1)}>
            <ChevronLeft style={{ width: 18, height: 18 }} /> Back
          </button>
          <div className="ch-amount">{formatINR(order.amount)}</div>
          <div className="ch-to">Paying to {order.merchantName}</div>
        </div>

        <div className="pad" style={{ paddingTop: 8 }}>
          <p className="pay-section-label">Choose payment method</p>
          <div className="method-list">
            {METHODS.map((m) => (
              <div key={m.id}>
                <button
                  className={`method ${method === m.id ? "active" : ""}`}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="m-icon">{m.icon}</span>
                  <span className="m-text">
                    <span className="m-title">{m.title}</span>
                    <span className="m-sub">{m.sub}</span>
                  </span>
                  <span className={`radio ${method === m.id ? "on" : ""}`} />
                </button>

                {method === m.id && (
                  <div className="method-detail">
                    {m.id === "upi" && (
                      <>
                        <div className="input-row">
                          <label>Pay using</label>
                          <div className="upi-apps">
                            {UPI_APPS.map((app) => (
                              <button
                                key={app.id}
                                type="button"
                                className={`upi-app ${pay.upiApp === app.id ? "on" : ""}`}
                                onClick={() =>
                                  set("upiApp", pay.upiApp === app.id ? "" : app.id)
                                }
                              >
                                <img
                                  className="upi-app-logo"
                                  src={app.logo}
                                  alt={app.name}
                                />
                                {app.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="input-row">
                          <label>Or enter UPI ID</label>
                          <input
                            placeholder="yourname@upi"
                            value={pay.vpa || ""}
                            onChange={(e) => set("vpa", e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {(m.id === "card" || m.id === "corpcard") && (
                      <>
                        <div className="input-row">
                          <label>Card Number</label>
                          <input
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                            value={pay.card || ""}
                            onChange={(e) =>
                              set(
                                "card",
                                e.target.value
                                  .replace(/[^\d]/g, "")
                                  .slice(0, 16)
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim()
                              )
                            }
                          />
                        </div>
                        <div className="split-2">
                          <div className="input-row">
                            <label>Expiry</label>
                            <input
                              placeholder="MM/YY"
                              value={pay.exp || ""}
                              onChange={(e) =>
                                set(
                                  "exp",
                                  e.target.value
                                    .replace(/[^\d]/g, "")
                                    .slice(0, 4)
                                    .replace(/(\d{2})(\d)/, "$1/$2")
                                )
                              }
                            />
                          </div>
                          <div className="input-row">
                            <label>CVV</label>
                            <input
                              inputMode="numeric"
                              type="password"
                              placeholder="•••"
                              value={pay.cvv || ""}
                              onChange={(e) =>
                                set("cvv", e.target.value.replace(/[^\d]/g, "").slice(0, 3))
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {m.id === "netbanking" && (
                      <div className="input-row">
                        <label>Select Bank</label>
                        <select
                          className="input-row"
                          style={{
                            width: "100%",
                            padding: "13px 14px",
                            borderRadius: 10,
                            border: "1px solid var(--line-strong)",
                            fontSize: 15,
                            fontWeight: 600,
                            background: "#fff",
                          }}
                          value={pay.bank || ""}
                          onChange={(e) => set("bank", e.target.value)}
                        >
                          <option value="">Choose your bank</option>
                          {BANKS.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="os-row total">
              <span>Total payable</span>
              <span>{formatINR(order.amount)}</span>
            </div>
          </div>
        </div>

        <SecureFooter />
      </div>

      <div className="sticky-cta">
        <button className="btn btn-dark" disabled={!isValid} onClick={handlePay}>
          Pay {formatINR(order.amount)}
        </button>
      </div>
    </div>
  );
}
