# Mobile Performance Budgets

> Budget register for the mobile beta. This document is the deliverable for
> [MOBILE.md §M5.5](MOBILE.md#m55-performance-budgets). It is a **budget + measurement
> plan**, not a measurement record — the numbers below are targets and the *Status*
> column tracks whether each has been measured on-device yet. Cross-reference
> [DEV.md §12.1](DEV.md#121-automated-coverage).
>
> Owner: DEV. These require a **real device / native build** to measure; none can be
> verified in CI on a JS bundle alone. Fill the *Measured* column during on-device QA.

## Budgets

| Budget | Target | Measurement method | Tool | Measured |
|---|---|---|---|---|
| Cold start | < 3s on mid-tier Android (Pixel 5-equiv) | Time from launch intent to first interactive frame | `adb shell am start -W`, Expo perf logs | ☐ not yet |
| Tab transition | < 200ms | Interaction-to-next-paint on bottom-tab switch | React DevTools Profiler, on-device trace | ☐ not yet |
| List scroll | 60fps on a 500-item list | Sustained fps while flinging a long list | On-device perf monitor / Flipper | ☐ not yet |
| Android bundle | < 50MB AAB | Size of the production `.aab` artifact | EAS build artifact inspection | ☐ not yet |
| iOS bundle | < 100MB IPA | Size of the production `.ipa` artifact | EAS build artifact inspection | ☐ not yet |

**Process rule:** measured per-PR for changes touching the hot path — lists, charts
([GrowthChart](../../src/apps/mobile/components/records/GrowthChart.tsx)), and image loading.

## List virtualization — deferred FlashList plan

Today all list screens render `items.map()` inside a scrolling container
(`<Screen scroll>` or a raw `<ScrollView>`), i.e. **non-virtualized**:

| Screen | Current | Cardinality (fixtures) |
|---|---|---|
| [patients.tsx](../../src/apps/mobile/app/(app)/(clinician)/patients.tsx) | `<Screen scroll>` + `rows.map(ListItem)` | small |
| [children.tsx](../../src/apps/mobile/app/(app)/(parent)/children.tsx) | `<ScrollView>` + `list.map(ListItem)` | 2–3 |
| [users/index.tsx](../../src/apps/mobile/app/(app)/(admin)/users/index.tsx) | `<Screen scroll>` + `filtered.map(ListItem)` | small |
| [verifications.tsx](../../src/apps/mobile/app/(app)/(clinician)/verifications.tsx) | two `<ScrollView>` + `.map(Card)` | small |

**Decision: defer the FlashList migration** (owner-confirmed during M5 planning). Rationale:

1. Fixture lists are tiny, so there is **no user-facing perf defect** to fix pre-beta.
2. The 60fps / 500-item budget **cannot be verified in this environment** (needs a device).
3. Migrating means making `@shopify/flash-list` the **scroll owner** — a `FlashList`
   (VirtualizedList) nested inside a `ScrollView` breaks virtualization and warns. That
   forces a change to the shared [Screen.tsx](../../src/apps/mobile/components/ui/Screen.tsx)
   `scroll` contract, which regresses broadly and must be validated on-device.

**Execution plan when profiling shows a miss:** add `@shopify/flash-list` (v2 requires the
New Architecture — satisfied, `newArchEnabled: true`), migrate the two highest-cardinality
real lists first (`patients`, `users`) with the header content moved into
`ListHeaderComponent`, keep the small lists (`children`, `verifications`) on `.map()`, and
re-measure the 500-item scroll budget before rolling further.

## Advisory JS-bundle size (optional CI proxy)

A committable proxy for the native-bundle budgets: run `moon run mobile:build`
(`npx expo export` → `dist/`) and warn if the exported JS grows beyond a threshold — an
advisory signal only (mirrors the `security-audit` warn-but-green pattern in `ci.yml`). The
real AAB/IPA gate needs a native build and is tracked as outstanding.
