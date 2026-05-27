# Test Coverage Baseline

Snapshot recorded as part of the `chore/expand-test-coverage` PR.
Per the PR plan, coverage thresholds are **not yet enforced** — this document captures the starting state so a follow-up PR can set realistic floors.

To regenerate the numbers below, run from a freshly installed worktree (`bun install` at repo root):

```sh
# API
cd src/apps/api && bun run test:cov

# Web
cd src/apps/web && bun run test:cov

# Mobile
cd src/apps/mobile && bun run test:cov
```

Then paste the "All files" row from each summary into the table.

## Baseline (recorded 2026-05-24 from this branch)

| Workspace | Tests | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- | --- |
| `src/apps/api` (Jest, all `src/**`)                  | 143 unit + 3 e2e | 66.55% | 46.25% | 53.70% | 66.38% |
| `src/apps/web` (Vitest, scoped to `src/lib/api/**`)  | 35 | 24.10% | 65.17% | 58.46% | 24.10% |
| `src/apps/mobile` (jest-expo, `auth/**` + `lib/**`)  | 12 | 52.70% | 26.08% | 68.42% | 52.17% |
| Postman (newman)             | 12 folders, ~28 requests | n/a (contract suite — pass/fail) | | | |
| Cypress (E2E)                | 16 specs                 | n/a (behavioural suite — pass/fail) | | | |

> The web statement % is artificially low because the rest of the app (~107 components) is not yet under unit-test cover; `src/apps/web/vitest.config.ts` restricts coverage collection to `src/lib/api/**` so the number reflects coverage **of code that has tests**, not 0% of every untested component.

## What this PR adds

### API ([src/apps/api](../../src/apps/api/))

New unit specs (`.spec.ts`):
- [verifications.service.spec.ts](../../src/apps/api/src/verifications/verifications.service.spec.ts), [verifications.controller.spec.ts](../../src/apps/api/src/verifications/verifications.controller.spec.ts) — `PENDING_ASSESSMENT` aggregation across growth/milestone/vaccination repos.
- [tenants.service.spec.ts](../../src/apps/api/src/tenants/tenants.service.spec.ts), [tenants.controller.spec.ts](../../src/apps/api/src/tenants/tenants.controller.spec.ts) — CRUD, NotFound, error-reporter wiring.
- [leads.service.spec.ts](../../src/apps/api/src/leads/leads.service.spec.ts), [leads.controller.spec.ts](../../src/apps/api/src/leads/leads.controller.spec.ts) — mail + system-log side effects, IP forwarding.
- [system-logs.service.spec.ts](../../src/apps/api/src/system-logs/system-logs.service.spec.ts), [system-logs.controller.spec.ts](../../src/apps/api/src/system-logs/system-logs.controller.spec.ts).
- [jwt-auth.guard.spec.ts](../../src/apps/api/src/common/guards/jwt-auth.guard.spec.ts), [roles.guard.spec.ts](../../src/apps/api/src/common/guards/roles.guard.spec.ts) — current (placeholder) auth behaviour codified.
- [masking.util.spec.ts](../../src/apps/api/src/common/utils/masking.util.spec.ts), [id-validator.spec.ts](../../src/apps/api/src/common/utils/id-validator.spec.ts).
- [telemetry-gcp.spec.ts](../../src/apps/api/src/common/test/telemetry-gcp.spec.ts) — GcpLogger / Tracer / Metric / ErrorReporter.

Deepened existing specs:
- [children.service.spec.ts](../../src/apps/api/src/children/children.service.spec.ts) — adds parent UUID + slug resolution, clinician attach/unattach, query-builder filters, allergy / vaccination / condition writers, unified-records sorting.

E2E scaffold:
- [test/jest-e2e.json](../../src/apps/api/test/jest-e2e.json) (was referenced from `package.json` but did not previously exist).
- [test/app.e2e-spec.ts](../../src/apps/api/test/app.e2e-spec.ts) — light smoke against `AppController` (no DB). DB-backed e2e is **deferred** until a dedicated Postgres test container is wired in via Docker (per [CLAUDE.md](../../CLAUDE.md) §"Testing — real tests, not theatre").

API config changes:
- `jest.moduleNameMapper` extended with `@core/*` and `@pkgs/*` aliases so cross-package telemetry tests resolve.

### Web ([src/apps/web](../../src/apps/web/))

Bootstrapped Vitest + Testing Library (jsdom). New test scripts and devDeps in [package.json](../../src/apps/web/package.json). Config at [vitest.config.ts](../../src/apps/web/vitest.config.ts), shared helpers at [test/setup.ts](../../src/apps/web/test/setup.ts) and [test/renderWithProviders.tsx](../../src/apps/web/test/renderWithProviders.tsx).

