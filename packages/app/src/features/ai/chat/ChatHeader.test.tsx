import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ChatHeader } from "./ChatHeader";

describe("ChatHeader", () => {
	it("names the button for starting a new chat", () => {
		const html = renderToStaticMarkup(<ChatHeader onNewChat={vi.fn()} />);
		expect(html).toMatch(/<button[^>]*aria-label="New chat"/);
	});
});
