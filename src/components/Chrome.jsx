import { LockIcon, ShieldIcon } from "./icons";

export function BrowserBar({ url = "secure.paytmpayments.com" }) {
  return (
    <div className="browser-bar">
      <div className="browser-url">
        <LockIcon style={{ width: 12, height: 12 }} />
        {url}
      </div>
    </div>
  );
}

export function PaytmWordmark() {
  return (
    <span className="paytm-wordmark">
      <span className="pay">Pay</span>
      <span className="tm">tm</span>
    </span>
  );
}

export function SecureFooter() {
  return (
    <>
      <div className="secure-footer">
        <div className="secure-row">
          <ShieldIcon />
          100% Secure Payments &nbsp;Powered by&nbsp; <PaytmWordmark />
        </div>
      </div>
      <div className="brand-strip" />
    </>
  );
}

export function CreateLinkFooter() {
  return (
    <div className="secure-footer">
      <div style={{ marginBottom: 4 }}>
        <PaytmWordmark /> &nbsp;·&nbsp; To create Payment Links, visit
      </div>
      <a href="#link">business.paytm.com/payment-link</a>
    </div>
  );
}
