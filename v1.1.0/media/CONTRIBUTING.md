# Contributing to tguard-js

Thank you for contributing to `tguard-js`.  This guide explains how to set up the project, follow conventions, and submit changes.

This project focuses on providing lightweight, predictable, and well-tested runtime type guards for JavaScript and TypeScript environments with support for older runtimes such as Node.js v14+.

Please read the following guidelines before submitting changes.

---

## Table of Contents

- [Requirements](#requirements)
- [Development Setup](#development-setup)
- [Project Goals](#project-goals)
- [Code Style](#code-style)
  - [Formatting](#formatting)
  - [General Style Guidelines](#general-style-guidelines)
  - [Compatibility](#compatibility)
- [Tests](#tests)
  - [Required Rule](#required-rule)
  - [Running Tests](#running-tests)
- [Documentation](#documentation)
  - [Required for New APIs](#required-for-new-apis)
  - [Documentation Expectations](#documentation-expectations)
- [API Design Guidelines](#api-design-guidelines)
- [Pull Requests](#pull-requests)
  - [Before Submitting](#before-submitting)
  - [Commit Messages](#commit-messages)
- [Restrictions](#restrictions)
- [Reporting Issues](#reporting-issues)
- [Final Notes](#final-notes)

---

## Requirements

Before contributing, ensure the following prerequisites are met:

- [Node.js v22](https://nodejs.org/en/download/archive/v22.22.3) or newer
  - If you use `nvm`, run `nvm install` to quickly install the recommended version
- Latest version of [Bun](https://bun.sh/) *(optional; `npm` is also supported)*
- Basic understanding of [TypeScript](https://www.typescriptlang.org/) and type guards
- Familiarity with the project's structure, conventions, and coding style

## Development Setup

Clone the repository:

```bash
git clone https://github.com/mitsuki31/tguard-js.git
cd tguard-js
```

Install dependencies:

```bash
bun install
```

## Project Goals

Contributions should align with the following goals:

- Zero or minimal runtime overhead
- Predictable behavior
- Strong TypeScript inference
- Runtime compatibility with Node.js v14+
- Small and maintainable implementations
- Well-documented public APIs

## Code Style

All contributions must follow the existing project style.

### Formatting

Format all files before submitting:

```bash
bun run format
```

This project uses [Prettier](https://prettier.io/) for formatting consistency.

### General Style Guidelines

- Prefer small and focused functions
- Avoid unnecessary abstractions
- Keep implementations readable whenever possible
- Prefer explicit logic over overly clever code
- **DO NOT** introducing dependencies unless for development purpose only (`devDependencies`)
- Preserve compatibility with supported runtimes

### Compatibility

Changes must remain compatible with:

- Node.js v14+
- CommonJS and ESM builds

Avoid relying on runtime features unavailable in older Node.js versions unless properly polyfilled or guarded.

## Tests

All feature additions, bug fixes, and refactors must include or update tests.

### Required Rule

If you modify behavior, you must synchronize the test suite.

**Examples:**

- New API → add test coverage
- Refactor → update affected tests
- Bug fix → add regression tests
- Behavior change → update expectations

Pull requests without proper tests may be rejected.

### Running Tests

Run the test suite locally before submitting:

```bash
bun run test
```

Coverage:

```bash
bun run coverage
```

## Documentation

All public APIs must include clear documentation.

### Required for New APIs

New exported functions should include:

- Purpose and behavior
- Edge case notes
- Parameter descriptions
- Return value description
- `@typeParam` where relevant
- Examples when useful

### Documentation Expectations

Documentation should:

- Be concise but descriptive
- Match actual runtime behavior
- Mention intentional limitations or strictness

## API Design Guidelines

Before adding a new API, consider:

- Does it overlap existing functionality?
- Can it be composed from existing guards?
- Is the naming consistent with current APIs?
- Does the behavior remain predictable?

Avoid adding APIs that:

- Duplicate existing functionality
- Have ambiguous semantics
- Introduce inconsistent behavior
- Require heavy runtime logic

## Pull Requests

### Before Submitting

Ensure the following:

- Code is formatted
- Tests pass
- New functionality is documented
- Existing tests are updated if behavior changes
- No unrelated changes are included

### Commit Messages

Use clear and descriptive commit messages and **MUST** follow [Conventional Commits Standard](https://www.conventionalcommits.org/en/v1.0.0/).

## Restrictions

The following are generally discouraged unless discussed first:

- Large architectural rewrites
- Breaking API changes
- Adding external runtime dependencies
- Changing project structure significantly
- Introducing environment-specific behavior

## Reporting Issues

When reporting issues, include:

- Used runtime environment and its version
- Reproduction steps
- Expected behavior
- Actual behavior
- Minimal reproducible example if possible

---

## Final Notes

Contributions should prioritize maintainability, consistency, and runtime correctness over feature quantity.

Small, focused improvements are preferred over broad unreviewed changes.
