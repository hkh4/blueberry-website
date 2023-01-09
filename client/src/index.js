import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { DocumentsContextProvider } from "./contexts/DocumentsContext";
import { AuthContextProvider } from "./contexts/AuthContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <DocumentsContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </DocumentsContextProvider>
);
