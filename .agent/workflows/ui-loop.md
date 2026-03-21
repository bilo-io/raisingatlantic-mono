---
title: UI Generation Loop
description: Creates a new UI component using Stitch Loop and refactors it to use the project's theme tokens.
---

# Workflow: UI Generation Loop
Trigger: `/ui`

1. **Invoke Stitch**: Run `npx stitch-loop` based on the user's description.
2. **Review Output**: Load the generated HTML/React code.
3. **Refactor**: 
    - Replace generic Tailwind colors with tokens from `src/shared/theme.ts`.
    - Ensure all icons use `lucide-react`.
4. **Place**: Move the finished component to `src/shared/components/<Name>.tsx`.
5. **Register**: Run `moon run shared:build` to update project references.