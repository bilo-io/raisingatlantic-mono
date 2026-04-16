---
title: Sync Schema
description: Analyses modified TypeORM entities and generates the raw SQL migration script required for the PostgreSQL container (TCP/5433).
trigger: /sync-schema
---

# Skill: `/sync-schema`

> **Trigger via:** `@backend /sync-schema`

Detects TypeORM entity changes since the last migration and generates the corresponding SQL migration file. Run this whenever you add, remove, or modify a TypeORM `@Entity()` class.

## Steps

### 1. Detect Changes
Identify which entity files have been modified:
```bash
git diff --name-only HEAD -- 'src/apps/api/src/**/*.entity.ts'
```

### 2. Review Entity Diff
For each changed entity:
- List new `@Column()` decorators added.
- List removed columns.
- List modified column types, lengths, or constraints.
- List new `@ManyToOne()`, `@OneToMany()`, `@ManyToMany()` relationships.
- Check for new `@Index()` decorators.

### 3. Generate Migration
Run the TypeORM CLI via moon to auto-generate the migration script:
```bash
moon run api:migration-generate -- --name=<descriptive-migration-name>
```

### 4. Review Generated SQL
Open the generated file in `src/apps/api/src/migrations/` and verify:
- No `DROP TABLE` or `DROP COLUMN` on data that should be preserved — use soft deletes (`deletedAt`) instead.
- All new `NOT NULL` columns have a sensible `DEFAULT` value for existing rows.
- Foreign key constraints include `ON DELETE` behaviour appropriate to the domain.
- Tenant isolation columns (`tenantId`, `practiceId`) are present on all patient data tables.

### 5. Apply Migration
```bash
moon run api:migrate
```

### 6. Verify
```bash
moon run :build
moon run tests:test
```
Confirm the API connects successfully and all existing tests still pass.

> ⚠️ **Never use `synchronize: true`** in the TypeORM config for production or staging environments. Migrations must always be explicit and reviewed.
