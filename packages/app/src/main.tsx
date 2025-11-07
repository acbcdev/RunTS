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

const container = document.querySelector("#root");
// biome-ignore lint/style/noNonNullAssertion: <the html has the root>
const root = createRoot(container!);
root.render(<App />);
