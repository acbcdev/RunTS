import { describe, expect, it, vi } from "vitest";

describe("setTimeout and debounce functionality in worker environment", () => {
	it("should handle setTimeout correctly", () => {
		// Mock the web worker environment
		const mockGlobalThis = {
			console: {
				log: vi.fn(),
				error: vi.fn(),
				info: vi.fn(),
				warn: vi.fn(),
				clear: vi.fn(),
			},
			setTimeout: vi.fn(),
			clearTimeout: vi.fn(),
			postMessage: vi.fn(),
		};

		// Mock setTimeout to behave like the real one
		let timeoutId = 0;
		const timeouts = new Map();
		
		mockGlobalThis.setTimeout = vi.fn((callback, delay) => {
			const id = ++timeoutId;
			timeouts.set(id, callback);
			// Simulate immediate execution for testing
			setTimeout(() => {
				if (timeouts.has(id)) {
					callback();
				}
			}, 0);
			return id;
		});

		mockGlobalThis.clearTimeout = vi.fn((id) => {
			timeouts.delete(id);
		});

		// Mock the worker execution environment
		const self = mockGlobalThis;

		// Test setTimeout functionality
		const testCode = `
			console.log('Before setTimeout');
			setTimeout(() => {
				console.log('setTimeout executed');
			}, 10);
			console.log('After setTimeout');
		`;

		// Evaluate in the mock environment
		const evalInWorker = new Function('self', `
			${testCode}
		`);

		evalInWorker(self);

		// Check that setTimeout was called
		expect(mockGlobalThis.setTimeout).toHaveBeenCalledWith(
			expect.any(Function),
			10
		);
	});

	it("should handle debounce function correctly", async () => {
		const logs: string[] = [];
		
		// Mock console.log to capture output
		const mockConsoleLog = vi.fn((message) => {
			logs.push(message);
		});

		// Mock setTimeout with real timing for debounce test
		const timeouts = new Map();
		let timeoutId = 0;

		const mockSetTimeout = vi.fn((callback, delay) => {
			const id = ++timeoutId;
			const timeoutHandle = setTimeout(() => {
				if (timeouts.has(id)) {
					callback();
				}
			}, delay);
			timeouts.set(id, timeoutHandle);
			return id;
		});

		const mockClearTimeout = vi.fn((id) => {
			const timeoutHandle = timeouts.get(id);
			if (timeoutHandle) {
				clearTimeout(timeoutHandle);
				timeouts.delete(id);
			}
		});

		// Create a test environment with the debounce function
		const testEnv = {
			console: { log: mockConsoleLog },
			setTimeout: mockSetTimeout,
			clearTimeout: mockClearTimeout,
		};

		// Execute the debounce code
		const debounceCode = `
			var debounce = function (fn, t) {
				let timerID;
				return function (...args) {
					clearTimeout(timerID);
					timerID = setTimeout(() => {
						fn.apply(this, args);
					}, t);
				};
			};

			const log = debounce(console.log, 50);
			log('Hello 1'); // should be cancelled
			log('Hello 2'); // should be cancelled  
			log('Hello 3'); // should be logged
		`;

		// Evaluate the code in our test environment
		const evalInEnv = new Function('console', 'setTimeout', 'clearTimeout', debounceCode);
		evalInEnv(testEnv.console, testEnv.setTimeout, testEnv.clearTimeout);

		// Wait for the debounced function to execute
		await new Promise(resolve => setTimeout(resolve, 100));

		// Check that only the last call was executed
		expect(logs).toHaveLength(1);
		expect(logs[0]).toBe('Hello 3');
		
		// Verify setTimeout and clearTimeout were called correctly
		expect(mockSetTimeout).toHaveBeenCalledTimes(3);
		expect(mockClearTimeout).toHaveBeenCalledTimes(2); // First two calls should be cleared
	});
});