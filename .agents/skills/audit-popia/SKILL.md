---
title: Audit POPIA
description: Scans a specified file or directory for POPIA compliance violations — PII exposure, unencrypted health data, and missing RBAC guards.
trigger: /audit-popia <file-path>
---

# Skill: `/audit-popia <file-path>`

> **Trigger via:** `@security /audit-popia <file-path>`

Performs a targeted POPIA (Protection of Personal Information Act) compliance scan on a given file or directory. Produces a structured findings report.

## Checks Performed

### 1. Hardcoded PII
Scan for hardcoded personal information:
- SA ID numbers (13-digit numeric strings)
- Email addresses in string literals
- Phone numbers in string literals
- Patient names, DOB, or medical record numbers not behind a variable

### 2. Health Data Transmission
- Verify all routes that transmit health metrics use HTTPS (never plain HTTP).
- Check that health data fields (e.g., `vaccineHistory`, `growthPercentile`, `diagnosisCode`) are not logged at `DEBUG` or `INFO` level — only anonymised identifiers.

### 3. RBAC Guard Coverage
For every `@Controller()` class and `@Get/@Post/@Put/@Delete` route handler found in the file:
- Confirm a `@Roles(...)` decorator and a `RolesGuard` is applied.
- Confirm the role set is the minimum required (principle of least privilege).
- Flag any route that is publicly accessible without an explicit `@Public()` decorator and justification comment.

### 4. Purpose Limitation
- Review what data fields are collected in DTOs.
- Flag any field that doesn't map to a documented clinical purpose defined in the Privacy Policy.

### 5. Data Retention
- Check for any data seeding or migration scripts that insert data without a `createdAt` / `deletedAt` timestamp — required for POPIA data lifecycle management.

## Output Format

```
## POPIA Audit Report — <file-path>
Date: <ISO date>

### ✅ Passes
- [list of checks that passed]

### ⚠️ Findings
| # | Severity | File | Line | Violation | Recommended Fix |
|---|---|---|---|---|---|
| 1 | HIGH | path/to/file.ts | 42 | Hardcoded email in string literal | Move to environment variable |

### 📋 Summary
- Critical: X  |  High: X  |  Medium: X  |  Low: X
```

Escalate HIGH and CRITICAL findings to the user immediately before proceeding with any other task.
