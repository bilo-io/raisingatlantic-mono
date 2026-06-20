# Mobile WCAG 2.1 AA Audit

> Baseline audit for the mobile beta. This document is the deliverable for
> [MOBILE.md §M4.6](MOBILE.md#m46-accessibility). It is a checklist, not a
> certification — each row records the screen's current accessibility state
> per assistive technology. Outstanding rows roll into the next QA pass.
>
> Audit owner: DEV. Tooling: iOS Simulator VoiceOver, Android Emulator
> TalkBack, [Accessibility Inspector](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html).

## Standards

| Criterion | Target | Enforced by |
|---|---|---|
| Minimum tap target | 44pt iOS · 48dp Android | [Button.tsx](../../src/apps/mobile/components/ui/Button.tsx) `MIN_TAP_TARGET`, [IconButton.tsx](../../src/apps/mobile/components/ui/IconButton.tsx) hit-slop |
| Dynamic Type / font scaling | Respect OS setting | No `allowFontScaling={false}` anywhere in `components/` (verified by repo-wide grep at audit time) |
| Color contrast | WCAG AA: 4.5:1 body, 3:1 large | Theme tokens — see *Contrast* section |
| Status announcements | Network/error banners use `accessibilityRole="alert"` | [OfflineBanner.tsx](../../src/apps/mobile/components/OfflineBanner.tsx), [ErrorBoundary.tsx](../../src/apps/mobile/components/ErrorBoundary.tsx) |

## Contrast (light theme)

| Pair | Hex | Ratio (calc) | Pass |
|---|---|---|---|
| `foreground` on `background` | `#1A1915` on `#F3F1E9` | ~14.0:1 | ✅ AA |
| `mutedForeground` on `background` | `#73716A` on `#F3F1E9` | ~4.7:1 | ✅ AA body |
| `primaryForeground` on `primary` | `#FFFFFF` on `#D97757` | ~3.4:1 | ⚠️ AA large only — keep CTA labels ≥ 18pt |
| `destructiveForeground` on `destructive` | `#FAFAFA` on `#EF4444` | ~4.0:1 | ⚠️ AA large only — restrict to short alert text |

## Contrast (dark theme)

| Pair | Hex | Ratio (calc) | Pass |
|---|---|---|---|
| `foreground` on `background` | `#F3F1E9` on `#1F1D1B` | ~14.0:1 | ✅ AA |
| `mutedForeground` on `background` | `#9A958A` on `#1F1D1B` | ~6.0:1 | ✅ AA |
| `primaryForeground` on `primary` | `#1F1D1B` on `#E2896D` | ~5.2:1 | ✅ AA |

## Per-screen audit

Legend: ✅ pass · ⚠️ needs follow-up · ⏳ not yet audited

### Parent

| Screen | VoiceOver | TalkBack | Contrast | Dynamic Type | Tap targets |
|---|---|---|---|---|---|
| Children list ([children.tsx](../../src/apps/mobile/app/\(app\)/\(parent\)/children.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Records — Growth ([records.tsx](../../src/apps/mobile/app/\(app\)/\(parent\)/records.tsx)) | ⚠️ chart needs label | ⏳ | ✅ | ⚠️ chart text scales poorly | ✅ |
| Records — Milestones | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Records — Vaccinations | ⚠️ status chips need state labels | ⏳ | ✅ | ✅ | ✅ |
| Directory ([directory.tsx](../../src/apps/mobile/app/\(app\)/\(parent\)/directory.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Messages ([messages.tsx](../../src/apps/mobile/app/\(app\)/\(parent\)/messages.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Dashboard ([dashboard.tsx](../../src/apps/mobile/app/\(app\)/\(parent\)/dashboard.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Profile ([profile.tsx](../../src/apps/mobile/app/\(app\)/\(parent\)/profile.tsx)) | ⚠️ quiet-hours steppers need value announce | ⏳ | ✅ | ✅ | ✅ |

### Clinician

| Screen | VoiceOver | TalkBack | Contrast | Dynamic Type | Tap targets |
|---|---|---|---|---|---|
| Patients ([patients.tsx](../../src/apps/mobile/app/\(app\)/\(clinician\)/patients.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Verifications ([verifications.tsx](../../src/apps/mobile/app/\(app\)/\(clinician\)/verifications.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Records review | ⚠️ inherits Vaccinations issue | ⏳ | ✅ | ✅ | ✅ |
| Schedule ([schedule.tsx](../../src/apps/mobile/app/\(app\)/\(clinician\)/schedule.tsx)) | ⏳ | ⏳ | ✅ | ⚠️ week grid clips at large sizes | ✅ |
| Dashboard ([dashboard.tsx](../../src/apps/mobile/app/\(app\)/\(clinician\)/dashboard.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Profile | ✅ | ⏳ | ✅ | ✅ | ✅ |

### Admin

| Screen | VoiceOver | TalkBack | Contrast | Dynamic Type | Tap targets |
|---|---|---|---|---|---|
| Users ([users/index.tsx](../../src/apps/mobile/app/\(app\)/\(admin\)/users/index.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Verifications ([verifications.tsx](../../src/apps/mobile/app/\(app\)/\(admin\)/verifications.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| System ([system.tsx](../../src/apps/mobile/app/\(app\)/\(admin\)/system.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Activity ([activity.tsx](../../src/apps/mobile/app/\(app\)/\(admin\)/activity.tsx)) | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ⏳ | ✅ | ✅ | ✅ |
| Profile | ✅ | ⏳ | ✅ | ✅ | ✅ |

## Follow-up items

- TalkBack pass across every screen — pending Android device time.
- Growth chart needs an `accessibilityLabel` summary (e.g. "Weight trend, 6 entries, latest 8.2 kg") since charts cannot be voiced as data points.
- Vaccine status chips ("due now", "overdue", "complete") need `accessibilityState` to announce the bucket explicitly.
- Quiet-hours `+` / `−` steppers in the parent profile should announce the new hour after each press (`AccessibilityInfo.announceForAccessibility`).
- Schedule week grid: investigate horizontal scroll vs reflow at Dynamic Type "XXL".
