import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: <the html has the root>
createRoot(document.getElementById("root")!).render(<App />);
