# Repository Guidelines

## Project Structure & Module Organization
This repository is a static single-page app for WEMBA pathway planning.
- Core app files live at the root: `index.html`, `styles.css`, `app.js`, `router.js`, `data.js`, and `pathway-graph.js`.
- End-to-end tests live in `tests/e2e/*.spec.js`.
- Planning/design docs live in `docs/plans/`.
- Generated artifacts (`playwright-report/`, `test-results/`) are test outputs, not source.

When adding new code, keep feature logic close to existing domains (planner behavior in `app.js`, routing in `router.js`, curriculum/source data in `data.js`).

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run serve`: run local static server at `http://localhost:8000` using Python.
- `npm run serve:npx`: alternative local server using `http-server`.
- `npm test`: run full Playwright suite headlessly.
- `npm run test:ui`: open Playwright UI runner.
- `npm run test:headed`: run tests with visible browsers.
- `npm run test:debug`: run tests in debug mode.

Use targeted runs while iterating, for example:
`npx playwright test tests/e2e/graph-builder.spec.js`.

## Coding Style & Naming Conventions
- Use 2-space indentation, semicolons, and single quotes in JavaScript.
- Prefer `camelCase` for variables/functions and clear verb-based function names (`getCourseOffering`, `isCourseAvailableForCohort`).
- Keep constants/data maps in uppercase when established (for example `COURSES`).
- Preserve stable selectors used by tests (IDs and `data-*` attributes).

## Testing Guidelines
- Framework: `@playwright/test` with specs in `tests/e2e`.
- Name specs by feature (`navigation.spec.js`, `graph-builder.spec.js`).
- Name tests as user-observable behaviors (pattern: `should ...`).
- Run the full test suite before opening a PR; validate both navigation and graph-builder flows when touching shared state.

## Commit & Pull Request Guidelines
Recent history shows imperative commit subjects, often with Conventional Commit prefixes (`feat: ...`). Follow this pattern:
- Prefer `feat:`, `fix:`, `test:`, `docs:` where appropriate.
- Keep commits focused and scoped to one logical change.
- PRs should include: concise summary, linked issue (if any), test evidence (`npm test` or targeted specs), and screenshots for UI changes.

## Security & Configuration Tips
- Do not commit secrets or credentials (project is static and should stay secret-free).
- Be careful when editing curriculum data in `data.js`; verify cohort, term, and block-week metadata to avoid planning regressions.