New tests:
- [errors.test.ts](../../src/apps/web/src/lib/api/errors.test.ts) — `toApiError`, `ApiError`, axios body normalisation.
- [data-source.test.ts](../../src/apps/web/src/lib/api/data-source.test.ts) — `useApi` toggle, `withDataSource` fail-fast.
- [createResourceHooks.test.tsx](../../src/apps/web/src/lib/api/createResourceHooks.test.tsx) — query keys, list/get/create/update/delete behaviour, optimistic delete rollback.
- [child.adapter.test.ts](../../src/apps/web/src/lib/api/adapters/child.adapter.test.ts) — mock-mode + API-mode behaviour for the child domain adapter.

### Mobile ([src/apps/mobile](../../src/apps/mobile/))

Bootstrapped `jest-expo` + `@testing-library/react-native`. Config at [jest.config.js](../../src/apps/mobile/jest.config.js), AsyncStorage mock at [jest.setup.ts](../../src/apps/mobile/jest.setup.ts).

New tests:
- [auth/storage.test.ts](../../src/apps/mobile/auth/storage.test.ts) — get/set/clear + malformed-JSON handling.
- [auth/AuthContext.test.tsx](../../src/apps/mobile/auth/AuthContext.test.tsx) — hydration, signIn, signOut, `useAuth` guard.
- [lib/api/auth-header.test.ts](../../src/apps/mobile/lib/api/auth-header.test.ts) — header bridge.

### Cypress ([src/test/cypress](../../src/test/cypress/))

New specs that exercise the `cy.loginAs(role)` flow already in the suite:
- [private/parent/add-child.cy.ts](../../src/test/cypress/cypress/e2e/private/parent/add-child.cy.ts)
- [private/parent/log-growth.cy.ts](../../src/test/cypress/cypress/e2e/private/parent/log-growth.cy.ts)
- [private/parent/log-vaccination.cy.ts](../../src/test/cypress/cypress/e2e/private/parent/log-vaccination.cy.ts)
- [private/parent/directory-search.cy.ts](../../src/test/cypress/cypress/e2e/private/parent/directory-search.cy.ts)
- [private/clinician/verifications.cy.ts](../../src/test/cypress/cypress/e2e/private/clinician/verifications.cy.ts)
- [public/auth/signup.cy.ts](../../src/test/cypress/cypress/e2e/public/auth/signup.cy.ts)

### Postman ([tests/postman](../../tests/postman/))

Added folders in [api_collection.json](../../tests/postman/api_collection.json): `Health`, `Leads` (happy + invalid payload), `Appointments` (full CRUD), `System Logs`, and an `Error cases` folder asserting 4xx responses on invalid ids.

## Out of scope / deferred

These items in the original plan were **not** addressed because the corresponding production code does not yet exist (or because they require infrastructure that is not yet provisioned). They should be picked up in follow-up PRs once the production code lands:

- **Real JWT verification**: [jwt-auth.guard.ts](../../src/apps/api/src/common/guards/jwt-auth.guard.ts) is currently a placeholder that returns `true` unconditionally. Tests cover present behaviour; expand to valid / expired / missing-token paths once verification is implemented.
- **EPI schedule generation** and **growth-percentile calculation**: not yet implemented in [children.service.ts](../../src/apps/api/src/children/children.service.ts). Add tests when the logic lands.
- **Soft-delete / `ARCHIVED` workflow** and **30-day POPIA erasure grace period**: `children.service.remove()` currently performs a hard delete via `repo.remove()`. Add archive + grace-period tests once the workflow is implemented.
- **Parental-consent gate** on child creation: no consent model exists yet. Add as a precondition test when the model lands.
- **HPCSA / SANC regex validation**: validation does not yet exist on `User` / `ClinicianProfile`. Add tests when the validators are added.
- **Field-level encryption** of HPCSA/SANC numbers and child medical conditions (KMS, Phase 5.3).
- **Postman auth folder**: the API does not currently expose `/v1/auth/login` or `/v1/auth/me`. Added when those endpoints land.
- **DB-backed API e2e tests** (real Postgres on :5433): scaffold only — full lifecycle e2e (auth → consent → child create → growth log → verification) is held until the Docker-based test DB is wired in.
- **Visual regression / snapshot suite** and **mobile screen-depth tests** (Login / Dashboard rendering).

## Threshold proposal (for the follow-up PR)

Once `bun install` is run in CI and the baseline above is filled in, the next PR should set Jest / Vitest coverage thresholds slightly below the recorded baseline (so the gate prevents regressions but does not require new work on day one). Target ceilings to aim for over the next two sprints:

- API business-logic services (children, verifications, users, tenants, practices): **70%+ lines**.
- API guards / utils / common: **80%+ lines**.
- Web `lib/api/**` (hooks + adapters): **70%+ lines**.
- Mobile `auth/**`: **80%+ lines**.
