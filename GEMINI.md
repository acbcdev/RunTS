# GEMINI.md

## Project Overview

This project is a TypeScript/JavaScript playground editor called RunTS. It is built using **Tauri**, **React**, and **TypeScript**. The application provides a lightweight and powerful desktop experience for developers to write, run, and test their TypeScript and JavaScript code. The editor is based on the Monaco Editor, which is the same editor that powers VS Code.

The project is structured as a monorepo with the frontend code in the `packages/app` directory and the Tauri-specific code in the `packages/app/src-tauri` directory. The frontend is a single-page application built with React and Vite. It uses Zustand for state management and Tailwind CSS for styling. The application is also a Progressive Web App (PWA), which means it can be installed on the user's device and used offline.

## Building and Running

The project uses `pnpm` as a package manager. The following scripts are available in the root `package.json`:

*   `pnpm dev`: Starts the development server for the web application.
*   `pnpm build`: Builds the web application for production.
*   `pnpm preview`: Previews the production build of the web application.
*   `pnpm lint`: Lints the code in the `app` package.
*   `pnpm test`: Runs the tests in the `app` package.
*   `pnpm tauri:dev`: Starts the Tauri development server.
*   `pnpm tauri:build`: Builds the Tauri application.

## Development Conventions

*   **Monorepo:** The project is a monorepo with two packages: `app` and `landing`. The `app` package contains the main application, and the `landing` package contains the landing page.
*   **Tech Stack:** The project uses React, TypeScript, Vite, Tailwind CSS, and Zustand.
*   **Styling:** The project uses Tailwind CSS for styling. It also uses `shadcn/ui` components, which are built on top of Tailwind CSS.
*   **State Management:** The project uses Zustand for state management.
*   **Linting and Formatting:** The project uses ESLint and Biome for linting and formatting.
*   **Testing:** The project uses Vitest for testing.
*   **Desktop:** The project uses Tauri for building the desktop application.
