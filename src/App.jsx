import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import VersionLanding from "./pages/VersionLanding";

// ---- Version 1: mobile phone-frame preview ----
import Home from "./pages/Home";
import DeptForm from "./pages/DeptForm";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import EntitySelect from "./pages/EntitySelect";
import Checkout from "./pages/Checkout";
import Processing from "./pages/Processing";
import Result from "./pages/Result";

// ---- Version 2: full-width desktop web app ----
import WebNav from "./pages/v2/WebNav";
import V2Home from "./pages/v2/Home";
import V2DeptForm from "./pages/v2/DeptForm";
import V2Login from "./pages/v2/Login";
import V2Otp from "./pages/v2/Otp";
import V2EntitySelect from "./pages/v2/EntitySelect";
import V2Checkout from "./pages/v2/Checkout";
import V2Processing from "./pages/v2/Processing";
import V2Result from "./pages/v2/Result";

function V1App() {
  return (
    <div className="app-shell">
      <div className="phone">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="dept/form" element={<DeptForm />} />
          <Route path="login" element={<Login />} />
          <Route path="otp" element={<Otp />} />
          <Route path="entity" element={<EntitySelect />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="processing" element={<Processing />} />
          <Route path="result" element={<Result />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function V2App() {
  return (
    <div className="web-shell">
      <WebNav />
      <Routes>
        <Route path="" element={<V2Home />} />
        <Route path="dept/form" element={<V2DeptForm />} />
        <Route path="login" element={<V2Login />} />
        <Route path="otp" element={<V2Otp />} />
        <Route path="entity" element={<V2EntitySelect />} />
        <Route path="checkout" element={<V2Checkout />} />
        <Route path="processing" element={<V2Processing />} />
        <Route path="result" element={<V2Result />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </div>
  );
}

// Scroll to the top of the page on every route change (incl. back navigation).
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<VersionLanding />} />
        <Route path="/v1/*" element={<V1App />} />
        <Route path="/v2/*" element={<V2App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
