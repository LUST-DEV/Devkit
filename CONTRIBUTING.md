# Contributing to DEVKIT

Thank you for helping. DEVKIT values simplicity, security, privacy and maintainability over feature count.

## Workflow

Issue -> Pull Request -> CI -> human review -> merge -> release.

- Open an Issue before large changes.
- Work on a branch; never push directly to `main` (it is protected).
- Code changes need a Pull Request, passing CI and a human review.
- Important architectural changes need an ADR in `docs/adr/` (context, decision, alternatives, consequences, date, status).

## Environment

- Node.js 22 (see `.nvmrc`).
- pnpm, with the version documented in `package.json` once the project is scaffolded.
- The lockfile (`pnpm-lock.yaml`) must be committed.

## Checks before opening a PR (once tooling exists)

- TypeScript type check
- ESLint
- Unit and integration tests (Vitest, Testing Library)
- Production build

Never delete or weaken a test only to make CI pass.

## Rules

- Follow [ARCHITECTURE.md](ARCHITECTURE.md). Do not change the stack without discussion.
- Every new dependency needs a clear reason, an MIT-compatible license, active maintenance and a vulnerability check.
- Tools stay independent: no tool may depend on another tool's internal logic.
- Never store, log or transmit user inputs, results, JWTs, API keys, passwords or secrets.
- No telemetry, no external requests for user data.
- No emoji in the product interface; icons are SVG.
- Keep the interface accessible (WCAG 2.2 AA) and responsive.

## Commits

Use short, clear messages, for example `feat(base64): handle Unicode input` or `docs: update roadmap`.

## Code of conduct

Be respectful and constructive. A full CODE_OF_CONDUCT.md will be added.
