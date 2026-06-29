import { LockIcon, ShieldIcon, ChevronLeft } from "./icons";

export function BrowserBar({ url = "pay.punjablabour.gov.in" }) {
  return (
    <div className="browser-bar">
      <div className="browser-url">
        <LockIcon style={{ width: 12, height: 12 }} />
        {url}
      </div>
    </div>
  );
}

// Branded header used at the top of each inner page.
export function PortalHeader({
  title = "Punjab Labour Department",
  subtitle,
  onBack,
}) {
  return (
    <div className="portal-hero">
      {onBack && (
        <button className="hero-back" onClick={onBack} aria-label="Go back">
          <ChevronLeft style={{ width: 18, height: 18 }} />
        </button>
      )}
      <div className="portal-logo">
        <img src="/punjab-gov.svg" alt="Government of Punjab" />
      </div>
      <div className="portal-title">{title}</div>
      {subtitle && <div className="portal-sub">{subtitle}</div>}
    </div>
  );
}

export function SecureFooter() {
  return (
    <>
      <div className="secure-footer">
        <div className="secure-row">
          <ShieldIcon />
          100% Secure Government Payments
        </div>
      </div>
      <div className="brand-strip" />
    </>
  );
}
