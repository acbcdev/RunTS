# GEMINI.md

## Project Overview

This project is a TypeScript/JavaScript playground editor called RunTS. It is built using **Tauri**, **React**, and **TypeScript**. The application provides a lightweight and powerful desktop experience for developers to write, run, and test their TypeScript and JavaScript code. The editor is based on the Monaco Editor, which is the same editor that powers VS Code.

The project is structured as a monorepo with the frontend code in the `src` directory and the Tauri-specific code in the `src-tauri` directory. The frontend is a single-page application built with React and Vite. It uses Zustand for state management and Tailwind CSS for styling. The application is also a Progressive Web App (PWA), which means it can be installed on the user's device and used offline.

## Development Conventions

The following are the development conventions for this project, taken from `.github/copilot-instructions.md`:

### Rules

*   Do not run `bun dev` or `bun build`. I will run these commands myself.
*   Ask before any breaking change.
*   Before starting a feature, list affected folders/files and what will change.
*   Prefer TypeScript everywhere; ask if types are unclear.
*   Use shadcn/ui props (e.g., size, variant) instead of raw className where applicable.
*   Optimize for performance (selectors, memoization, lazy imports, Web Worker offloading).
*   If a new shadcn/ui component is needed, request it via CLI:
    ```bash
    bunx --bun shadcn@latest add <ComponentName>
    ```
*   Don’t use barrel files (no index.ts re-exports).
*   Don’t add m-<number> classes on <DropdownMenuItem />.
*   Apply S.O.L.I.D. principles.
*   Make components reusable and composable.
*   Split long components; if too many props, introduce React Context.
*   No inline styles; use Tailwind utilities.
*   Use custom Tailwind color tokens (CSS vars) for text/bg/border.
*   File-scoped routing: each route has its own folder with page.tsx.
*   Avoid setting text-foreground; it’s the default color.
*   Use arrow functions for components.
*   Names (variables, functions, identifiers) in English.

### Coding Style

*   Use lucide-react for icons.
*   Prefer functional components.
*   Prioritize readability and maintainability.
*   Use descriptive, consistent names.
*   Files: PascalCase. Folders: camelCase. Components: UpperCamelCase. Utilities/helpers: camelCase.

### UI

*   Always use shadcn/ui and its props.

### Theme

*   Colors are defined as CSS variables and should be used in classNames, e.g., `bg-sidebar text-sidebar-foreground`.

### Tasks

*   When adding a route, scaffold: folder + page.tsx + components/.
*   Create strongly-typed hooks and Zustand slices with selectors.

### Workflow

1.  **PLAN**: List affected folders/files and justify changes. Outline data flow, state updates, and involved UI components. Flag potential breaking changes and request approval.
2.  **IMPLEMENT**: Proceed only after agreement. Use TypeScript for all code; share types from `types/`. Keep platform entrypoints minimal (e.g., Tauri commands or extension stubs); move business logic to `lib/`.
3.  **VERIFY**: Provide brief test notes: happy path + key edge cases. Run a performance checklist (selectors, memo/useCallback, lazy loading, deps). Check basic a11y (ARIA, roles, keyboard navigation).
