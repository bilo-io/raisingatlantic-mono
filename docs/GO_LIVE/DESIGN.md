# Raising Atlantic Go-Live: `DESIGN` View

> Role-focused subset of [GO_LIVE.md](../GO_LIVE.md) for the `DESIGN` role. Section numbers and links reference the source document; use them to back-reference full context.

**Role definition:** Brand, app-store screenshots, email templates, press kit, marketing assets.

**Phase involvement:**

- [Phase 8: Email, SMS & Notifications](#phase-8-email-sms--notifications): `DESIGN 25%`
- [Phase 10: Mobile App Release](#phase-10-mobile-app-release): `DESIGN 25%`
- [Phase 13: Launch & Marketing](#phase-13-launch--marketing): `DESIGN 20%`

---

## TL;DR: Phased Action Plan

A focused subset of the launch plan for the `DESIGN` role. Each tier preserves the original 5min-read structure of [GO_LIVE.md](../GO_LIVE.md#tldr-phased-action-plan); items not applicable to `DESIGN` are marked N/A.

### 🔴 Required (non-negotiable) before release

N/A

### 🟠 Follow-up Tier 1 (release week + first month)

Not strictly blocking, but embarrassing or risky if they slip past week 4 of being live.

**Roles:** `DEV 50%` · `OPS 15%` · `MARKETING 10%` · `DESIGN 10%` · `PRODUCT 5%` · `FINANCE 5%` · `SUPPORT 5%` *(branded emails, Slack workspace, helpdesk inbox, mobile-store listings, Xero setup all need stakeholder hands)*

**`MARKETING` + `DESIGN` + `DEV`: branded customer touchpoints**

- [ ] **Branded transactional email templates** (welcome, verification, EPI reminder, billing receipt) ([§8.1](#81-transactional-email))

**`PRODUCT` + `DESIGN` + `DEV`: mobile store launch**

- [ ] **Mobile app submitted** to Apple App Store + Google Play (web typically launches first; mobile follows in week 1–4) ([§10](#phase-10-mobile-app-release))

### 🟡 Follow-up Tier 2 (release month, weeks 2–4)

Conversion-uplift and ops-quality work that pays back fast once real users are flowing.

**Roles:** `DEV 50%` · `MARKETING 20%` · `DESIGN 15%` · `PRODUCT 10%` · `OPS 5%` *(press kit, multi-language QA validation, LinkedIn launch, content calendar all sit with stakeholders)*

**`MARKETING` + `DESIGN`: go-to-market**

- [ ] **Press kit + LinkedIn launch + paediatric-association outreach** ([§13](#phase-13-launch--marketing))

### 🟢 Follow-up Tier 3 (first quarter post-launch)

N/A

### 🔵 Future work (likely outside this document's scope)

N/A

---

## Phases 0 to 14

Each section below corresponds to a numbered phase in the [source document](../GO_LIVE.md). Phases without a `DESIGN` share are marked N/A with a back-link.

### Phase 0: Minimum Viable Product

N/A. See [Phase 0: Minimum Viable Product](../GO_LIVE.md#phase-0-minimum-viable-product) in the source document for context.

### Phase 1: Infrastructure & Hosting Decision

N/A. See [Phase 1: Infrastructure & Hosting Decision](../GO_LIVE.md#phase-1-infrastructure--hosting-decision) in the source document for context.

### Phase 2: Authentication & Identity

N/A. See [Phase 2: Authentication & Identity](../GO_LIVE.md#phase-2-authentication--identity) in the source document for context.

### Phase 3: Payments

N/A. See [Phase 3: Payments](../GO_LIVE.md#phase-3-payments) in the source document for context.

### Phase 4: POPIA Compliance

N/A. See [Phase 4: POPIA Compliance](../GO_LIVE.md#phase-4-popia-compliance) in the source document for context.

### Phase 5: Security

N/A. See [Phase 5: Security](../GO_LIVE.md#phase-5-security) in the source document for context.

### Phase 6: Legal Documents

N/A. See [Phase 6: Legal Documents](../GO_LIVE.md#phase-6-legal-documents) in the source document for context.

### Phase 7: Observability & Monitoring

N/A. See [Phase 7: Observability & Monitoring](../GO_LIVE.md#phase-7-observability--monitoring) in the source document for context.

### Phase 8: Email, SMS & Notifications

**Roles:** `DEV 50%` · `MARKETING 25%` · `DESIGN 25%` *(`DEV` integrates SendGrid/Twilio; `MARKETING` writes template copy; `DESIGN` produces branded HTML templates and the press-pack visuals)*

`nodemailer` is wired into the API but no real provider is configured. Almost every flow (signup, verification, password reset, vaccination reminder, billing) needs reliable transactional comms.

#### 8.1 Transactional Email
The "click here to verify your account" pipe.

- [ ] Choose provider: **SendGrid**, **[Postmark](https://postmarkapp.com)**, or **[AWS SES](https://aws.amazon.com/ses/)** (SendGrid has the best ZA deliverability)
- [ ] Configure custom sending domain `mail.raisingatlantic.com` with SPF + DKIM + DMARC
- [ ] Branded HTML templates (welcome, verification, password reset, EPI-due reminder, billing receipt, lead notification)
- [ ] Bounce + complaint handling (auto-suppress invalid addresses)
- [ ] One-click unsubscribe headers for marketing email

#### 8.2 SMS / WhatsApp
For appointment reminders and high-priority vaccination alerts where email isn't enough.

- [ ] Choose provider: **[Twilio](https://www.twilio.com)** (international + WhatsApp), **[Clickatell](https://www.clickatell.com)** (ZA-focused), or **[Infobip](https://www.infobip.com)**
- [ ] [WhatsApp Business API](https://business.whatsapp.com/products/business-platform) approval (templates need pre-approval)
- [ ] Opt-in capture before sending any SMS/WhatsApp message
- [ ] Stop-word handling (STOP / OPT-OUT / UITSKAKEL)

#### 8.3 Push Notifications (Mobile)
For the Expo app.

- [ ] Configure [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/) (uses [APNs](https://developer.apple.com/documentation/usernotifications) + [FCM](https://firebase.google.com/docs/cloud-messaging) under the hood)
- [ ] Token storage on `User` entity, refresh on app launch
- [ ] Notification preferences UI (which categories the user wants)
- [ ] Quiet hours (no 3am vaccination reminders)

---

> Source: [Phase 8: Email, SMS & Notifications](../GO_LIVE.md#phase-8-email-sms--notifications)

### Phase 9: CI/CD & Release Engineering

N/A. See [Phase 9: CI/CD & Release Engineering](../GO_LIVE.md#phase-9-cicd--release-engineering) in the source document for context.

### Phase 10: Mobile App Release

**Roles:** `DEV 50%` · `DESIGN 25%` · `PRODUCT 25%` *(`DEV` configures EAS and submits builds; `DESIGN` produces store screenshots and icons; `PRODUCT` writes the listing copy and answers Apple/Google data-safety forms)*

The Expo app is scaffolded but has never been submitted to a store. Store review is its own multi-week process, start early.

#### 10.1 Apple App Store
- [ ] [Apple Developer Program](https://developer.apple.com/programs/) enrollment ($99/yr, requires [DUNS number](https://developer.apple.com/support/D-U-N-S/) for legal entity)
- [ ] [App Store Connect](https://appstoreconnect.apple.com) listing: screenshots, description, keywords, [privacy nutrition labels](https://developer.apple.com/app-store/app-privacy-details/)
- [ ] Configure EAS Build for iOS (`eas.json`)
- [ ] First [TestFlight](https://developer.apple.com/testflight/) build for internal testing
- [ ] [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency) prompt if we add any tracking
- [ ] Submit for review (typically 1-3 days)

#### 10.2 Google Play Store
- [ ] [Google Play Console](https://play.google.com/console) enrollment ($25 one-time)
- [ ] [Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469) (declares what data is collected and why)
- [ ] Configure EAS Build for Android
- [ ] Internal testing track → closed beta → production
- [ ] Health-app declaration (Play has additional rules for medical-data apps)

#### 10.3 Mobile-specific Compliance
- [ ] Privacy policy URL accessible from inside the app
- [ ] In-app account deletion (Apple requires this since iOS 16)
- [ ] No advertising IDs collected without consent

---

> Source: [Phase 10: Mobile App Release](../GO_LIVE.md#phase-10-mobile-app-release)

### Phase 11: Workspace & Communications

N/A. See [Phase 11: Workspace & Communications](../GO_LIVE.md#phase-11-workspace--communications) in the source document for context.

### Phase 12: Pre-Launch Testing

N/A. See [Phase 12: Pre-Launch Testing](../GO_LIVE.md#phase-12-pre-launch-testing) in the source document for context.

### Phase 13: Launch & Marketing

**Roles:** `MARKETING 50%` · `DESIGN 20%` · `PRODUCT 20%` · `DEV 10%` *(stakeholder-led, `MARKETING` runs LinkedIn, paediatric-association outreach, press; `DESIGN` produces the press kit; `PRODUCT` finalises pricing copy and demo flow; `DEV` only wires analytics and SEO metadata)*

The "tell people about it" phase. Cheap to defer, expensive to skip entirely.

- [ ] Final landing page copy and SEO (`about`, `pricing`, `contact`, `blog` already scaffolded)
- [ ] [Open Graph](https://ogp.me) + [Twitter card](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) metadata on every public route
- [ ] Sitemap + robots.txt + [Google Search Console](https://search.google.com/search-console) verification
- [ ] Analytics: **[Plausible](https://plausible.io)** or **PostHog** (POPIA-friendlier than [GA4](https://marketingplatform.google.com/about/analytics/)), avoid GA4 unless we have a clean DPA story
- [ ] Launch announcement channels: [LinkedIn](https://www.linkedin.com), paediatric-association mailing lists, parenting groups
- [ ] Press kit (logo, screenshots, founder bio, one-pager) hosted on the marketing site
- [ ] Pricing-page CTA → Stripe Checkout (live)
- [ ] Demo booking flow via Calendly for B2B (practice / tenant) sales

---

> Source: [Phase 13: Launch & Marketing](../GO_LIVE.md#phase-13-launch--marketing)

### Phase 14: Post-Launch Operations

N/A. See [Phase 14: Post-Launch Operations](../GO_LIVE.md#phase-14-post-launch-operations) in the source document for context.
