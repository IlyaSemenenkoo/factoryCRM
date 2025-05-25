import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // або видали цей рядок, якщо стилів немає

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
