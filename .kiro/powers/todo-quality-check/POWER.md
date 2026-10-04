---
name: todo-quality-check
description: Comprehensive quality check Power that runs npm test and npm run lint for the To-Do List application, reporting clear results.
---

# Todo Quality Check Power

## Purpose
The **Todo Quality Check** Power validates the To-Do List application codebase by running all test suites (unit & property-based tests) and ESLint static analysis. It provides a clear summary report of test and lint statuses prior to committing changes.

## Capabilities & Execution
1. **Run Unit & Property Tests**: Executes `npm test` (`jest` runner).
2. **Run ESLint Analysis**: Executes `npm run lint` (`eslint`).
3. **Quality Report**: Synthesizes output into a clear PASS/FAIL report.

## Usage
Run via Node.js script:
```bash
node scripts/quality-check.js
```
Or directly via npm commands:
```bash
npm test && npm run lint
```
