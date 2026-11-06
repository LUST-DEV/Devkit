# Security Policy

## Reporting a vulnerability

Please do **not** open a public issue for security problems.

Use GitHub's private vulnerability reporting: open the **Security** tab of this repository, then **Report a vulnerability**.

Include:

- a description of the issue and its impact;
- steps to reproduce;
- affected version or commit.

Never include real tokens, API keys, passwords or personal data in a report. Use dummy values.

## Scope

DEVKIT is a local-first frontend application. Issues of particular interest:

- cross-site scripting (XSS) or unsafe rendering of untrusted content;
- any leak or unintended storage of user inputs, results, JWTs or secrets;
- unsafe handling of imported preference files;
- service worker caching of anything other than approved static assets;
- vulnerable or malicious dependencies.

## Supported versions

No release exists yet. Once v1.0.0 is published, the latest MINOR release is supported.

## Our commitments

- No telemetry in v1.0.
- No secrets in the repository or the frontend.
- Dependencies are audited and pinned through a lockfile.
