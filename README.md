![Captura de pantalla en ordenador](/packages/app/public/og.jpg)

<div align='center'>

### <img src="public/logo.svg" width='35' /> [Runts](https://runts.acbc.dev)
  ***Your TypeScript/JavaScript Playground Editor***

</div>
<div align="center">

![](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)
![](https://img.shields.io/badge/Maintained%3F-Yes-brightgreen.svg)

</div>

Welcome to **RunTS**! A lightweight yet powerful TypeScript/JavaScript playground built with **Tauri**, **React**, and **TypeScript**. Write and run code instantly in an isolated worker environment with real-time output.

## 🚀 Features

- **Monaco Editor** — the same editor powering VS Code, with full TypeScript support
- **Live Tab Names** — tab names derive from the first line of your code and update as you type
- **Multi-tab Editor** — manage multiple files with persistent tab state
- **Real-time Execution** — runs code in an isolated Web Worker with console output capture and source-mapped line numbers
- **AI Assistant** — chat with OpenAI, Anthropic, Google, or Mistral models directly inside the editor
- **Command Palette** — `Cmd+K` for quick access to all editor actions
- **Themes & Appearance** — custom themes, font settings, and layout options
- **PWA Support** — installable and works offline
- **Shared Code URLs** — share code snippets via URL

## 🛠 Tech Stack

- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Frontend**: [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Desktop**: [Tauri](https://tauri.app/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Code Transpilation**: [Babel Standalone](https://babeljs.io/)

## 📁 Project Setup

### Prerequisites

- **Node.js** v20 or above
- **pnpm** v10 or above
- **Rust** (only required for the Tauri desktop build)

### Installation

```bash
git clone https://github.com/acbcdev/RunTS.git
cd RunTS
pnpm install
```

### Running the Project

```bash
pnpm dev          # Web version (Vite dev server)
pnpm tauri:dev    # Desktop app with hot reload
```

### Build

```bash
pnpm build        # Production web build
pnpm tauri:build  # Tauri desktop application
```

## 🧪 Testing

Tests run with [Vitest](https://vitest.dev/):

```bash
pnpm test       # Run test suite
pnpm test:ui    # Open Vitest UI
```

## ⚙️ Configuration

Editor preferences, theme, AI provider keys, and layout options are all configurable through the settings panel or Command Palette. Desktop-specific settings live in `packages/app/src-tauri/tauri.conf.json`.

## 🤝 Contributing

Contributions are greatly appreciated! Please check the [contribution guide](https://github.com/acbcdev/RunTS/blob/master/CONTRIBUTING.md) before opening a pull request.

### Contributors

<a href="https://github.com/acbcdev/runts/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=acbcdev/runts" />
</a>
