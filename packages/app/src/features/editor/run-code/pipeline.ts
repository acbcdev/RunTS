import { injectLogsIntoCode } from "./addLogsToLines";
import { validateCode, wrapCodeForExecution } from "./codeValidator";
import { transform } from "./transform";

export type PipelineResult =
	| { ready: true; code: string; lines: number[] }
	| { ready: false; error: string };

/**
 * Single seam for the run-code stage order: transform -> inject logs ->
 * validate -> wrap for execution. Each stage is pure and independently
 * tested, but the order itself is only correct one way (validate must see
 * the post-injection code; wrap must see the validated code) — owning that
 * order here means flipping two stages is a one-file diff, not a silent
 * worker.ts bug.
 */
export function preparePipeline(
	rawCode: string,
	name: string | undefined,
	injectLogs: boolean,
): PipelineResult {
	const transpiled = transform(rawCode, name) ?? "";
	const { code, lines } = injectLogsIntoCode(transpiled, { injectLogs });

	const validation = validateCode(code);
	if (!validation.valid) {
		return {
			ready: false,
			error: `Validation Error: ${validation.errors.join("; ")}`,
		};
	}

	return { ready: true, code: wrapCodeForExecution(code), lines };
}
