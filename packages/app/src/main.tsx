import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion
createRoot(document.getElementById("root")!).render(<App />);
