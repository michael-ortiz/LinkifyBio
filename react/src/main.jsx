import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfirmProvider } from "material-ui-confirm";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
);
