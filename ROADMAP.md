# RunTS App Roadmap

This roadmap outlines the planned features and enhancements for the RunTS application, a React + Tauri-based code editor and runner with AI integration.

## Overview

RunTS is a desktop application for running TypeScript code with integrated AI chat and code generation capabilities. The following roadmap is organized by priority to guide development efforts.

## High Priority Features

### Add More AI Provider Models

- **Objective**: Expand beyond current AI providers to include additional models and services
- **Features**:
  - Integrate additional AI providers (e.g., Anthropic Claude, Google Gemini, Mistral, etc.)
  - Support for multiple models per provider
  - Dynamic model selection in chat interface
  - Provider-specific configuration options
- **Estimated Effort**: 2-3 weeks

### Enhanced AI Configuration

- **Objective**: Improve settings for AI provider management
- **Features**:
  - Centralized AI provider settings panel
  - API key management with encryption
  - Model performance metrics and usage tracking
  - Fallback provider configuration
- **Estimated Effort**: 1-2 weeks

## Medium Priority Features

### NPM Packages Support

- **Objective**: Enable installation and management of npm packages within the application
- **Features**:
  - Package search and installation interface
  - Dependency management for code execution
  - Package version control
  - Integration with code editor for package imports
  - Security scanning for packages
- **Estimated Effort**: 3-4 weeks

### Code Snippets System

- **Objective**: Create a comprehensive code snippets management system
- **Features**:
  - Built-in snippet library for common TypeScript patterns
  - Custom snippet creation and editing
  - Snippet categories and tagging
  - Quick insertion via command palette
  - Snippet sharing and import/export
- **Estimated Effort**: 2-3 weeks

### Custom Theme Creation

- **Objective**: Allow users to create and customize their own themes
- **Features**:
  - Theme editor with color picker and preview
  - Import/export custom themes
  - Theme marketplace or sharing system
  - Advanced theming options (syntax highlighting, UI elements)
  - Theme versioning and backup
- **Estimated Effort**: 2-3 weeks

## Low Priority Features

### Advanced Settings Configuration

- **Objective**: Expand application settings for better customization
- **Features**:
  - Enhanced theme management (beyond custom creation)
  - Editor preferences (font, layout, keybindings)
  - Cross-platform shortcuts (Mac, Linux, Windows specific)
  - PWA-specific shortcuts (e.g., Cmd+T for new tab)
  - Performance settings
  - Export/import settings profiles
  - Advanced debugging options
- **Estimated Effort**: 1-2 weeks

## Ongoing Tasks

### Testing and Quality Assurance

- **Objective**: Improve code quality and reliability
- **Features**:
  - Comprehensive test coverage for new features
  - Performance optimization
  - Bug fixes and stability improvements
  - User feedback integration

### Documentation and User Experience

- **Objective**: Enhance user experience and documentation
- **Features**:
  - Internationalization (i18n) support for multiple languages
  - Updated user guides and tutorials
  - In-app help system
  - Keyboard shortcuts documentation
  - Accessibility improvements

## Success Metrics

- Increased user engagement with AI features
- Reduced setup time for development environments
- Positive user feedback on new features
- Improved code execution reliability

## Dependencies

- Completion of current AI integration stability
- Tauri framework updates compatibility
- Third-party API availability and terms

## Risk Assessment

- API rate limiting and cost management for new providers
- Package security and compatibility issues
- Performance impact of additional features
- User adoption and learning curve

---

_This roadmap is subject to change based on user feedback, technical constraints, and business priorities. Last updated: October 2024_
