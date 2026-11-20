# 001 — Share tooltip timing across controls

- **Status**: DONE
- **Live feel check**: UNVERIFIED — browser host unavailable and native Chrome access was not approved; source, contract and compiled-CSS checks completed.
- **Commit**: 94f1199
- **Severity**: HIGH
- **Category**: Purpose & frequency / timing
- **Estimated scope**: 1 file

## Problem

Each Tooltip shadows the App and toolbar providers, resetting the default 500ms wait between siblings and overriding zero-delay groups.

Current code at `packages/app/src/features/ui/tooltip.tsx:23`:

```tsx
<TooltipProvider>
	<TooltipPrimitive.Root data-slot="tooltip" {...props} />
</TooltipProvider>
```

## Target

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

## Repo conventions to follow

- Use existing React/Radix components and Tailwind v4 utilities, tabs, double quotes, trailing commas.
- `packages/app/src/features/ui/popover.tsx:31` already uses `origin-(--radix-popover-content-transform-origin)`; follow that pattern where relevant.
- Globals belong in `packages/app/src/index.css`; no new dependencies or unrelated refactors.

## Steps

1. Remove only the per-root TooltipProvider wrapper; retain the exported provider and its defaults.
2. Add `data-[state=instant-open]:animate-none` to TooltipContent so shared skip-delay navigation also skips repeated entrances.
3. Keep existing provider groups in App, toolbar, prompt input, and message actions.

## Boundaries

- Only implement this behavior and directly related motion/accessibility changes.
- Preserve component layout, handlers, focus management, public APIs except the explicitly required DialogContent animated prop, and package versions.
- No installs, commits, unrelated formatting or new motion dependencies. Run checks with existing packages.
- Baseline is commit 94f1199; sibling plans intentionally modify overlapping files. If unrelated code drift invalidates a step, report it before improvising.

## Verification

- **Mechanical**: `pnpm --filter app exec tsc -p tsconfig.app.json --noEmit`, `pnpm --filter app exec tsc -p tsconfig.node.json --noEmit`, `pnpm lint`, `pnpm --filter app exec vitest run`, `pnpm build`, and `git diff --check`. App typecheck has 15 identical pre-existing diagnostics; tests have 139 passes and 31 failures matching the baseline; ESLint configuration is missing at baseline. Build, node typecheck, changed-file Biome checks, compiled CSS and hook/dialog contract checks pass. Do not fix unrelated baseline issues.
- **Feel check**: Hover a toolbar button for 500ms, then move directly across siblings: subsequent tooltips must appear instantly without zoom. Verify zero-delay message actions still have zero delay.
- **Done when**: exact targets hold, normal/reduced preferences preserve meaningful feedback, and checks pass or any baseline/environment limits are explicitly documented.

