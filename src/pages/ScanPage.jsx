import { useNavigate } from "react-router-dom";
import { merchantList } from "../data/merchants";
import QRCode from "../components/QRCode";
import { PaytmWordmark } from "../components/Chrome";

export default function ScanPage() {
  const navigate = useNavigate();

  return (
    <div className="page scroll-area">
      <div className="scan-wrap">
        <div className="scan-top">
          <span className="paytm-pill">
            <PaytmWordmark />
          </span>
          <span style={{ opacity: 0.8, fontSize: 13 }}>Scan &amp; Pay</span>
        </div>

        <h1 className="scan-headline">Scan a QR code to pay</h1>
        <p className="scan-sub">
          Point your camera at a merchant QR. We&apos;ve mocked the scanner —
          tap any QR below to open its payment page.
        </p>

        <div className="scanner">
          <div className="scanner-frame">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <span className="scan-line" />
            <div style={{ opacity: 0.5 }}>
              <QRCode seed="viewfinder" size={120} />
            </div>
          </div>
          <p className="scan-hint">Align the QR within the frame</p>
        </div>

        <p className="qr-choice-title">Demo merchant QR codes</p>
        <div className="qr-grid">
          {merchantList.map((m) => (
            <button
              key={m.id}
              className="qr-card"
              onClick={() => navigate(`/pay/${m.id}`)}
            >
              <QRCode seed={m.id} size={120} />
              <div className="qr-merchant">
                {m.layout === "hero" ? m.name : m.headerTitle}
              </div>
              <div className="qr-tag">Tap to scan</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
