# 008 — Remove decorative chat heading wobble

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: LOW
- **Category**: Purpose & frequency
- **Estimated scope**: ChatHeader plus obsolete custom icon module

## Problem

The noninteractive Chat heading rotates/scales on pointer entry for half a second, suggesting an action where none exists.

Current code at `packages/app/src/features/ui/message-circle.tsx:25`:

```tsx
rotate: [0, -7, 7, 0],
transition: { rotate: { duration: 0.5, ease: "easeInOut" } }
```

## Target

Use lucide-react's static MessageCircle icon in ChatHeader at size20. Remove the obsolete custom ui/message-circle.tsx only after verifying no other source imports its component or handle type. Preserve heading layout and label.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Import `MessageCircle` alongside `Plus` from lucide-react in ai/chat/ChatHeader.tsx; render `<MessageCircle className="size-5" />` instead of the custom icon.
2. Search all source imports for ui/message-circle, MessageCircleIconHandle, startAnimation and stopAnimation; if there are no remaining consumers, delete the obsolete custom icon file.
3. Do not add hover/press feedback to the noninteractive heading.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Move the pointer across Chat heading repeatedly with normal/reduced preferences: icon stays still, same size and position; new-chat action remains available.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

