# Changelog

## Version 1.6.2 – Agu 26, 2025

### Highlights

#### Improvements

- **Dependencies Update:** Updated all dependencies to their latest versions for better performance and security.
- **Code Quality:** Enhanced code readability and performance in `injectLogsIntoCode` function.
- **Test Suite Improvements:** Simplified test cases for `ajuestLogs` by using `createMockLog` function for better maintainability.

#### Refactors

- **Test Refactoring:** Improved test cases for `injectLogsIntoCode` to ensure consistent formatting and better readability.
- **Code Optimization:** Simplified and optimized internal code structures for better performance.

#### Fixes

- **Dependency Management:** Fixed dependency versions to ensure compatibility and stability.

#### Documentation

- **Gemini Integration:** Added Gemini.md documentation for AI provider integration.

## Version 1.6.1 – Agu 21, 2025

### Highlights

#### New Features

- **Customizable Editor Actions Position:** Now you can move editor actions (e.g., Play) to top, bottom, left, or right via settings or Command Palette.
- **Enhanced Appearance Configuration:** Command Palette (CMK) refactored for simplicity and now allows modifying appearance settings such as border radius, font size, and font family.

#### Improvements

- **Chat View Robustness:** Chat view now uses PromptKit and a new ChatContainer for improved structure and reliability.
- **ScrollButton Integration:** Added ScrollButton for better navigation in chat.
- **EditorActions Refactor:** EditorActions component is now more composable and supports dynamic layout.

#### Refactors

- **Command Palette (CMK):** Internal logic simplified for maintainability and extensibility.
- **Appearance Settings:** More options exposed and easier to manage via CMK and settings.

#### Fixes

- Various UI and layout fixes for chat and editor actions.

## Version 1.6.0 – Agu 19, 2025

### Highlights

#### New Features

- Global Error Boundary: Added error boundary and tester for improved app stability.
- Command Palette: Introduced CommandK component with dynamic command management, loading state, and submenu generation.
- Keyboard Shortcuts: Added ShortCutsModal and shortcut management hooks for better accessibility and workflow.
- Tab Management: Implemented tab history, undo tab close, tab context menu, and enhanced tab navigation.
- Editor Settings: New configuration commands for theme, word wrap, and settings management.

#### Improvements

- Enhanced chat animation and smoother transitions in CodeEditor.
- Improved theme switching and appearance submenu generators.
- Updated icon sizes and accessibility for tab controls.
- Better command item scoring and Tauri compatibility for shortcuts.
- Enhanced modal management and keyboard shortcuts for settings and command palette.
- Improved Monaco editor word wrap toggle and config actions.

#### Fixes

- Fixed close tab button and command palette layout issues.
- Corrected desktop capabilities permissions and JSON formatting.
- Improved error handling in chat and code editor.
- Fixed default behavior for chat toggle hotkey.

#### Refactors

- Centralized config constants and streamlined editor state management.
- Reorganized apparence store types and actions for clarity.
- Simplified formatter, runCode, and tooltip provider logic.
- Cleaned up imports, removed unused code, and improved maintainability.

## Version 1.5.6 – Agu 13, 2025

### AI Models Organization

- Reorganized model providers with improved categorization
- Better grouping of models by provider (OpenAI, Google, Anthropic, Mistral)
- Enhanced model metadata and capabilities display

### Model Selector Enhancement

- **New Model Selector with Search**: Added powerful search functionality to quickly find models
- Real-time filtering by model name and provider
- Improved UI with better visual hierarchy and model information
- Enhanced accessibility with keyboard navigation support

### Chat Experience Improvements

- **Enhanced Chat View**: Redesigned chat interface with better message layout
- **Empty State**: Added friendly empty state with icon when no messages are present
- **Chat Actions**: New action buttons including:
  - "New Chat" button to start fresh conversations
  - "Regenerate" button to retry the last AI response
- **Improved Prompts**: Better prompt handling and message formatting
- Enhanced message styling and readability

## Version 1.5.5 – May 1, 2025

### add new version models from google and openai providers

### OpenAI

- 03
- o4-mini
- gpt-4o-search-preview
- gpt-4.1-nano
- gpt-4o-mini-search-preview
- gpt-4.1-mini

### Google

- gemini-2.5-pro-preview-05-06
- gemini-2.5-flash-preview-04-17

## Version 1.5.4 March 26, 2025

- add new Provider gemini-2.5-pro-exp-03-25

## Version 1.5.3 – March 14, 2025

### AI Chat

- Added action buttons at the end of responses (e.g., Copy).
- Removed Gemini 1.5 Pro and Gemini 1.5 Flash models.
- Added **Mistral** as a new provider.
  - pixtral-large-latest
  - mistral-large-latest
  - mistral-small-latest

### Bug Fixes

- Fixed a bug causing chat display issues.

---

## Version 1.5.2 – February 27, 2025

### Expression Runner

- Marked as stable.

### Logs & Settings

- Aligned log settings for better consistency.

### AI Models

- Added new models:
  - `claude-3-7-sonnet-20250219`
  - `gpt-4.5-preview`
  - `gpt-4.5-preview-2025-02-27`

---

## Version 1.5.0 – February 18, 2025

### AI Chat

- Added a **Reload** button for handling errors.
- Google provider: Added an option to use the latest available model.
- OpenAI provider: Added an option to use the latest available model.

### Editor

- Improved bracket highlighting for themes.
- Added new themes.

### Run Code

- Fixed a bug affecting code execution with doc comments.
- Fixed an issue with log injection.
