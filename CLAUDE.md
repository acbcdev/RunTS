# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RunTS is a TypeScript/JavaScript playground editor built with **Tauri**, **React**, and **TypeScript**. It provides a lightweight desktop and web application for developers to write, run, and test TypeScript/JavaScript code with real-time execution in an isolated worker environment. The editor is powered by Monaco Editor (the same editor used in VS Code).

## Monorepo Structure

This is a **pnpm monorepo** with packages managed via `pnpm-workspace.yaml`:
- `packages/app` - Main React + Tauri application
- `packages/landing` - Marketing/landing page (experimental)

All development commands run from the root and target the `app` package by default.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                 # Start Vite dev server (web version)
pnpm tauri:dev           # Start Tauri desktop app with hot reload

# Build
pnpm build               # TypeScript compilation + Vite production build
pnpm tauri:build         # Build Tauri desktop application

# Testing
pnpm test                # Run Vitest test suite
pnpm test:ui             # Open Vitest UI for debugging

# Linting & Formatting
pnpm lint                # Run ESLint
pnpm lint:biome          # Run Biome linter with auto-fix
pnpm format              # Format code with Biome
pnpm check               # Run Biome check (lint + format)

# Preview
pnpm preview             # Preview production build locally

# Working with specific packages
pnpm --filter app <command>
pnpm --filter landing <command>
```

## Architecture & Code Organization

### Feature-Based Structure

Code is organized by feature domains under `packages/app/src/features/`:

- **`ai/`** - AI integration with multiple LLM providers (OpenAI, Anthropic, Google, Mistral)
  - `chat/` - Chat UI components
  - `messages/` - Message rendering and formatting
  - `lib/` - Provider configuration and API integration
  - `store/` - AI configuration state (model selection, API keys)
  - `use-chat/` - Chat hook for streaming responses

- **`editor/`** - Monaco editor integration and code execution
  - `code-editor/` - Main editor component
  - `editor-main/` - Editor layout and panels
  - `console/` - Output console display
  - `run-code/` - Code execution orchestration and worker management
  - `editor-store/` - Editor state management
  - `editor-settings/` - Editor configuration UI

- **`tabs/`** - Multi-tab editor management
  - `tabs-store/` - Zustand store for tab state (uses `persist` middleware)
  - `editor-tabs/` - Tab UI components
  - `history/` - Tab navigation history

- **`settings/`** - Application configuration
  - `config-store/` - Editor settings (word wrap, line numbers, minimap, etc.)
  - `appearance-store/` - Theme and appearance settings
  - `sections/` - Settings panel sections
  - `create-theme/` - Custom theme creation

- **`common/`** - Shared utilities and components
  - `utils/` - Core utilities (code transformation, log injection, formatting)
  - `command/` - Command palette (CommandK)
  - `shortcuts/` - Keyboard shortcuts
  - `hooks/` - Reusable React hooks
  - `themes/` - Theme definitions

- **`ui/`** - Reusable UI components (shadcn/ui based on Radix UI + Tailwind)

### Path Aliases

TypeScript and Vite are configured with path aliases:
- `@/*` → `./src/*`
- `@features/*` → `./src/features/*`

Always use these aliases for imports.

## Key Technical Details

### Code Execution System

The app runs user code in an isolated Web Worker (`packages/app/src/features/editor/run-code/worker.ts`):
1. User TypeScript code is transpiled using **Babel standalone** (`transform.ts`)
2. Console logs are injected into each line using AST transformation (`addLogsToLines.ts`)
3. Code executes in worker with custom console methods that capture output
4. Output is sent back with source map information (line/column numbers)
5. Worker has a 10-second timeout and 4000-log output limit

### State Management

Uses **Zustand** with persistence for state management:
- `useTabsStore` - Tab management (active tab, history, CRUD operations)
- `useConfigStore` - Editor configuration
- `useAIConfigStore` - AI provider and model settings
- `useAppearanceStore` - Theme and UI appearance

All stores use `zustand/middleware/persist` for localStorage persistence.

### AI Integration

Supports multiple AI providers via **Vercel AI SDK**:
- OpenAI (GPT models)
- Anthropic (Claude models)
- Google (Gemini models)
- Mistral

API keys are encrypted and stored locally. Provider instances are created dynamically based on user selection.

### PWA Support

The app is a Progressive Web App using `vite-plugin-pwa` with:
- Service worker generation strategy
- Offline capability
- Install prompt
- Maximum cache file size: 8MB

## Testing

- Uses **Vitest** for unit testing
- Tests are co-located with source files: `*.test.ts` alongside implementation
- Key test coverage: `addLogsToLines.test.ts`, `ajuestLogs.test.ts`, `formatter.test.ts`
- Run tests before commits

## Code Style & Conventions

### Formatting
- **Biome** is the primary formatter and linter (ESLint also configured)
- Tabs for indentation
- Double quotes for strings
- Trailing commas where applicable

### Naming Conventions
- Components: PascalCase (`CommandK`, `CodeEditor`)
- Hooks: camelCase with `use` prefix (`useTabsStore`, `useChat`)
- Utilities: camelCase (`addLogsToLines`, `transform`)
- Feature folders: kebab-case

### Component Organization
- Keep feature logic co-located within its folder
- Use lazy loading for heavy components (e.g., `CodeEditor`)
- Tailwind utility classes in JSX (avoid CSS files except `index.css` for globals)

## Tauri Desktop App

Desktop packaging lives in `packages/app/src-tauri/`:
- Configuration: `tauri.conf.json`
- Rust backend: `src/`
- Icons: `icons/`
- Capabilities: `capabilities/`

Environment variables and secrets should never be hard-coded - use `.env` files (git-ignored).

## Commit Conventions

Follow **Conventional Commits** format as seen in git history:
- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `refactor(scope): description` - Code refactoring
- `style(scope): description` - Formatting changes
- `build(scope): description` - Build system changes
- `docs(scope): description` - Documentation updates

Scope examples: `app`, `ai`, `editor`, `deps`, `dependencies`

## Important Notes

- **Monaco Editor**: Loaded lazily; customized with TypeScript language support and extra libs
- **Worker Isolation**: All user code runs in Web Worker for security and timeout control
- **Source Maps**: Custom source mapping tracks original line numbers through transpilation
- **Tab Persistence**: Tabs are persisted to localStorage; restored on app reload
- **Theme System**: Custom themes can be created and applied to Monaco editor
- **Shared Code URLs**: App supports loading code via URL query parameter (`?code=base64encoded`)
