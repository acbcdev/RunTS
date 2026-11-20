# 007 — Use a shared popup entrance curve

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: MEDIUM
- **Category**: Easing & cohesion
- **Estimated scope**: index.css plus tooltip/select/popover/context-menu/dialog

## Problem

Interactive popup animations inherit generic ease from tw-animate-css without a shared deliberate curve. Existing Tailwind duration utilities already provide the necessary duration scale.

Current code at `packages/app/src/features/ui/popover.tsx:31`:

```tsx
data-[state=open]:animate-in data-[state=closed]:animate-out
```

## Target

In index.css @theme define `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`. Use `duration-150 ease-out` on tooltip, select, popover and both context-menu content variants; use `duration-200 ease-out` on dialog content and overlay. Instant command palette and instant-open tooltip bypass remain instant. No extra unused curves or separate duration token system.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Add the exact shared ease-out token to the existing @theme block.
2. Add duration-150 ease-out to ui/tooltip.tsx, select.tsx, popover.tsx, and both context/submenu content classes in context-menu.tsx.
3. Add ease-out to dialog content (already duration-200) and duration-200 ease-out to dialog overlay.
4. Preserve existing correct origins, exit states, fade/zoom95, and popup geometry. Do not change Sonner's own animation or the unused .elastic/.theme-transition rules.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Open each popup at normal speed: it responds promptly and settles without bounce. At 10% playback confirm matching timing, correct origins, no first-frame flash, and instant command/skip-delay tooltip exemptions.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

