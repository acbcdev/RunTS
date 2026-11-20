# 009 — Fade theme selection checks without layout changes

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file

## Problem

Theme selection abruptly mounts/removes its check. The existing circle reserves enough room to keep the indicator mounted.

Current code at `packages/app/src/features/settings/components/ThemeCard.tsx:84`:

```tsx
{selected && <Check className="size-3" />}
```

## Target

Keep Check mounted at size3; animate only opacity between0 and1 using `transition-opacity duration-150 ease-out`, via cn and selected ? opacity-100 : opacity-0. Preserve aria-pressed, aria-hidden on its decorative container, theme colors, selection semantics, grid size and all code previews. No scale, spring, stagger or delayed interaction.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Import cn from the repo utility used by nearby components.
2. Replace the conditional Check with a permanently mounted Check and conditional opacity classes, retaining size-3.
3. Keep selection background colors and onSelect behavior immediate. Opacity feedback remains under reduced motion.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Select themes rapidly with pointer and keyboard: check fades in/out in place, selection applies immediately, no layout shift or remount pop. Reduced motion retains only this gentle opacity feedback.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

