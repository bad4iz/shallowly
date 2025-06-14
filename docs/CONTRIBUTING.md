# Contributing to Shallowly 🏝️

Thank you for your interest in contributing to Shallowly! We're excited to have you on board. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [License](#license)

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your forked repository locally
3. Install dependencies (see Development Setup below)
4. Create a new branch for your changes
5. Make your changes
6. Run tests
7. Submit a pull request

## Development Setup

1. **Prerequisites**
   - Node.js 22+
   - npm 10+
   - Git

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Project Structure

```
shallowly/
├── dist/                  # Compiled output
├── docs/                  # Documentation
├── src/                   # Source code
│   ├── __tests__/        # Test files
│   ├── utils/            # Utility functions
│   └── index.ts          # Main entry point
├── test/                 # Test files
├── .github/              # GitHub configurations
└── ...                   # Configuration files
```

## Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number-description
   ```

2. Make your changes following the project's coding style
3. Add tests for your changes
4. Run tests
5. Commit your changes with a descriptive message

## Testing

We use Vitest for testing. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run coverage
npm run coverage
```

## Pull Request Process

1. Ensure all tests pass
2. Update the documentation if needed
3. Submit a pull request to the `main` branch
4. Reference any related issues
5. Ensure the PR description clearly explains the problem and solution
6. Wait for code review and address any feedback

## Reporting Issues

When reporting issues, please include:

1. A clear title and description
2. Steps to reproduce the issue
3. Expected vs. actual behavior
4. Environment details (OS, Node.js version, etc.)
5. Any relevant error messages or screenshots

## Feature Requests

We welcome feature requests! Please open an issue and:
1. Describe the feature you'd like to see
2. Explain why this would be valuable
3. Include any relevant use cases

## License

By contributing to Shallowly, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to Shallowly! Your help is greatly appreciated. 🚀
