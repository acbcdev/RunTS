import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "@/features/common/utils/addLogsToLines";

describe("injectLogsIntoCode - Multiline Expression Cases", () => {
	it("collapses a multiline Array.reduce expression into one line", () => {
		const input = `Array(limit).fill(0).reduce((acc, _, index) => {
  const spaces = ' '.repeat(
    Math.abs(limit - count) / 2
  );
  const stars = '*'.repeat(count) + '\\n';
  index >= Math.floor(limit / 2)
    ? count -= 2
    : count += 2;
  return \`\${acc}\${spaces}\${stars}\`;
}, '\\n');`;

		const expected =
			"console.log(Array(limit).fill(0).reduce((acc, _, index) => { const spaces = ' '.repeat( Math.abs(limit - count) / 2 ); const stars = '*'.repeat(count) + '\\n'; index >= Math.floor(limit / 2) ? count -= 2 : count += 2; return `${acc}${spaces}${stars}`; }, '\\n'));";

		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});
});
