# 003 — Respect reduced motion across overlays and chat

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: global CSS, one shared preference hook, chat container, scroll button, switch, generation spinner

## Problem

App source and installed animation libraries do not adapt popup transforms or smooth chat scrolling to the system preference. Animated status indicators must remain understandable.

Current code at `packages/app/src/features/ui/chat-container.tsx:27`:

```tsx
resize="smooth"
initial="instant"
```

## Target

Under `@media (prefers-reduced-motion: reduce)` set tw-animate-css transform variables to identity on existing popup content slots, retaining their opacity animation and normal durations. Do not redefine enter/exit keyframes by name: the production build emits the library keyframes later, overriding same-name reduced variants. Do not globally disable animation. Chat resize and explicit scroll-to-bottom use `instant` under the preference. Switch thumb position updates immediately, keeping its root color feedback. Scroll button has no scale/translation under reduction, but fades at 150ms. Generation spinner uses opacity pulse under reduction instead of rotation.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. In index.css add a `@media (prefers-reduced-motion: reduce)` block targeting `[data-slot="dialog-content"]`, `[data-slot="tooltip-content"]`, `[data-slot="popover-content"]`, `[data-slot="select-content"]`, `[data-slot="context-menu-content"]` and `[data-slot="context-menu-sub-content"]`. Set `--tw-enter-scale: 1; --tw-exit-scale: 1; --tw-enter-translate-x: 0; --tw-enter-translate-y: 0; --tw-exit-translate-x: 0; --tw-exit-translate-y: 0; --tw-enter-rotate: 0; --tw-exit-rotate: 0;`. Keep these scoped declarations outside Tailwind layers so they override motion utility variables. Preserve opacity variables and do not override animation-name/shorthand, so instant command palette and instant-open tooltips stay unanimated. Inspect generated CSS for correct media scoping and cascade priority. The initial same-name-keyframe approach failed production output order and must not be used.
2. Create `packages/app/src/features/common/hooks/useReducedMotion.ts` using React's `useSyncExternalStore` to read `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, subscribe to that media query's `change` event, and remove the listener on cleanup. Keep subscribe/getSnapshot stable at module scope and do not access window until they are called. Import this hook in ui/chat-container.tsx and scroll-button.tsx. Set resize to `reduceMotion ? "instant" : "smooth"`, preserve initial instant, and use `scrollToBottom({ animation: reduceMotion ? "instant" : "smooth" })` on scroll-button activation. Check installed scroll-option types. This hook is necessary because the installed Motion12 hook only snapshots useState once and never updates on preference changes despite its documentation. Do not add a generic media-query abstraction or a new dependency.
3. Add `motion-reduce:transition-none` only to the switch thumb (not the color-feedback root).
4. Add `motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-opacity` to ScrollButton so hidden/visible states retain only opacity feedback.
5. Add `motion-reduce:animate-pulse` to the generation widget Loader2 that normally has animate-spin. Keep existing Thinking pulse and static color-based spinner feedback.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Emulate prefers-reduced-motion before page load and toggle it while open. Settings/popovers/tooltips fade without zoom or slide; switch jumps between correct checked positions; scroll button fades in place; long/streaming chat and scroll-to-bottom move instantly. Normal preference retains smooth scrolling. No blanket zero-feedback policy.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

