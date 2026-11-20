# 004 — Remove chat layout animation and distortion

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: HIGH
- **Category**: Performance / physicality / frequency
- **Estimated scope**: 1 file

## Problem

Chat compresses text to half width, shifts by a fixed 300px, and changes width every animation frame beside Monaco automaticLayout. Shortcut and mouse paths share it.

Current code at `packages/app/src/features/editor/code-editor/CodeEditor.tsx:82`:

```tsx
initial={{ opacity: 0, x: -300, width: 0, scaleX: 0.5 }}
animate={{ opacity: 1, scaleX: 1, x: 0, width: "auto" }}
exit={{ x: -300, width: 0, opacity: 0, scaleX: 0.5 }}
transition={{ duration: 0.2, ease: "easeInOut" }}
```

## Target

Render `{showChat && <Chat />}` directly in the existing ResizablePanelGroup, removing AnimatePresence and its motion.div entirely. Panel size changes once immediately and existing responsive Chat widths remain intact. Both mouse and keyboard toggles are instant.

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Remove AnimatePresence/motion imports from CodeEditor.tsx.
2. Replace only the chat motion wrapper with conditional Chat rendering, preserving Chat and ResizablePanel siblings and all editor/session effects.
3. Do not introduce an overlay/drawer, input-source state, a new motion library, or new layout behavior.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Toggle Chat using toolbar and Cmd/Ctrl+B, including rapid reversals and while Monaco is busy. There is no squashing, slide, exit delay or intermediate animated width. Check wide and narrow viewport and both editor/output orientations.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

