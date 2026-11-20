# 010 — Acknowledge New Chat presses subtly

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file

## Problem

The occasional New Chat action has no press feedback and its icon-only button lacks an accessible label.

Current code at `packages/app/src/features/ai/chat/ChatHeader.tsx:13`:

```tsx
<Button variant="ghost" size="icon" onClick={onNewChat}>
```

## Target

Add `aria-label="New chat"` and `transition-[color,background-color,border-color,box-shadow,scale] duration-160 ease-out active:scale-[0.97] motion-reduce:active:scale-100` to only this Button. Hover stays color-only; keyboard focus styling stays intact. No global Button motion.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Add the accessible label and exact motion classes to ai/chat/ChatHeader.tsx New Chat Button.
2. Keep its existing click handler/variant/size and Plus icon. Do not add transforms to frequent toolbar/keyboard paths.
3. Respect reduced motion by keeping active scale at1, while existing Button color feedback remains.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Pointer-down and release New Chat: subtle .97 scale for160ms, no positional shift. Keyboard activation remains responsive and focus visible. Reduced motion has no scale. No hover transform on touch.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

