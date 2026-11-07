# DEVKIT

> One workspace. Every developer tool.

DEVKIT is an open source developer toolbox that runs entirely in your browser: fast, private, accessible and usable offline.

**Status:** pre-development. The architecture is validated (see [ARCHITECTURE.md](ARCHITECTURE.md)); no application code exists yet.

## Principles

- Local-first: operations run in the browser whenever possible.
- No account, no mandatory backend, no telemetry in v1.0.
- Your inputs, results, tokens and secrets are never stored or sent anywhere.
- Lightweight, modular, tested, accessible (WCAG 2.2 AA).

## Roadmap

| Version | Content |
| --- | --- |
| v1.0.0 | JSON Formatter, Base64, UUID, JWT Decoder, Timestamp Converter, Hash Generator |
| v1.1.0 | Regex Tester, Text Diff |
| v1.2.0 | Markdown Preview |
| v2.0.0 | API Request Builder (after a dedicated security design) |

## Tech stack

React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React, pnpm, Vitest, Testing Library, Playwright, CodeMirror 6, Cloudflare Pages, GitHub Actions. Node.js 22 (see `.nvmrc`).

## Contributing and security

- Contribution workflow: [CONTRIBUTING.md](CONTRIBUTING.md)
- Vulnerability reporting: [SECURITY.md](SECURITY.md)

## License

[MIT](LICENSE)

---

## Version francaise

DEVKIT est une boite a outils open source pour developpeurs, qui fonctionne entierement dans le navigateur : rapide, privee, accessible et utilisable hors ligne. Le projet est en phase de preparation : l'architecture est validee (voir [ARCHITECTURE.md](ARCHITECTURE.md), redige en francais) et aucun code applicatif n'existe encore.
