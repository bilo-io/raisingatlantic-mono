# Raising Atlantic Go-Live: `MOBILE` View

> Mobile-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `DEV` role, scoped to the Expo / React Native app under [src/apps/mobile/](../../src/apps/mobile/). Section numbers (`Mn.x`) are mobile-native; back-references to [DEV.md](DEV.md) phases are included on each section for cross-context.

**Role definition:** Solo developer (Bilo). All mobile work — data layer, screens, native build, store submission, E2E. Real auth and push wiring are intentionally deferred until the parent/clinician flows are usable end-to-end against mock data.

**Operating assumption:** Auth stays fixture-based ([AuthContext.tsx](../../src/apps/mobile/auth/AuthContext.tsx) + [fixtures.ts](../../src/apps/mobile/auth/fixtures.ts)) until [Phase M4](#phase-m4-polish--platform-ux). Mock data is served via a ported `useApi()` toggle that mirrors [src/apps/web/src/lib/api/](../../src/apps/web/src/lib/api/) — every adapter has both a `mockApi` and `realApi` implementation; flipping `EXPO_PUBLIC_USE_API` swaps between them.

**Phase involvement:**

- [Phase M0: Foundations](#phase-m0-foundations): `DEV 100%` ✅
- [Phase M1: Parent Flow](#phase-m1-parent-flow): `DEV 100%`
- [Phase M2: Clinician Flow](#phase-m2-clinician-flow): `DEV 100%` ✅ *(16/21 — remainder blocked on API gaps G-VER-02 and ClinicianProfile HPCSA fields, see [MOBILE_PHASE_M2_TODO.md](MOBILE_PHASE_M2_TODO.md))*
- [Phase M3: Admin Flow](#phase-m3-admin-flow): `DEV 100%`
- [Phase M4: Polish & Platform UX](#phase-m4-polish--platform-ux): `DEV 100%`
- [Phase M5: Native, Store & Release](#phase-m5-native-store--release): `DEV 90%` · `DESIGN 10%`

---

## TL;DR: Phased Action Plan

A focused mobile-only delivery list, ordered by what unblocks what. Each tier maps onto a [DEV.md](DEV.md) phase for stakeholder cross-reference.

### 🔴 Required before any usable mobile beta

Without these, the app is twelve `ComingSoon` screens. Tiers below assume M0 is shipped.

**Roles:** `DEV 100%`

- [ ] **Data layer ported from web**: `createResourceHooks` + `useApi()` toggle + per-domain adapters live under [src/apps/mobile/lib/api/](../../src/apps/mobile/lib/api/) ([§M0.1](#m01-data-layer-port), [§M0.2](#m02-mock-vs-real-toggle))
- [ ] **Fixture JWT injection** wired into [client.ts](../../src/apps/mobile/lib/api/client.ts) so real-API mode works without a real IDP ([§M0.4](#m04-fixture-auth-hardening))
- [ ] **Parent core flow** functional end-to-end on fixtures: children list/add/edit, growth+milestones+vaccinations tabs, dashboard wired to real summary data ([§M1.1](#m11-children), [§M1.2](#m12-records-growth--milestones--vaccinations), [§M1.5](#m15-dashboard))
- [ ] **Clinician core flow** functional on fixtures: patients list, verifications queue (`PENDING_ASSESSMENT`), records review ([§M2.1](#m21-patients), [§M2.2](#m22-verifications), [§M2.3](#m23-records-review))

### 🟠 Tier 1 (mobile beta → store submission)

Required for App Store / Play Store submission. Maps onto [DEV.md Phase 10](DEV.md#phase-10-mobile-app-release).

**Roles:** `DEV 100%`

- [ ] **Admin flow** shipped on fixtures: users, verifications, system, activity ([§M3](#phase-m3-admin-flow))
- [ ] **Profile screens** per role with editable fields + POPIA data-export trigger ([§M1.6](#m16-profile), [§M2.6](#m26-profile), [§M3.6](#m36-profile))
- [ ] **EAS Build** profiles for `development` / `preview` / `production` ([§M5.1](#m51-eas-build--release-channels))
- [ ] **App icons, splash, store listings** in coordination with [DESIGN.md](DESIGN.md) ([§M5.2](#m52-store-assets))

### 🟡 Tier 2 (post-beta polish)

Quality-of-life and platform integration. Maps onto [DEV.md Phase 8](DEV.md#phase-8-email-sms--notifications) + [Phase 12](DEV.md#phase-12-pre-launch-testing).

**Roles:** `DEV 100%`

- [ ] **Expo push notifications** wired with role-aware topics (vaccine reminders for parents, verification queue for clinicians) ([§M4.1](#m41-push-notifications))
- [ ] **Offline queue + retry/backoff** on mutations (POPIA-safe — no PII logged on retry) ([§M4.2](#m42-offline--retry))
- [ ] **Deep linking** from push notifications and emails into specific screens ([§M4.3](#m43-deep-linking))
- [ ] **Detox / Maestro smoke suite** on signup → add child → log growth, per role ([§M5.4](#m54-mobile-e2e))

### 🟢 Tier 3 (post-launch)

Maturity work. Maps onto [DEV.md Phase 14](DEV.md#phase-14-post-launch-operations).

**Roles:** `DEV 100%`

- [ ] **Real auth wiring** ([Firebase Auth](https://firebase.google.com/docs/auth) or GCP Identity Platform) replacing the fixture context ([§M4.4](#m44-real-auth-cutover))
- [ ] **Real-time messaging** via WebSocket / Pub/Sub (parent ↔ care team) ([§M1.4](#m14-messages))
- [ ] **Crash reporting** ([Sentry React Native](https://docs.sentry.io/platforms/react-native/)) with PII scrubbing ([§M4.5](#m45-error-boundaries--crash-reporting))
- [ ] **Accessibility audit** against [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) for both iOS VoiceOver and Android TalkBack ([§M4.6](#m46-accessibility))

---

## Phases M0 to M5

Each section maps to a numbered phase in this document, plus a back-reference to the nearest [DEV.md](DEV.md) phase for cross-context.

### Phase M0: Foundations

**Roles:** `DEV 100%`

The data layer that everything else sits on. The mobile app already has the foundation pieces in place — axios client ([client.ts](../../src/apps/mobile/lib/api/client.ts)), React Query client ([query-client.ts](../../src/apps/mobile/lib/api/query-client.ts)), AsyncStorage-backed user persistence ([storage.ts](../../src/apps/mobile/auth/storage.ts)), and an auth-header bridge ([auth-header.ts](../../src/apps/mobile/lib/api/auth-header.ts)). What's missing is the adapter + hook + fixture layer.

The web app at [src/apps/web/src/lib/api/](../../src/apps/web/src/lib/api/) has already solved this exact problem. M0 is a port, not a redesign.

#### M0.1 Data layer port
The `createResourceHooks` factory + per-domain adapters are the spine of the data layer. Port them verbatim from web; swap the toast layer for an Expo-friendly equivalent.

- [x] Port [createResourceHooks.ts](../../src/apps/web/src/lib/api/createResourceHooks.ts) to `src/apps/mobile/lib/api/createResourceHooks.ts`
- [x] Replace web's `toast` calls with a thin wrapper around `expo-toast` or an in-app banner ([components/ui/](../../src/apps/mobile/components/))
- [x] Adapters under `src/apps/mobile/lib/api/adapters/` for: `child`, `practice`, `verification`, `appointment`, `record`, `user`
- [x] Hooks under `src/apps/mobile/lib/api/hooks/` mirroring web's per-domain hook files
- [x] Each domain imports its type from [pkgs/types](../../pkgs/types/src/) — do **not** redefine `Child`, `Practice`, `Verification`, etc. inline

#### M0.2 Mock-vs-real toggle
A single env-flag flips the entire app between mock fixtures and the live API.

- [x] Port [data-source.ts](../../src/apps/web/src/lib/api/data-source.ts) to mobile, gated by `EXPO_PUBLIC_USE_API`
- [x] Add `EXPO_PUBLIC_USE_API` to [app.json](../../src/apps/mobile/app.json) under `expo.extra`
- [x] Document the flag in [src/apps/mobile/README.md](../../src/apps/mobile/README.md)
- [x] Default to `false` (mock) for local dev; CI builds set it explicitly

#### M0.3 Fixture seed data
Realistic seed data is the difference between a usable beta and a demo that falls over the moment a tester taps anything.

- [x] `src/apps/mobile/lib/api/fixtures/children.ts` — 2–3 children at different ages with realistic DOB, sex, growth history
- [x] `src/apps/mobile/lib/api/fixtures/epi-schedule.ts` — full SA DoH 2024/2025 EPI schedule (vaccine IDs, age gates) — clinical-grade, not invented. Source from the existing API seed if present.
- [x] `src/apps/mobile/lib/api/fixtures/growth.ts` — weight/height records with valid percentile inputs
- [x] `src/apps/mobile/lib/api/fixtures/milestones.ts` — locomotor / language / social / fine-motor entries
- [x] `src/apps/mobile/lib/api/fixtures/patients.ts` — clinician patient roster with mixed `PENDING_ASSESSMENT` / verified states
- [x] `src/apps/mobile/lib/api/fixtures/verifications.ts` — pending HPCSA/SANC clinician verifications + pending record verifications
- [x] `src/apps/mobile/lib/api/fixtures/practices.ts` — directory entries spanning multiple SA cities
- [x] **No real PII** in fixtures, ever — synthetic names only, no real ID numbers, no real HPCSA numbers (use the format but invent the digits)

#### M0.4 Fixture auth hardening
Real-API mode in dev needs a token the API will accept. Inject a deterministic dev-only JWT signed with the same key the dev API uses.

- [x] [AuthContext.tsx](../../src/apps/mobile/auth/AuthContext.tsx): when `signInAs(role)` runs in mock mode, also publish a fixture JWT to [auth-header.ts](../../src/apps/mobile/lib/api/auth-header.ts) via `setAuthBridge`
- [x] Fixture JWT payload mirrors the API's expected shape (`sub`, `role`, `tenantId`, `practiceIds`) — see API guards under [src/apps/api/src/auth/](../../src/apps/api/src/auth/)
- [x] Guard fixture-JWT injection behind `__DEV__` — never ship a fixture signer in a production bundle
- [ ] The API dev environment must accept the fixture signing key — coordinate with [DEV.md §2](DEV.md#phase-2-authentication--identity)

#### M0.5 Query client + provider
Confirm React Query is mounted at the app root and devtools are reachable in dev.

- [x] [src/apps/mobile/app/_layout.tsx](../../src/apps/mobile/app/_layout.tsx) wraps the app in `<QueryClientProvider>` using the shared [query-client.ts](../../src/apps/mobile/lib/api/query-client.ts)
- [x] Confirm 30s `staleTime` / 5min `gcTime` defaults are sensible for mobile (longer than web — fewer refetches on tab switch)
- [ ] Wire [`@tanstack/react-query-devtools`](https://tanstack.com/query/latest/docs/framework/react/devtools) or [Reactotron](https://github.com/infinitered/reactotron) for local debugging

---

> Source: [Phase 0: Minimum Viable Product](DEV.md#phase-0-minimum-viable-product), [Phase 2: Authentication & Identity](DEV.md#phase-2-authentication--identity)

### Phase M1: Parent Flow

**Roles:** `DEV 100%`

Parent is the primary persona for the SA launch. All six parent screens are currently stubbed (4 × `ComingSoon`, 2 × partial). Build order below is also the user-journey order — children must exist before records can be logged against them.

#### M1.1 Children
The list + add + edit flow for a parent's children. The active-child selector is the cross-cutting state that the rest of the parent flow reads from.

- [ ] [children.tsx](../../src/apps/mobile/app/(app)/(parent)/children.tsx) — replace `ComingSoon` import with real implementation
- [ ] Uses `useChildrenList`, `useChildCreate`, `useChildUpdate`, `useChildArchive` (soft-delete first per CLAUDE.md)
- [ ] Active-child context provider (read by records, dashboard, messages)
- [ ] Form validation matches API DTOs in [src/apps/api/src/children/dto/](../../src/apps/api/src/children/dto/)
- [ ] Parental consent prompt before first child creation (per CLAUDE.md — non-negotiable POPIA flow)

#### M1.2 Records (Growth · Milestones · Vaccinations)
The domain-critical screen. EPI vaccine identifiers and age-gate logic are clinical-grade — do **not** invent them; source from a constants file or API seed.

- [ ] [records.tsx](../../src/apps/mobile/app/(app)/(parent)/records.tsx) — tabbed `<TopTabs>` with three sub-views
- [ ] **Growth tab**: weight/height entry, percentile chart (consider `react-native-svg-charts` or `victory-native`), birth-to-current-age timeline
- [ ] **Milestones tab**: timeline grouped by category (locomotor / language / social / fine-motor); parent-logged entries enter `PENDING_ASSESSMENT` state until clinician verifies
- [ ] **Vaccinations tab**: SA DoH EPI schedule rendered with age gates; "due now", "overdue", "complete" buckets; tap to log
- [ ] EPI constants live in `pkgs/types` (or a new `pkgs/clinical`) — never inline in the screen
- [ ] All new records default to `PENDING_ASSESSMENT` if logged by parent — load-bearing state per CLAUDE.md

#### M1.3 Directory
Find practices and clinicians. Read-only view onto the existing [practices controller](../../src/apps/api/src/practices/practices.controller.ts).

- [ ] [directory.tsx](../../src/apps/mobile/app/(app)/(parent)/directory.tsx) — list view + search filter (city, specialty)
- [ ] Uses `usePracticesList` (public endpoint — `/v1/practices/public` works without auth)
- [ ] Tap → practice detail screen with clinicians, location, contact

#### M1.4 Messages
Conversation list + thread view. **Polling first (15s interval), WebSocket later** — the polling implementation is good enough for beta, and WebSocket wiring is Tier 3.

- [ ] [messages.tsx](../../src/apps/mobile/app/(app)/(parent)/messages.tsx) — list of conversations
- [ ] Thread view at `messages/[conversationId].tsx`
- [ ] React Query `refetchInterval: 15000` for the open thread, `30000` for the list
- [ ] Backend endpoints required — coordinate with [DEV.md §2.2](DEV.md#22-account-security-hardening) if not present yet (likely a Tier 3 blocker)

#### M1.5 Dashboard
Currently shows a generic role greeting via [DashboardHome.tsx](../../src/apps/mobile/components/DashboardHome.tsx). Replace placeholder cards with real summary data.

- [ ] Split [DashboardHome.tsx](../../src/apps/mobile/components/DashboardHome.tsx) into role-specific components: `DashboardHomeParent`, `DashboardHomeClinician`, `DashboardHomeAdmin`
- [ ] Parent dashboard cards: active child summary, next vaccine due (from EPI schedule), latest growth entry, unread messages count, quick actions (log growth, log milestone)
- [ ] Empty states for parents with no children yet (CTA → children screen)
- [ ] [dashboard.tsx](../../src/apps/mobile/app/(app)/(parent)/dashboard.tsx) routes to the parent variant

#### M1.6 Profile
Currently uses shared [ProfileScreen.tsx](../../src/apps/mobile/components/ProfileScreen.tsx) — name, email, role badge, theme switcher, sign-out. Extend with editable fields and POPIA controls.

- [ ] Editable fields: display name, phone, preferred language (`en` / `af` / `zu`)
- [ ] Preferences: notification opt-in/out per category (vaccine reminders, growth check-ins, messages)
- [ ] **POPIA data-export trigger**: button that requests a DSAR export — see [DEV.md §4.2](DEV.md#42-consent--data-subject-rights)
- [ ] **Account deletion request**: opens 30-day soft-delete flow per CLAUDE.md

---

> Source: [Phase 0: Minimum Viable Product](DEV.md#phase-0-minimum-viable-product), [Phase 4: POPIA Compliance](DEV.md#phase-4-popia-compliance)

### Phase M2: Clinician Flow

**Roles:** `DEV 100%`

Clinician is the second pillar of the platform. The verification queue is the highest-priority screen — `PENDING_ASSESSMENT` workflow is load-bearing per CLAUDE.md, and parent-logged records sit in that state until a clinician reviews them.

#### M2.1 Patients
The clinician's assigned patient roster.

- [x] [patients.tsx](../../src/apps/mobile/app/(app)/(clinician)/patients.tsx) — list + search + filter
- [x] Uses `usePatientsList` with `practiceId` filter from active practice context
- [x] Filter chips: all, awaiting verification, recently seen, archived
- [x] Tap → patient detail (reads `useChildGet` since clinicians view children as patients)
- [x] **Tenant-scoped**: never show patients outside the clinician's practice/tenant — verify in adapter, not just UI (defence in depth)

#### M2.2 Verifications
Highest-priority clinician screen. Two queues: pending record verifications (growth/milestone/vaccine entries parents logged) and pending clinician verifications (HPCSA/SANC) for admins reviewing peers.

- [x] [verifications.tsx](../../src/apps/mobile/app/(app)/(clinician)/verifications.tsx) — tabbed: "Records" / "Clinicians"
- [x] Uses `useVerificationsRecords` and `useVerificationsClinicians`
- [ ] Each row: child name (or clinician name), record type, age at log, parent-supplied data *(child name pending — API response needs the `child` relation populated, see PHASE TODO)*
- [x] Actions: approve, request more info, reject (with reason) *(mock-mode optimistic; real-API throws G-VER-02 until backend ships)*
- [ ] Approving a `PENDING_ASSESSMENT` record promotes it to verified state via [verifications controller](../../src/apps/api/src/verifications/verifications.controller.ts) *(blocked on G-VER-02 — backend PATCH endpoints not implemented)*

#### M2.3 Records Review
Read/write view onto a single child's records — same tabbed layout as parent records, but with verification controls visible.

- [x] [records.tsx](../../src/apps/mobile/app/(app)/(clinician)/records.tsx) — reuses the three tabs from [§M1.2](#m12-records-growth--milestones--vaccinations) with `mode="clinician"` prop *(shared `RecordsTabs` component built; M1.2 will plug into the same component with `mode="parent"`)*
- [ ] Clinician can log records directly (these are auto-verified, not `PENDING_ASSESSMENT`) *(record-entry forms deferred to M1.2 which owns the parent-side entry sheets the clinician variant will reuse)*
- [ ] HPCSA number stamped on every clinician-logged record (audit trail) *(blocked on ClinicianProfile.hpcsa_number column not existing in `pkgs/types`/API; mobile-side extension in place as placeholder)*

#### M2.4 Schedule
Clinician appointment calendar.

- [x] [schedule.tsx](../../src/apps/mobile/app/(app)/(clinician)/schedule.tsx) — week + day views
- [x] Uses `useAppointmentsList` filtered by clinician + date range
- [ ] Tap appointment → patient summary + record-of-visit entry *(patient summary shows on card; visit-note bottom sheet deferred — TODO in PHASE doc)*
- [x] Backed by [appointments controller](../../src/apps/api/src/appointments/) — verify endpoints exist

#### M2.5 Dashboard
Clinician-variant of the dashboard.

- [x] Cards: pending verifications count (deep link → §M2.2), today's appointments, patients seen this week, recent activity
- [x] [dashboard.tsx](../../src/apps/mobile/app/(app)/(clinician)/dashboard.tsx) routes to `DashboardHomeClinician`

#### M2.6 Profile
- [x] Extend [ProfileScreen.tsx](../../src/apps/mobile/components/ProfileScreen.tsx) (or split into role variants) to surface: HPCSA / SANC number, verification status, practice affiliation, clinic role *(role-router split + clinician variant; HPCSA/SANC sourced from mobile-side extension until API gains the columns)*
- [x] Read-only fields for the regulated identifiers — changes go through admin verification

---

> Source: [Phase 0: Minimum Viable Product](DEV.md#phase-0-minimum-viable-product), [Phase 4: POPIA Compliance](DEV.md#phase-4-popia-compliance)

### Phase M3: Admin Flow

**Roles:** `DEV 100%`

Lower priority for mobile MVP — admin work is desktop-friendly and the web app already covers it. Ship after parent + clinician flows so the bar is "an admin can triage from their phone", not "an admin can run the platform from their phone".

#### M3.1 Users
- [x] [users.tsx](../../src/apps/mobile/app/(app)/(admin)/users/index.tsx) — list + search + role filter
- [x] Uses `useUsersList` with tenant scope
- [x] Tap → user detail with role assignments (RBAC editing left to web)

#### M3.2 Verifications
- [x] [verifications.tsx](../../src/apps/mobile/app/(app)/(admin)/verifications.tsx) — same component as [§M2.2](#m22-verifications) with admin-wide scope (not practice-scoped)
- [x] Add filter: by tenant, by practice, by HPCSA/SANC verification status

#### M3.3 System
- [x] [system.tsx](../../src/apps/mobile/app/(app)/(admin)/system.tsx) — read-only platform health summary
- [x] Surface: API health (from [SystemHealthCheck.tsx](../../src/apps/web/src/components/SystemHealthCheck.tsx) equivalent), feature flags (read-only), tenant count
- [x] Full config edits stay on web

#### M3.4 Activity
- [x] [activity.tsx](../../src/apps/mobile/app/(app)/(admin)/activity.tsx) — recent platform events
- [x] Read from system-logs module on API — filter to high-signal events only (auth failures, verification state changes), not the full audit firehose
- [x] Mobile is for spot-checks; full audit is web-only

#### M3.5 Dashboard
- [x] Cards: platform health, pending verifications count, user signups this week, recent admin actions
- [x] `DashboardHomeAdmin` variant

#### M3.6 Profile
- [x] Extend profile to surface admin scope (tenant-admin vs super-admin), recent admin actions

---

> Source: [Phase 4: POPIA Compliance](DEV.md#phase-4-popia-compliance)

### Phase M4: Polish & Platform UX

**Roles:** `DEV 100%`

Quality work that turns the app from "fixtures render correctly" into "production-feeling beta". Maps onto [DEV.md Phase 8](DEV.md#phase-8-email-sms--notifications) and [Phase 12](DEV.md#phase-12-pre-launch-testing).

#### M4.1 Push notifications
[Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/) with role-aware topics. Server-side dispatch lives in the API (see [DEV.md §8.3](DEV.md#83-push-notifications-mobile)).

- [ ] Register device token on sign-in; deregister on sign-out
- [ ] Topic subscriptions per role: parents get vaccine reminders + appointment reminders + message alerts; clinicians get verification-queue alerts + appointment reminders
- [ ] **Quiet hours** respected (per parent's preference set in [§M1.6](#m16-profile)) — server enforces, client displays setting
- [ ] **No PII in push payloads** — push body must be generic ("A new record is awaiting your review"), with deep link carrying only opaque IDs

#### M4.2 Offline & retry
Mobile networks drop. The app must survive a 30-second outage without losing user input.

- [ ] React Query mutations queued via `useMutation` with `retry: 3` + exponential backoff
- [ ] Optimistic updates for create/update; rollback on persistent failure
- [ ] Offline detection ([`@react-native-community/netinfo`](https://github.com/react-native-netinfo/react-native-netinfo)) shows a banner when offline
- [ ] **No retry-loop on auth failures** — 401 immediately signs the user out

#### M4.3 Deep linking
Push notifications and email links open the right screen, not the home tab.

- [ ] Expo Router deep-link config in [app.json](../../src/apps/mobile/app.json)
- [ ] Scheme `raisingatlantic://` + universal links for `app.raisingatlantic.com`
- [ ] Test matrix: cold start, warm start, signed-out target (auth gate then redirect)

#### M4.4 Real auth cutover
Replace fixture auth with [Firebase Auth](https://firebase.google.com/docs/auth) (or whichever provider [DEV.md §2.1](DEV.md#21-auth-provider-decision) lands on). Tier 3 — only after the rest of the app is stable on fixtures.

- [ ] Drop-in replacement for `signInAs(role)` — same `AuthContext` shape, real ID token under the hood
- [ ] Email verification + password reset flows ([DEV.md §2.2](DEV.md#22-account-security-hardening))
- [ ] MFA enforced for `CLINICIAN` / `ADMIN` / `SUPER_ADMIN` per CLAUDE.md
- [ ] Secure token storage via [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/), **not** AsyncStorage (AsyncStorage is fine for fixture mode only)
- [ ] Remove fixture-JWT injection from M0.4 in production builds

#### M4.5 Error boundaries & crash reporting
- [ ] Route-level error boundaries (one per top-level tab)
- [ ] [Sentry React Native](https://docs.sentry.io/platforms/react-native/) wired with **PII scrubbing rules** — never let names, emails, HPCSA numbers, or medical conditions reach Sentry. Strip in `beforeSend`.
- [ ] Source maps uploaded on EAS build

#### M4.6 Accessibility
- [ ] [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) audit pass per role
- [ ] iOS VoiceOver + Android TalkBack labelling on every interactive element
- [ ] Colour contrast checked against the theme tokens
- [ ] Tap targets ≥ 44pt on iOS, ≥ 48dp on Android
- [ ] Dynamic Type / font-scaling respected

---

> Source: [Phase 8: Email, SMS & Notifications](DEV.md#phase-8-email-sms--notifications), [Phase 2: Authentication & Identity](DEV.md#phase-2-authentication--identity)

### Phase M5: Native, Store & Release

**Roles:** `DEV 90%` · `DESIGN 10%` *(DESIGN owns icons, splash, store screenshots, copy review)*

The work that gets a binary into the App Store and Play Store. Coordinated with [DEV.md Phase 10](DEV.md#phase-10-mobile-app-release) and [DESIGN.md](DESIGN.md).

#### M5.1 EAS Build & release channels
- [ ] [EAS Build](https://docs.expo.dev/build/introduction/) profiles configured in `eas.json`: `development`, `preview` (internal TestFlight + Play Internal), `production`
- [ ] [EAS Update](https://docs.expo.dev/eas-update/introduction/) channels: `preview` / `production` — JS-only fixes ship via OTA, native changes ship via full build
- [ ] Build secrets via EAS environment variables (Firebase config, Sentry DSN), never committed
- [ ] Build numbers auto-incremented via EAS

#### M5.2 Store assets
Per-platform icon, splash, and feature graphics. DESIGN owns the artwork; DEV owns the wiring.

- [ ] App icon set (iOS 1024², Android adaptive: foreground + background)
- [ ] Splash screen via [`expo-splash-screen`](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- [ ] Store screenshots per device class (iPhone 6.7"/6.5"/5.5", iPad 12.9", Android phone, Android tablet)
- [ ] **Privacy nutrition labels** (iOS) accurately describe data collected — coordinate with [DEV.md §4.1](DEV.md#41-data-protection-impact-assessment-dpia) and POPIA inventory

#### M5.3 Store listings
- [ ] App Store Connect listing: title, subtitle, description, keywords, support URL, privacy URL
- [ ] Play Console listing: short description, full description, contact details, content rating
- [ ] **Privacy policy + ToS URLs** live and stable before submission — see [LEGAL.md](LEGAL.md)
- [ ] **Health-data declaration** — the app handles children's health records; declare accurately on both stores

#### M5.4 Mobile E2E
- [ ] [Detox](https://wix.github.io/Detox/) **or** [Maestro](https://maestro.mobile.dev/) smoke suite — pick one, document the choice
- [ ] Suites per role:
  - Parent: sign-in → add child → log growth → log milestone → check next vaccine due
  - Clinician: sign-in → open verifications → approve a record
  - Admin: sign-in → open users → open verifications
- [ ] CI integration: run on every push to `dev`, block release builds on failure
- [ ] References [DEV.md §12.1](DEV.md#121-automated-coverage)

#### M5.5 Performance budgets
- [ ] Cold start < 3s on a mid-tier Android (Pixel 5-equivalent)
- [ ] Tab transition < 200ms
- [ ] List scrolling at 60fps on 500-item lists (use `FlashList` if `FlatList` underperforms)
- [ ] Bundle size budget: < 50MB Android AAB, < 100MB iOS IPA
- [ ] Measured per-PR for changes touching the hot path (lists, charts, image loading)

#### M5.6 Release checklist
The last-mile checklist before submitting either store.

- [ ] **Real auth cutover complete** ([§M4.4](#m44-real-auth-cutover)) — no fixture signer in the production bundle
- [ ] **Sentry uploads working** for the production build
- [ ] **Privacy policy + ToS** URLs live and reachable
- [ ] **Crash-free sessions > 99%** on the preview channel for 5+ days
- [ ] **E2E smoke green** on three consecutive runs
- [ ] **POPIA section 72** assessment complete for any third-party SDK shipped in the binary (Sentry, push provider, analytics) — see [COMPLIANCE.md](COMPLIANCE.md)
- [ ] **App Store / Play Store review notes** prepared with test credentials

---

> Source: [Phase 10: Mobile App Release](DEV.md#phase-10-mobile-app-release), [Phase 12: Pre-Launch Testing](DEV.md#phase-12-pre-launch-testing)
