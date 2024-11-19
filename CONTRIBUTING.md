# Contributing to RunTS

First of all, thank you for considering contributing to **RunTS**! Contributions are what make the open-source community such a fantastic place to learn, inspire, and create.

The following is a set of guidelines to help you contribute to this project. These are mostly guidelines, not strict rules, so use your best judgment and feel free to propose changes.

## 🌟 How to Contribute

## 📂 Project Structure
Here is an overview of the project folder structure:

```
├── .vscode            # VSCode configuration files
├── dist               # Compiled output files
├── node_modules       # Dependencies installed by PNPM
├── public             # Static assets like images and 
├── src                # Source code for the project
│   ├── components     # Reusable React components
│   │   ├── code-editor # Code editor components
│   │   └── ui          # UI-specific components like buttons, modals, etc.
│   ├── fonts          # Custom fonts used in the application
│   ├── hooks          # Custom React hooks
│   │   └── use-toast # Example: hook for toast notifications
│   ├── lib            # Utility functions and helper libraries
│   │   └── utils.ts   # General utility functions
│   ├── store          # Zustand state management setup
│   ├── themes         # Theme-related files for UI customization
│   │   └── index.ts   # code Editor Themes configurations 
│   ├── types          # TypeScript type definitions
│   │   ├── editor.ts  # Type definitions related to the code editor
│   │   └── worker.ts  # Type definitions for web workers
│   └── workers        # Web worker scripts
│       └── runCode.ts # Worker for running code in the background
├── src-tauri          # Tauri-specific files and configuration


### Found a Bug?

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/ACBC-DEV/RunTS/issues).
- If you do find an open issue addressing the problem, **add additional context** or a thumbs-up to show that you have encountered the same issue.
- If a bug has not been reported, **open a new issue**. Provide detailed information including steps to reproduce the issue, expected behavior, and screenshots if possible.

### Suggesting Enhancements

- **Check if the enhancement suggestion was already made** by searching the [Issues](https://github.com/ACBC-DEV/RunTS/issues).
- **Open an issue** with the tag "enhancement" and explain why this feature is beneficial, how it should work, and any technical details you have thought through.

### Code Contribution Process

1. Fork the Project  [Fork](https://github.com/ACBC-DEV/RunTS/fork)
2. Clone your fork: 
   ```bash
   git clone <URL of your fork>
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/ACBC-DEV/RunTS.git
   ```
4. Create your Feature Branch:
   ```bash
   git switch -c feature/AmazingFeature
   ```
5. Make your Changes:
   ```bash
   git commit -m 'Add: some AmazingFeature'
   ```
6. Push to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
7. Open a Pull Request

### Commit Messages
- Use clear and descriptive commit messages.
- Prefix your message with tags such as "Fix:", "Add:", "Update:", etc., to indicate the type of change.

### Code Style
- Make sure your code adheres to the existing style guidelines of the project.
- Run the project's linter and formatter before pushing your code.

## 💻 Environment Setup

Make sure to follow the [Project Setup](README.md#project-setup) section from the README to configure your local development environment.

- Ensure that you have **Node.js** and **Rust** installed as mentioned in the prerequisites.
- **PNPM** is the preferred package manager for this project.

## 🔄 Keeping Your Fork Updated
To avoid merge conflicts, it is essential to keep your fork updated:
1. Fetch the latest updates from upstream:
   ```bash
   git fetch upstream
   ```

## 🛠 Testing
Tests will be added soon. Once available, please run tests to ensure your changes do not break existing functionality.

## 📋 Code of Conduct
Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) in all your interactions with the project.

## 💌 Questions or Help?
If you need any help or have questions, feel free to open an issue or contact the maintainers at [your-email@example.com].

Thank you once again for your contribution! 🎉
