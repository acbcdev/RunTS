import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Prompt } from "./PrompInput";

const render = (isLoading: boolean) =>
	renderToStaticMarkup(
		<Prompt
			value=""
			onValueChange={vi.fn()}
			isLoading={isLoading}
			onSubmit={vi.fn()}
			stop={vi.fn()}
		/>,
	);

describe("Prompt", () => {
	it("names the send and stop button", () => {
		expect(render(false)).toMatch(/<button[^>]*aria-label="Send message"/);
		expect(render(true)).toMatch(/<button[^>]*aria-label="Stop generation"/);
	});
});
