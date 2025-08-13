import { runCodeWorker } from "@/lib/runCode";
import { describe, expect, it } from "vitest";

describe("setTimeout and debounce functionality", () => {
	it("should execute setTimeout correctly", async () => {
		const code = `
// Test if setTimeout works at all
console.log('Before setTimeout');
setTimeout(() => {
  console.log('setTimeout executed');
}, 10);
console.log('After setTimeout');
		`;

		const result = await runCodeWorker(code, {
			injectLogs: false,
			timeoutWorker: 5000, // Give enough time for setTimeout to execute
		});

		// Should see both synchronous logs and the setTimeout log
		expect(result).toHaveLength(3);
		expect(result[0].content).toBe("Before setTimeout");
		expect(result[1].content).toBe("After setTimeout");
		expect(result[2].content).toBe("setTimeout executed");
	});

	it("should execute debounce function correctly", async () => {
		const code = `
var debounce = function (fn, t) {
  let timerID;
  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
      fn.apply(this, args);
    }, t) 
  }
};

const log = debounce(console.log, 50);
log('Hello 1'); // should be cancelled
log('Hello 2'); // should be cancelled  
log('Hello 3'); // should be logged at t=50ms
		`;

		const result = await runCodeWorker(code, {
			injectLogs: false,
			timeoutWorker: 5000, // Give enough time for debounce to execute
		});

		// Should only see the last debounced call
		expect(result).toHaveLength(1);
		expect(result[0].content).toBe("Hello 3");
	});
});