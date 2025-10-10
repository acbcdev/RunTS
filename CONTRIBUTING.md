# Contributing to RunTS

First of all, thank you for considering contributing to **RunTS**! Contributions are what make the open-source community such a fantastic place to learn, inspire, and create.

The following is a set of guidelines to help you contribute to this project. These are mostly guidelines, not strict rules, so use your best judgment and feel free to propose changes.

## 🌟 How to Contribute

### Found a Bug?

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/acbcdev/RunTS/issues).
- If you do find an open issue addressing the problem, **add additional context** or a thumbs-up to show that you have encountered the same issue.
- If a bug has not been reported, **open a new issue**. Provide detailed information including steps to reproduce the issue, expected behavior, and screenshots if possible.

### Suggesting Enhancements

- **Check if the enhancement suggestion was already made** by searching the [Issues](https://github.com/acbcdev/RunTS/issues).
- **Open an issue** with the tag "enhancement" and explain why this feature is beneficial, how it should work, and any technical details you have thought through.

### Code Contribution Process

1. Fork the Project [Fork](https://github.com/acbcdev/RunTS/fork)
2. Clone your fork:
   ```bash
   git clone <URL of your fork>
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/acbcdev/RunTS.git
   ```
4. Create your Feature Branch:
   ```bash
   git switch -c feature/AmazingFeature
   ```
5. Make your Changes
6. Push to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
7. Open a Pull Request

## 📂 Project Structure & Module Organization

RunTS is organized as a monorepo using pnpm workspaces. The main application lives in `packages/app`, which is a React + Tauri client.

- `packages/app` hosts the React + Tauri client; feature modules live under `src/features/<domain>`.
- Shared utilities stay in `src/features/common`, reusable UI in `src/features/ui`, and integration logic under domain folders like `ai` and `editor`.
- Tests sit beside code, e.g. `src/features/common/utils/addLogsToLines.test.ts`.
- Desktop packaging lives in `src-tauri`; static assets belong in `public/`, with build artifacts output to `dist/`.
- `packages/landing` is reserved for the marketing shell—keep experimental assets isolated there.

Here is an overview of the project folder structure:

```
packages/
├── app/
│   ├── public/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── providers/
│   ├── src/
│   │   ├── features/
│   │   │   ├── ai/
│   │   │   ├── common/
│   │   │   ├── editor/
│   │   │   ├── settings/
│   │   │   └── ui/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│   ├── src-tauri/
│   │   ├── src/
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
└── landing/
    └── ...
```

## 💻 Environment Setup

Make sure to follow the [Project Setup](README.md#project-setup) section from the README to configure your local development environment.

- Ensure that you have **Node.js** and **Rust** installed as mentioned in the prerequisites.
- **pnpm** is the preferred package manager for this project.

## 🔄 Keeping Your Fork Updated

To avoid merge conflicts, it is essential to keep your fork updated:

1. Fetch the latest updates from upstream:
   ```bash
   git fetch upstream
   ```

## 🛠 Build, Test, and Development Commands

- `pnpm install` synchronizes workspace dependencies.
- `pnpm dev` starts the Vite dev server for the app workspace.
- `pnpm tauri:dev` launches the desktop shell with live reload.
- `pnpm build` runs `tsc` then `vite build` for a production bundle.
- `pnpm preview` serves the built app locally.
- `pnpm lint`, `pnpm lint:biome`, and `pnpm format` enforce ESLint/Biome rules before commits.

## 🎨 Coding Style & Naming Conventions

- TypeScript with React and path aliases (`@/`) is standard; co-locate feature logic inside its folder.
- Biome is the formatting source of truth: tabs for indent, double quotes, trailing commas where applicable.
- Keep components PascalCase (`CommandK`), hooks camelCase (`useTabsStore`), and shared utilities lowerCamel (`addLogsToLines`).
- Tailwind utility classes belong in JSX; reserve `index.css` for globals that cannot be composed.
- Never use `any` as a type; use specific types or `unknown` instead.

## 🧪 Testing Guidelines

- Vitest powers unit tests; name files `*.test.ts` next to the module under test.
- `pnpm test` runs the headless suite; `pnpm test:ui` opens the Vitest UI for debugging.
- Cover new utilities, React hooks, and AI/Tauri integration code paths; mock remote services where possible.
- Aim for meaningful assertions over raw coverage numbers, especially around log parsing and tab state.

## 📝 Commit & Pull Request Guidelines

- Follow Conventional Commits as seen in history (`fix(dependencies)`, `style(formatting)`, `refactor(worker)`).
- Scope each commit to one concern and rerun lint + tests before pushing.
- PRs should link issues, describe user impact, and include screenshots or terminal output for UI or CLI changes.
- Highlight any skipped checks or platform limitations (macOS vs Windows) in the PR body.

## 🖥️ Desktop-Specific Notes

- Update `src-tauri/tauri.conf.json` when adjusting bundle metadata; never hard-code secrets—use `.env` files ignored by git.
- Validate native changes with `pnpm tauri:build` on macOS and Windows runners before release handoff.

## 📋 Code of Conduct

Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) in all your interactions with the project.

## 💌 Questions or Help?

If you need any help or have questions, feel free to open an issue or contact the maintainers.

Thank you once again for your contribution! 🎉
