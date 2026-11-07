<div align="center">

# DEVKIT

**One workspace. Every developer tool.**

An open source developer toolbox that runs entirely in your browser:
fast, private, accessible and built to work offline.

[![CI](https://github.com/LUST-DEV/Devkit/actions/workflows/ci.yml/badge.svg)](https://github.com/LUST-DEV/Devkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/LUST-DEV/Devkit?color=2f6bff)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/LUST-DEV/Devkit?color=22d3ee)](https://github.com/LUST-DEV/Devkit/commits/main)
![Node 22](https://img.shields.io/badge/node-22-2f6bff?logo=nodedotjs&logoColor=white)

![React](https://img.shields.io/badge/React-050b1f?logo=react&logoColor=22d3ee)
![TypeScript](https://img.shields.io/badge/TypeScript-050b1f?logo=typescript&logoColor=2f6bff)
![Vite](https://img.shields.io/badge/Vite-050b1f?logo=vite&logoColor=22d3ee)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-050b1f?logo=tailwindcss&logoColor=22d3ee)
![Vitest](https://img.shields.io/badge/Vitest-050b1f?logo=vitest&logoColor=2f6bff)

</div>

---

## Status

DEVKIT is under active development. **5 of the 6 MVP tools are implemented**; the Timestamp Converter, the home dashboard with search, translations and the offline PWA are still to come. There is **no public deployment yet**.

## Why DEVKIT

- **Local-first**: every operation runs in your browser. No backend, no account.
- **Private by default**: your inputs, results, tokens and secrets are never stored or sent anywhere. No telemetry in v1.0.
- **Lightweight and modular**: each tool is independent and registered in a central tool registry.
- **Accessible**: keyboard navigation, visible focus, light and dark themes, WCAG 2.2 AA as the target.
- **Tested**: unit and UI tests run in CI on every pull request, together with type checking, linting, a production build, a dependency audit and a secret scan.

## Tools

| Tool | Status | What it does |
| --- | --- | --- |
| JSON Formatter & Validator | Available | Format with 2 spaces, 4 spaces or tabs, minify, readable errors with line and column |
| Base64 Encoder / Decoder | Available | Unicode-safe, URL-safe option, explicit error messages |
| UUID Generator | Available | Version 4 UUIDs from the browser secure random source, up to 1000 at once |
| JWT Decoder | Available | Header, payload and time claims. **Never verifies the signature** |
| Hash Generator | Available | SHA-256, SHA-384 and SHA-512 through the Web Crypto API |
| Timestamp Converter | Planned | Timestamps and dates, UTC and time zones, regional formats |

## Roadmap

| Version | Content |
| --- | --- |
| v1.0.0 | The six MVP tools, dashboard with search and favorites, EN/FR/ES, offline PWA, Cloudflare Pages deployment |
| v1.1.0 | Regex Tester, Text Diff |
| v1.2.0 | Markdown Preview |
| v2.0.0 | API Request Builder, after a dedicated security design |

## Getting started

Prerequisites: Node.js 22 (see `.nvmrc`) and pnpm 10.

```bash
git clone https://github.com/LUST-DEV/Devkit.git
cd Devkit
pnpm install
pnpm dev
```

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm test` | Run the unit and UI tests |
| `pnpm typecheck` | Type-check the project |
| `pnpm lint` | Run ESLint |
| `pnpm build` | Type-check and build for production |

## Project structure

```text
src/
  app/          application shell, routing, route tests
  components/   layout, error boundary, shared components
  features/     cross-cutting features (theme)
  pages/        dashboard, tools list, help, settings, 404
  tools/        one folder per tool: logic, UI and tests
    registry.ts central tool registry
  styles/       Tailwind and theme variables
```

The full technical reference is in [ARCHITECTURE.md](ARCHITECTURE.md) (written in French).

## Security and privacy

- Strict input validation and size limits on every tool.
- No secret in the frontend or the repository; a secret scan runs in CI.
- Nothing the user types is stored automatically, in particular no JWT, API key or password.
- Please report vulnerabilities privately, see [SECURITY.md](SECURITY.md).

## Contributing

The workflow is Issue, Pull Request, CI, human review, merge. The `main` branch is protected and requires the CI checks to pass. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

---

## Version francaise

**DEVKIT** est une boite a outils open source pour developpeurs qui fonctionne entierement dans le navigateur : rapide, privee, accessible et pensee pour le hors ligne.

- **Etat** : 5 outils sur 6 du MVP sont implementes (JSON, Base64, UUID, JWT, Hash). Le convertisseur de timestamps, l'accueil avec recherche, les traductions et la PWA hors ligne restent a faire. Il n'y a pas encore de version en ligne.
- **Confidentialite** : rien de ce que vous saisissez n'est stocke ni envoye. Pas de compte, pas de telemetrie.
- **Demarrage** : Node.js 22 et pnpm 10, puis `pnpm install` et `pnpm dev`.
- **Documentation technique** : [ARCHITECTURE.md](ARCHITECTURE.md). Contribution : [CONTRIBUTING.md](CONTRIBUTING.md). Securite : [SECURITY.md](SECURITY.md).
