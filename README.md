# Paytm Fee Collection (demo)

A React app that recreates the **Paytm payment-link / fee-collection** screens you
land on after scanning a merchant QR code, plus a **dummy Paytm payment flow**.

## The flow

```
Scan QR  →  Merchant form  →  Paytm checkout  →  Processing  →  Result
  /            /pay/:id        /checkout         /processing    /result
```

1. **Scan page (`/`)** — a mocked QR scanner. Tap any demo merchant QR to "scan" it.
2. **Merchant form (`/pay/:merchantId`)** — two different form types, both reached
   by scanning a QR:
   - **IPS College – Student Fee Collection**: name, course (with "Other"
     handling), start year, amount → *Proceed to Pay ₹X*.
   - **Aakash Fee Payment**: 11-digit PSID (validated), roll number, amount, and a
     Terms & Conditions checkbox → *Proceed*.
3. **Checkout (`/checkout`)** — Paytm-style payment method picker (UPI / Card /
   Net Banking / Wallet) with per-method input + validation.
4. **Processing (`/processing`)** — animated bank-authorisation steps (dummy).
5. **Result (`/result`)** — success or failure with a transaction receipt. Failure
   lets you retry.

## Adding another QR/merchant

Everything is config-driven. Add an entry to `src/data/merchants.js` describing the
fields, and a new QR appears on the scan page and renders its own form — no new
components needed.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

Tip: open browser dev tools in mobile/device mode — the UI is mobile-first and
shows a phone frame on wider screens.

## Stack

React 19 · React Router · Vite · plain CSS design system (no UI library).
The QR codes are decorative SVGs (`src/components/QRCode.jsx`), and the payment
is entirely simulated — no real money or network calls.
