import { createRoot } from "react-dom/client";
import "./index.css";
import * as Sentry from "@sentry/react";
import { App } from "./App.tsx";

Sentry.init({
	dsn: "https://ef20353dd269062cbb63a57fbd795f59@o4510321214750720.ingest.us.sentry.io/4510321217437696",
	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events

	sendDefaultPii: true,
});

// Stale deploy: browser holds an old index.html referencing chunk/CSS hashes
// that no longer exist after a new deploy. Reload once to fetch the fresh one.
window.addEventListener("vite:preloadError", () => {
	if (sessionStorage.getItem("vite-reloaded")) return;
	sessionStorage.setItem("vite-reloaded", "true");
	window.location.reload();
});

const container = document.querySelector("#root");
// biome-ignore lint/style/noNonNullAssertion: <the html has the root>
const root = createRoot(container!);
root.render(<App />);
