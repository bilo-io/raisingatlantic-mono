---
title: New Endpoint
description: Creates a new endpiont in the src/apis/ folder
---

# Workflow: Fullstack Endpoint Scaffold
Trigger: `/endpoint`

1. **Audit**: Use `gemini-cli` to search `src/apis` for existing routes to prevent duplicates.
2. **Backend**: 
    - Add the new route and logic to the relevant project in `src/apis`.
    - Update the Prisma schema and run `moon api:migrate`.
3. **Shared**: 
    - Create a Zod schema in `src/shared/schemas` for the request/response.
4. **Frontend**: 
    - Create a typed `useFetch` hook in `src/shared/hooks` using the new Zod schema.
5. **Verify**: Run `moon run :validate` to ensure the monorepo graph is intact.