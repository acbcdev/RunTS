# Animation improvements

Baseline: `94f1199`. User selected all eight findings plus both optional feedback opportunities for implementation.

Stack: React19/Tauri, Tailwind4/tw-animate-css, Radix, Motion12, Sonner. Product: crisp editor, minimal decorative movement.

Frequency estimates (not telemetry): very frequent editor tabs/toolbar/tooltips/command palette; frequent chat toggles/streaming/scroll; occasional settings/selects/popovers/context menus/toasts/New Chat; rare startup/update notices.

| Plan | Title | Severity | Status |
| --- | --- | --- | --- |
| [001](001-shared-tooltip-timing.md) | Share tooltip timing across controls | HIGH | DONE |
| [002](002-instant-command-palette.md) | Make command palette toggles instant | HIGH | DONE |
| [003](003-reduced-motion.md) | Respect reduced motion across overlays and chat | MEDIUM | DONE |
| [004](004-instant-chat-layout.md) | Remove chat layout animation and distortion | HIGH | DONE |
| [005](005-anchored-origins.md) | Anchor tooltip and select scale origins | MEDIUM | DONE |
| [006](006-explicit-transitions.md) | Limit transitions to changing properties | MEDIUM | DONE |
| [007](007-shared-popup-easing.md) | Use a shared popup entrance curve | MEDIUM | DONE |
| [008](008-static-chat-heading.md) | Remove decorative chat heading wobble | LOW | DONE |
| [009](009-theme-selection-feedback.md) | Fade theme selection checks without layout changes | LOW | DONE |
| [010](010-new-chat-press-feedback.md) | Acknowledge New Chat presses subtly | LOW | DONE |

## Execution order and dependencies

Execute 007 (shared curve) first, then 001, 002, 004, 005, 006, 008, 003, 009, 010. Plans intentionally share component files and should run sequentially in one isolated worktree. Plan003 accounts for removal of chat motion and heading wobble by004/008. Plans009/010 use the ease-out token introduced by007. Plan002 and001 instant-animation exemptions must survive reduced-motion CSS.

Use the existing dependencies. No commits requested. Keep source edits in an isolated executor worktree until reviewed; then integrate the reviewed diff into the user's working tree without committing.

The referenced review-animations/STANDARDS.md is absent from available local skill directories. Review against improve-animations/AUDIT.md instead and record that limitation. Mechanical checks are not a substitute for the listed normal/reduced-motion feel checks.

Execution discovery: Motion12's useReducedMotion does not subscribe React components to preference changes. Plan003 therefore specifies a minimal shared useSyncExternalStore hook for its two scroll consumers. Typecheck must use `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit` and the node config; the solution-level `tsc --noEmit` has no source files and does not validate the app.

Production CSS review caught a second dependency detail: Tailwind emits tw-animate-css enter/exit keyframes after authored media blocks. Plan003 uses scoped reduced-motion transform-variable overrides instead of same-name keyframes, preserving opacity and instant-animation exemptions.

Production CSS also places closed-state animate-out after animate-none, and installed tailwind-merge does not remove their conflict. Plan002 conditionally omits entry/exit classes entirely when the palette opts out, covering both content and overlay.

## Execution and verification

All ten plans were implemented in an isolated executor worktree, reviewed against AUDIT.md and integrated into the original checkout without staging or committing. No package/dependency changes. All 18 affected source paths match the reviewed implementation, including the new reactive preference hook and removal of the obsolete animated heading icon.

- PASS: production build; read-only Biome check on 17 changed/new source files; node-config typecheck; diff whitespace check; compiled popup timing/origin/reduced-motion cascade inspection; hook snapshot/media-change/unsubscribe/server-snapshot contract checks; dialog content/backdrop instant/default animation contract checks; HTTP smoke on root, CSS, dialog module and preference hook.
- App-config typecheck: 15 diagnostics, exactly identical to baseline 94f1199, with no new diagnostics.
- Vitest: 139 passing and 31 failing, matching baseline. Existing failures are 29 browser/localStorage setup failures in crypt/encryptedStorage tests and 2 codeValidator empty-code expectations.
- ESLint: unavailable on baseline and changed tree because no ESLint configuration exists. No unrelated lint setup was added.
- Live visual/slow-motion/touch feel checks: UNVERIFIED. Browser access host was unavailable, and native Chrome computer use was not approved. No alternative UI automation was used. The per-plan feel-check instructions remain for manual verification.

Review artifacts from this run: `/tmp/runts-motion-checks.json`, `/tmp/runts-motion-css-check.json` and `/tmp/runts-motion-reviewed.patch`. The temporary dev server was stopped after verification.

