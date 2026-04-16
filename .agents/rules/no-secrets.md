---
trigger: always_on
glob: "**/*"
description: Prevents hardcoding of API keys and secrets in any file or terminal output.
---

# Rule: No Hardcoded Secrets

## Objective
Prevent the exposure of sensitive information in the codebase, logs, or AI-generated snippets.

## Constraints
1. **Environment Variables**: Never hardcode API keys, passwords, or tokens. Use `process.env` (Node) or `publicRuntimeConfig` (Next.js).
2. **File Scanning**: Before reading or editing a file, check for the presence of `.env`, `.pem`, `.key`, or `credentials.json`. Never output the contents of these files.
3. **Placeholder usage**: If a config value is needed, always use a placeholder like `process.env.NEXT_PUBLIC_API_URL` or `<REDACTED_SECRET>`.
4. **Gitignore Awareness**: Respect all rules in the root `.gitignore`.
5. **Gemini CLI Safety**: When using `gemini-cli` for audits, ensure that local `.env` files are explicitly excluded from the search context.

## Violation Actions
If a secret is found in the current code, stop immediately and advise the user to run a secret scrubbing tool or rotate the key.