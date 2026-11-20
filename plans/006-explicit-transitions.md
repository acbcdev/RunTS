# 006 — Limit transitions to changing properties

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 4 files

## Problem

Resize handle, settings tabs, close-tab controls and scroll-to-bottom animate every animatable property, including unrelated layout changes.

Current code at `packages/app/src/index.css:151`:

```tsx
transition: all 0.15s ease;
```

## Target

Resize handle: `transition: background-color 150ms ease`. Settings TabsTrigger and tab-close control: `transition-colors` with existing durations (150ms / 200ms). ScrollButton: `transition-[translate,scale,opacity,color,background-color,border-color,box-shadow]` at 150ms, matching Tailwind4 individual transform properties and Button colors.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Narrow index.css resize-handle transition to background-color only.
2. Replace active transition-all in ui/tabs.tsx with transition-colors, preserving duration-150. Remove/update the duplicate commented transition-all exemplar only if needed to avoid stale motion guidance.
3. Replace transition-all in tabs/editor-tabs/EditorTabsItem.tsx close control with transition-colors, retaining duration-200.
4. Replace ScrollButton transition-all with the exact explicit property utility above. Preserve focus, hidden-state opacity and pointer-events; reduced-motion additions belong to plan003.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Resize editor/output and change orientation with no delayed geometry. Tabs and close controls retain color feedback. Scroll button still fades/scales/translates smoothly in normal mode; no arbitrary size/layout property is in computed transition-property.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

