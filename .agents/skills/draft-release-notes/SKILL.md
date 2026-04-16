---
title: Draft Release Notes
description: Translates git diff output into professional, user-facing release notes categorised as New Features, Fixes, and Clinical Updates.
trigger: /draft-release-notes
---

# Skill: `/draft-release-notes`

> **Trigger via:** `/draft-release-notes` (no specific agent required — defaults to `@copywriter` for tone refinement)

Summarises code changes into polished, user-facing release notes. Strips technical jargon and formats output for two audiences: end users and the clinical team.

## Steps

### 1. Get the Diff
```bash
git log --oneline <previous-tag>..HEAD
git diff <previous-tag>..HEAD --stat
```

### 2. Categorise Changes
Parse commit messages and changed file paths into three buckets:

| Category | Files / Signals |
|---|---|
| **New Features** | New page routes, new API endpoints, new UI components |
| **Fixes** | Bug fix commits, error handling changes, corrected calculations |
| **Clinical Updates** | Changes to `/vaccines`, `/milestones`, `/growth`, EPI-SA schedule data |

### 3. Draft User-Facing Notes
For each change:
- Strip technical terms (no `TypeORM`, `NestJS`, `Zod`, `Docker`, `JWT`).
- Write in plain language from the user's perspective ("You can now…", "Fixed an issue where…").
- For **Clinical Updates**, note the specific clinical standard affected (e.g., "Updated Rotavirus vaccine scheduling to align with EPI-SA 2025 guidelines").

### 4. Output Format
```md
## Release Notes — v<version> (<date>)

### ✨ New Features
- [User-facing description of change]

### 🐛 Fixes
- [User-facing description of fix]

### 🩺 Clinical Updates
- [Plain-language description of clinical logic change + EPI-SA/WHO standard reference]

---
*For full technical details, see the [CHANGELOG.md](./CHANGELOG.md).*
```

### 5. Tone Review
Pass drafted notes to `@copywriter` for dual-audience tone review:
- Parent/caregiver-facing features → warm, reassuring language.
- Clinician-facing features → professional, efficiency-focused language.

### 6. Save
Write the final notes to `docs/releases/v<version>.md` and prepend to `CHANGELOG.md`.
