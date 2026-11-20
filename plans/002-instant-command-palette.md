# 002 — Make command palette toggles instant

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 2 files

## Problem

CommandDialog inherits 200ms fade/zoom from DialogContent, plus an animated backdrop, on the high-frequency keyboard path.

Current code at `packages/app/src/features/ui/command.tsx:64`:

```tsx
<DialogContent
	className={cn("overflow-hidden p-0", className)}
	// showCloseButton={showCloseButton}
>
```

## Target

Add a narrowly scoped `animated?: boolean` prop to DialogContent and DialogOverlay, default true, and pass `animated={false}` in CommandDialog. When false neither content nor overlay includes entry/exit animation classes at all; occasional settings/shortcut dialogs retain their existing 200ms animations. Do not rely on conflicting animate-none utilities: installed tailwind-merge retains animate-out and production CSS places closed:animate-out later than closed:animate-none.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. In ui/dialog.tsx destructure `animated = true` from DialogContent and DialogOverlay and extend their prop types with `animated?: boolean`.
2. Move each component's data-state animate-in/animate-out classes into an `animated && "..."` conditional argument to cn; keep geometry, duration/easing and static fade/zoom variables in the normal base classes. Pass `animated={animated}` from DialogContent to its DialogOverlay. No animate-in/out class may remain on either DOM node when false. Do not forward animated onto the DOM. Do not substitute animate-none overrides; compiled CSS proved these fail on close.
3. Pass `animated={false}` from ui/command.tsx. Preserve focus trapping, Escape, portal behavior, dialog placement and all unrelated props.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent/DialogOverlay animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Repeatedly press Cmd/Ctrl+K, type a query and Escape: content and backdrop appear/disappear immediately with no scale or fade. Settings still animate at 200ms.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

