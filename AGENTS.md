# Repository Guidelines

## Project Structure & Module Organization
- `packages/app` hosts the React + Tauri client; feature modules live under `src/features/<domain>`.
- Shared utilities stay in `src/features/common`, reusable UI in `src/features/ui`, and integration logic under domain folders like `ai` and `tabs`.
- Tests sit beside code, e.g. `src/features/common/utils/addLogsToLines.test.ts`.
- Desktop packaging lives in `src-tauri`; static assets belong in `public/`, with build artifacts output to `dist/`.
- `packages/landing` is reserved for the marketing shell—keep experimental assets isolated there.

## Build, Test, and Development Commands
- `pnpm install` synchronizes workspace dependencies.
- `pnpm dev` starts the Vite dev server for the app workspace.
- `pnpm tauri:dev` launches the desktop shell with live reload.
- `pnpm build` runs `tsc` then `vite build` for a production bundle.
- `pnpm preview` serves the built app locally.
- `pnpm lint`, `pnpm lint:biome`, and `pnpm format` enforce ESLint/Biome rules before commits.

## Coding Style & Naming Conventions
- TypeScript with React and path aliases (`@/`) is standard; co-locate feature logic inside its folder.
- Biome is the formatting source of truth: tabs for indent, double quotes, trailing commas where applicable.
- Keep components PascalCase (`CommandK`), hooks camelCase (`useTabsStore`), and shared utilities lowerCamel (`addLogsToLines`).
- Tailwind utility classes belong in JSX; reserve `index.css` for globals that cannot be composed.

## Testing Guidelines
- Vitest powers unit tests; name files `*.test.ts` next to the module under test.
- `pnpm test` runs the headless suite; `pnpm test:ui` opens the Vitest UI for debugging.
- Cover new utilities, React hooks, and AI/Tauri integration code paths; mock remote services where possible.
- Aim for meaningful assertions over raw coverage numbers, especially around log parsing and tab state.

## Commit & Pull Request Guidelines
- Follow Conventional Commits as seen in history (`fix(dependencies)`, `style(formatting)`, `refactor(worker)`).
- Scope each commit to one concern and rerun lint + tests before pushing.
- PRs should link issues, describe user impact, and include screenshots or terminal output for UI or CLI changes.
- Highlight any skipped checks or platform limitations (macOS vs Windows) in the PR body.

## Desktop-Specific Notes
- Update `src-tauri/tauri.conf.json` when adjusting bundle metadata; never hard-code secrets—use `.env` files ignored by git.
- Validate native changes with `pnpm tauri:build` on macOS and Windows runners before release handoff.
