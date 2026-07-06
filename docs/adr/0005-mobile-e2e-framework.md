# ADR 0005 — Mobile E2E Framework: Maestro

**Status:** ACCEPTED
**Date:** 2026-07-06
**Phase:** [Go-Live Phase M5 — Native, Store & Release](../GO_LIVE/MOBILE.md#phase-m5-native-store--release) (§M5.4), cross-referencing [DEV.md §12.1](../GO_LIVE/DEV.md#121-automated-coverage)

## Context

The mobile app (`src/apps/mobile/`, Expo SDK 54 / RN 0.81, New Architecture) has unit
coverage via `jest-expo` but **no end-to-end harness**. [MOBILE.md §M5.4](../GO_LIVE/MOBILE.md#m54-mobile-e2e)
and [DEV.md §12.1](../GO_LIVE/DEV.md#121-automated-coverage) both left the choice open as
"Detox **or** Maestro — pick one, document the choice." We need per-role smoke flows
(parent / clinician / admin) that can run in CI and gate release builds.

The web app already runs Cypress smoke suites (`src/test/cypress/`) with a per-role
`loginAs` command and post-deploy jobs in `cd-app.yml`; the mobile decision should reuse
those conventions (mock-mode, synthetic identities, per-role flows) without importing the
web tooling.

## Decision

**Use [Maestro](https://maestro.mobile.dev/) for mobile E2E.** Flows live in
`src/apps/mobile/.maestro/` as declarative YAML, are selected in CI by a `smoke` tag, and
run against a debug/dev build in mock mode (`EXPO_PUBLIC_USE_API=false`).

### Why Maestro over Detox

| Dimension | Maestro | Detox |
|---|---|---|
| Build requirement | Drives a normal debug / dev-client / preview build as a black box over the accessibility tree. No test-only binary. | Requires a Detox-instrumented native build (`@config-plugins/detox` + `expo prebuild`), turning the managed CNG app into one that must prebuild and compile a special binary. |
| CI cost | Install existing APK, run YAML. Lower runner minutes. | Compile an instrumented binary per run. |
| Dependency footprint | Standalone CLI (curl installer) — **no npm dependency added** to `mobile/package.json`, so ADR 0003's `npm audit` matrix surface is unchanged. | Adds `detox` + config-plugin devDeps to the audited surface. |
| Authoring | Declarative YAML, lint-able and diffable without a device. | JS/TS with Jest runner; more expressive but heavier. |
| Expo fit | Expo's documented E2E path (works with EAS builds / EAS Workflows). | Supported via community config plugin; more setup. |

Detox's richer programmatic assertions do not outweigh the native-build and dependency
burden for a smoke suite whose job is three linear per-role journeys.

## Consequences

- Flows are **committable and static-checkable now** (valid YAML, `env.ROLE`-parametrized,
  `smoke`-tagged) but **cannot execute without a device/emulator** — GitHub-hosted runners
  have none by default. The CI `mobile-e2e` job therefore mirrors the `eas-preview` gating
  pattern: green-by-default, skips cleanly until `vars.RUN_MOBILE_E2E == 'true'` provisions a
  device runner. See [MOBILE_PHASE_M5_TODO.md](../GO_LIVE/MOBILE_PHASE_M5_TODO.md).
- "Block release builds on E2E failure" (§M5.4) is enforced on the **production build path**
  (a green smoke run gates `eas build --profile production`), not on the advisory `dev` CI job.
- **POPIA:** flows run in mock mode with **synthetic identities only** (the same personas as
  `cypress/fixtures/users.json` — Jane Doe / Dr. John Smith / Admin User — plus a synthetic
  "Test Baby"). No real emails, SA ID numbers, or HPCSA/SANC numbers appear in any flow YAML;
  Maestro screenshots/recordings taken in mock mode contain no real data.
- Selector strategy: flows match on existing visible text / `accessibilityLabel`; a small set
  of `testID`s was added only where text was ambiguous (e.g. the "Add child" FAB vs the
  "Add child" form submit) or absent (form text inputs).

## Sign-off

| Role | Status |
|---|---|
| `DEV` (Bilo) | ☑ accepted (DEV-owned tooling decision) |

This ADR closes the open "Detox or Maestro" choice in
[MOBILE.md §M5.4](../GO_LIVE/MOBILE.md#m54-mobile-e2e) and [DEV.md §12.1](../GO_LIVE/DEV.md#121-automated-coverage).
