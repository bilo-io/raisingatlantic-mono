---
title: Generate Tests
description: Reads the logic of a completed file and outputs corresponding Jest unit tests or Postman API assertions.
trigger: /generate-tests <file-path>
---

# Skill: `/generate-tests <file-path>`

> **Trigger via:** `@qa-tester /generate-tests <file-path>`

Reads the implementation of a given source file and generates a comprehensive test suite. Pass the path to a service, controller, utility, or shared schema file.

## Steps

### 1. Read & Analyse
- Open `<file-path>` and identify:
  - All exported functions and class methods
  - All expected inputs and return types
  - All thrown exceptions and error paths
  - Any external dependencies (inject as mocks)

### 2. Unit Test Generation (Jest)
Output to `<file-path>.spec.ts` (co-located with source):

For each exported function / class method, produce:

```ts
describe('<ClassName or functionName>', () => {
  // Happy path
  it('should <expected behaviour> when <conditions>', async () => { ... });

  // Edge cases
  it('should handle <boundary value or null input>', async () => { ... });

  // Error paths
  it('should throw <ErrorType> when <failure condition>', async () => { ... });
});
```

**Mocking rules:**
- Mock all TypeORM repositories with `jest.fn()`.
- Mock all telemetry interfaces (`ILoggerService`, `ITracerService`) with no-op implementations.
- Never make real HTTP or database calls in unit tests.

### 3. Postman Assertion Generation (API routes only)
If `<file-path>` is a NestJS controller, append to `tests/postman/api_collection.json`:
- **Happy-path request** with a valid payload.
- **Status code assertion**: `pm.response.to.have.status(<expected>)`.
- **Schema validation**: JSON Schema assertion matching the shared Zod schema.
- **RBAC check**: Duplicate the request with a wrong-role token and assert `403 Forbidden`.

### 4. Clinical Logic Special Rules
If the file contains immunisation, growth, or milestone logic:
- Add explicit boundary-value tests for each age threshold (e.g., 6 weeks exactly, 6 weeks + 1 day, 6 weeks - 1 day).
- Test dose limits (e.g., Rotavirus max 2 doses before 8 months).
- Test with WHO z-score thresholds for growth (e.g., -3 SD, -2 SD, 0 SD, +2 SD).

### 5. Run & Verify
```bash
moon run tests:test
```
All generated tests must pass before handing back to the user.
