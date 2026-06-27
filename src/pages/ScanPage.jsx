import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { merchants, merchantList } from "../data/merchants";
import QRCode from "../components/QRCode";
import { PaytmWordmark } from "../components/Chrome";

// Map a decoded QR string to a known merchant id (or null if it doesn't match).
// Accepts a bare id ("ips"), a full deep link (".../pay/ips"), or any URL whose
// last path segment is a merchant id.
function resolveMerchantId(text) {
  if (!text) return null;
  const t = text.trim();
  if (merchants[t]) return t;
  const m = t.match(/\/pay\/([^/?#]+)/i);
  if (m && merchants[m[1]]) return m[1];
  try {
    const seg = new URL(t).pathname.split("/").filter(Boolean).pop();
    if (seg && merchants[seg]) return seg;
  } catch {
    /* not a URL — ignore */
  }
  return null;
}

export default function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const supported =
    typeof window !== "undefined" && "BarcodeDetector" in window;

  function stopScan() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }

  // Always stop the camera when leaving the page.
  useEffect(() => () => stopScan(), []);

  async function startScan() {
    setError("");
    if (!supported) {
      setError(
        "Live scanning isn’t available in this browser — tap a demo QR below instead."
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setScanning(true);
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const scan = async () => {
        if (!streamRef.current) return;
        try {
          const codes = await detector.detect(video);
          if (codes && codes.length) {
            const id = resolveMerchantId(codes[0].rawValue);
            if (id) {
              stopScan();
              navigate(`/pay/${id}`);
              return;
            }
            setError("Scanned a QR, but it isn’t a demo merchant code.");
          }
        } catch {
          /* transient per-frame decode error — keep going */
        }
        timerRef.current = setTimeout(scan, 250);
      };
      timerRef.current = setTimeout(scan, 300);
    } catch (e) {
      stopScan();
      setError(
        e && e.name === "NotAllowedError"
          ? "Camera permission denied. Allow camera access to scan."
          : "Couldn’t start the camera — tap a demo QR below instead."
      );
    }
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

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
          Point your camera at a merchant QR, or tap a demo QR below to open its
          payment page.
        </p>

        <div className="scanner">
          <div className="scanner-frame">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            {scanning && <span className="scan-line" />}
            <video
              ref={videoRef}
              className="scan-video"
              playsInline
              muted
              style={{ display: scanning ? "block" : "none" }}
            />
            {!scanning && (
              <div style={{ opacity: 0.5 }}>
                <QRCode seed="viewfinder" size={110} />
              </div>
            )}
          </div>

          <div className="scan-actions">
            {scanning ? (
              <button className="scan-cam-btn ghost" onClick={stopScan}>
                Stop scanning
              </button>
            ) : (
              <button className="scan-cam-btn" onClick={startScan}>
                Scan with camera
              </button>
            )}
          </div>
          {error && <p className="scan-error">{error}</p>}
        </div>

        <p className="qr-choice-title">Demo merchant QR codes</p>
        <div className="qr-grid">
          {merchantList.map((m) => (
            <button
              key={m.id}
              className="qr-card"
              onClick={() => navigate(`/pay/${m.id}`)}
            >
              <QRCode value={`${origin}/pay/${m.id}`} size={120} />
              <div className="qr-merchant">
                {m.layout === "hero" ? m.name : m.headerTitle}
              </div>
              <div className="qr-tag">Tap or scan</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
