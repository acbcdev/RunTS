# Handoff: React Doctor Top 3 Fixes

## Context

Ran `npx -y react-doctor@latest` on the app workspace. Score: 37/100 Critical. The top 3 errors to fix are below.

## Issues to Fix

### 1. Security: `new Function()` code injection

- **File:** `src/features/editor/run-code/worker.ts:141`
- **Code:** `new Function(pipeline.code)();`
- **Risk:** Executes untrusted code strings — code injection vulnerability.
- **Fix direction:** Evaluate alternatives. The code likely needs to run user-provided JS. Options: (a) use `JSON.parse` if it's data, (b) isolate in a sandboxed iframe/web worker with CSP, (c) use a safe interpreter like `Function` constructor with restricted scope.

### 2. Bug: Conditional hooks in Markdown code block component

- **File:** `src/features/ai/messages/Markdown.tsx:22`
- **Code:** `useApparenceStore` called inside a `code` render function (not a top-level component or hook).
- **Risk:** React hook rules violated — unstable hook order causes unpredictable state.
- **Fix direction:** Extract the code block into its own named component (e.g., `CodeBlock`) where hooks are called at the top level. Return the component from the `code` prop.

### 3. Security: vitest supply chain score

- **File:** `package.json:96`
- **Package:** `vitest@3.2.4` scored 25/100 on Socket's vulnerability axis.
- **Fix direction:** Run `npm audit` or check for patched version. Upgrade vitest to a version with no known CVEs. If no safe version exists, document acceptance and bump `supplyChain.minScore` in react-doctor config.

## Verification

After fixing:
- Run `npx react-doctor@latest` and confirm top 3 are resolved.
- Run `pnpm lint` and `pnpm test` to verify no regressions.
- The worker.ts fix specifically: test code execution still works for valid inputs and malicious inputs are blocked.

## Suggested Skills

- **diagnose** — if the worker.ts fix introduces regressions or unexpected behavior.
- **tdd** — write tests for the new `CodeBlock` component and the sandboxed execution path.
- **react-doctor** — re-run after fixes to verify score improvement.

## Files to Modify

| File | Change |
|------|--------|
| `src/features/editor/run-code/worker.ts` | Replace `new Function()` with safe alternative |
| `src/features/ai/messages/Markdown.tsx` | Extract code block into top-level component |
| `package.json` | Upgrade vitest version |
