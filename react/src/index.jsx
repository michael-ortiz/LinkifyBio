import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfirmProvider } from "material-ui-confirm";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
);
