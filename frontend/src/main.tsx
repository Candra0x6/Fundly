import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import App from "./App";
import { ActorProvider, AgentProvider } from "@ic-reactor/react";
import { canisterId, idlFactory } from "../../src/declarations/backend"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
      <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
        <App />
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>
);
