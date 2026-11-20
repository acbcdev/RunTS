# 005 — Anchor tooltip and select scale origins

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 files

## Problem

TooltipContent and SelectContent animate at 95% scale but never consume Radix's measured transform origins, so they scale around the center rather than their triggers.

Current code at `packages/app/src/features/ui/select.tsx:65`:

```tsx
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
```

## Target

Add `origin-(--radix-tooltip-content-transform-origin)` to TooltipContent and `origin-(--radix-select-content-transform-origin)` to SelectContent. Keep 95% scale and existing side-aware slide directions unchanged.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Add the Radix tooltip origin utility in ui/tooltip.tsx.
2. Add the Radix select origin utility in ui/select.tsx.
3. Reuse the exact custom-variable origin syntax already present in ui/popover.tsx and context-menu.tsx. Leave centered dialog origin alone.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: At 10% playback inspect a delayed tooltip from each toolbar position and a select opening near viewport edges: scale radiates from the trigger-facing anchor, including collision flips. Under reduction no scale occurs.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

