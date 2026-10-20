# Suomisaundi System — Rotation

Subsystem foundation. The main entry point is https://suomisaundi-system.github.io/.

 bootstraps ;  provides importable functionality. Direct subsidiary visitors are redirected after ten seconds.

Token rotation is a **server-side operational process**. This repository exposes only policy and planning, never secrets or a live credential rotation endpoint.

## Trusted backend rotation helper
`backend/rotation.mjs` implements a process-local, SHA-256-digest-based rotation helper with cryptographically generated replacements, optional short overlap, revocation, and redacted audit events. Run `node --test backend/rotation.test.mjs`.

**Production limitations:** in-memory state is lost on restart. Configure persistent secret management, atomic multi-worker distribution, versioned secret IDs, audit retention and provider-specific revocation before production. This helper cannot rotate a Telegram bot token itself: BotFather/provider controls token issuance and invalidation. Never publish secrets in GitHub Pages.
