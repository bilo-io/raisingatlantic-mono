/**
 * POPIA — special personal information (children's health) cannot appear in logs.
 * This list is consumed by Pino's `redact` option and is also intended for reuse
 * by the Phase 5.3 KMS field-encryption work.
 *
 * Patterns follow pino's path syntax: dot-separated, `*` is a single-level wildcard,
 * `[*]` matches array indices.
 */
export const PII_REDACT_PATHS: readonly string[] = [
  // Direct identifiers
  '*.email',
  '*.emailAddress',
  '*.userEmail',
  '*.firstName',
  '*.lastName',
  '*.fullName',
  '*.name',
  '*.parentName',
  '*.guardianName',
  '*.phone',
  '*.phoneNumber',
  '*.mobile',
  '*.cellNumber',

  // National + professional IDs
  '*.idNumber',
  '*.nationalId',
  '*.passportNumber',
  '*.hpcsaNumber',
  '*.sancNumber',
  '*.practiceNumber',

  // DOB / age
  '*.dateOfBirth',
  '*.dob',
  '*.birthday',
  '*.birthDate',

  // Special-category clinical data
  '*.medicalConditions',
  '*.medicalConditions[*]',
  '*.medicalConditions[*].condition',
  '*.medicalConditions[*].name',
  '*.allergies',
  '*.allergies[*]',
  '*.allergies[*].name',
  '*.diagnosis',
  '*.diagnoses',
  '*.symptoms',
  '*.medications',
  '*.medications[*]',

  // Request body / headers
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'req.body.password',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.email',
  'req.body.idNumber',
  'req.body.dateOfBirth',
  'req.body.medicalConditions',
  'req.body.medicalConditions[*]',
  'req.body.allergies',
  'req.body.allergies[*]',
  'res.headers["set-cookie"]',

  // Generic secret-ish fields
  '*.password',
  '*.token',
  '*.refreshToken',
  '*.accessToken',
  '*.apiKey',
  '*.secret',
] as const;

export const REDACTION_CENSOR = '[REDACTED]';
