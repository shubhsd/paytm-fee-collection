import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { PaymentProvider } from "./context/PaymentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </BrowserRouter>
  </StrictMode>
);
