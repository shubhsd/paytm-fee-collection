import { Routes, Route, Navigate } from "react-router-dom";
import ScanPage from "./pages/ScanPage";
import MerchantForm from "./pages/MerchantForm";
import Checkout from "./pages/Checkout";
import Processing from "./pages/Processing";
import Result from "./pages/Result";

export default function App() {
  return (
    <div className="app-shell">
      <div className="phone">
        <Routes>
          <Route path="/" element={<ScanPage />} />
          <Route path="/pay/:merchantId" element={<MerchantForm />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
