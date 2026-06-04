# /golive-phase

Execute a go-live phase from one of the role-focused roadmaps under `docs/GO_LIVE/` — either `DEV.md` (overall product, Phases 0–14) or `MOBILE.md` (Expo / React Native app, Phases M0–M5). Browse incomplete tasks, plan the work, implement in a dedicated worktree, and open a PR.

## Arguments

`$ARGUMENTS` — optional. May contain:
- a roadmap hint (`dev`, `mobile`, `web`) — selects the source document
- a phase number or name (e.g. `1`, `1.4`, `Phase 2`, `auth`, `M0`, `M2.1`, `parent`)

Both can be combined: `mobile M1`, `dev 1.4`, `mobile parent`. If only a phase is given, infer the roadmap from the prefix (`M*` → `MOBILE.md`, otherwise `DEV.md`). If `$ARGUMENTS` is empty, prompt the user for both.

---

## Step 0 — Pick the roadmap

The two roadmaps live side-by-side and use different phase-numbering conventions:

| Roadmap | Path | Phases |
|---|---|---|
| DEV (overall product) | `docs/GO_LIVE/DEV.md` | `0`, `1`, `1.4`, `2` … `14` |
| MOBILE (Expo app) | `docs/GO_LIVE/MOBILE.md` | `M0`, `M0.1`, `M1` … `M5` |

### Resolve the roadmap

- If `$ARGUMENTS` contains the word `mobile` (case-insensitive) → roadmap = `MOBILE.md`.
- If `$ARGUMENTS` contains the word `dev` or `web` → roadmap = `DEV.md`.
- Else if the phase token starts with `M` followed by a digit (e.g. `M0`, `M2.1`) → roadmap = `MOBILE.md`.
- Else if the phase token starts with a digit (e.g. `1`, `1.4`) → roadmap = `DEV.md`.
- Otherwise (no `$ARGUMENTS`, or ambiguous): print this and wait for the user to reply with `1` or `2`:

```
Which roadmap?
  1) docs/GO_LIVE/DEV.md    — overall product (Phases 0–14)
  2) docs/GO_LIVE/MOBILE.md — Expo / React Native app (Phases M0–M5)
```

Bind two variables for the rest of the run:

- `<doc>` = absolute repo-relative path to the chosen roadmap (`docs/GO_LIVE/DEV.md` or `docs/GO_LIVE/MOBILE.md`).
- `<slug>` = `dev` or `mobile` — used in branch names, worktree paths, and the PHASE TODO filename.

---

## Step 1 — Identify the target phase

Read `<doc>` in full.

For **every phase** in the document, count:
- **total tasks**: every line that starts with `- [ ]` or `- [x]`
- **done tasks**: lines that start with `- [x]`
- **completion %**: `round(done / total * 100)` (show 100% only if every task is done)

### If no phase token was supplied

Print a table of all phases in `<doc>` that have at least one incomplete task (`- [ ]`), sorted by phase number:

For `DEV.md`:
```
Phases with outstanding work in docs/GO_LIVE/DEV.md
─────────────────────────────────────────────────────
 #    Phase title                          Done
─────────────────────────────────────────────────────
 1    Infrastructure & Hosting Decision    12%
 2    Authentication & Identity             0%
 …
```

For `MOBILE.md`:
```
Phases with outstanding work in docs/GO_LIVE/MOBILE.md
─────────────────────────────────────────────────────
 #    Phase title                          Done
─────────────────────────────────────────────────────
 M0   Foundations                           0%
 M1   Parent Flow                           0%
 …
```

Then ask: **"Which phase would you like to tackle? (enter number or name)"**

Wait for the user's reply before continuing. Set the chosen phase as the working target.

### If a phase token is supplied

Match the argument (case-insensitive, partial match on number or title words) to a phase in `<doc>`. Mobile phases must keep the `M` prefix (`M0`, `M2.1`). Print a single-phase summary, e.g.:

```
Phase M1 — Parent Flow
Completion: 0%  (0 / 26 tasks done)

Outstanding tasks
  § M1.1  Children
  § M1.2  Records (Growth · Milestones · Vaccinations)
  …
```

Set this as the working target. Bind `<N>` to the phase identifier (`1`, `1.4`, `M0`, `M2.1`).

---

## Step 2 — Confirm planning mode

Print this message verbatim (substituting `<N>`, `<title>`, and `<doc>`):

```
─────────────────────────────────────────────────────
  PLANNING MODE REQUIRED
  I'm about to draft an implementation plan for:
  Phase <N> — <title>  (from <doc>)

  If you are not already in planning mode (Shift+Tab
  toggles it in the Claude Code CLI), switch now.

  When you're ready, reply "go", "continue", or "plan".
─────────────────────────────────────────────────────
```

**Pause and wait** for the user to reply before doing anything else.
Do not proceed past this step until the user sends a message containing "go", "continue", "plan", or any affirmative (yes / ok / proceed / start / let's go).

---

## Step 3 — Enter planning mode and draft the plan

Use `EnterPlanMode` to switch into plan mode.

Draft a step-by-step implementation plan that covers **only the incomplete tasks** (`- [ ]`) in the target phase. The plan must include:

1. **Context** — one paragraph: what this phase achieves, why it matters for go-live, and any cross-phase dependencies noted in `<doc>`. For mobile phases, also note the cross-link to the corresponding `DEV.md` phase (shown in the `> Source:` footer of each mobile phase).
2. **Scope** — bullet list of the specific `- [ ]` items being addressed (copy the text verbatim from `<doc>`).
3. **Implementation steps** — ordered, actionable steps a developer can execute. Each step must reference the relevant section number (e.g. `§1.2` or `§M1.1`) and the concrete artifact to produce (file path, Terraform resource, workflow name, React Native component, etc.).
4. **Out of scope** — anything explicitly deferred or owned by a non-DEV role.
5. **Acceptance criteria** — how we know the phase tasks are done (tests pass, `- [x]` in `<doc>`, PR merged).

Use `ExitPlanMode` to present the plan for approval.

Ask: **"Does this plan look good? Reply 'approved' to start execution, or give feedback to revise."**

Wait for approval. If the user requests changes, revise the plan and ask again. Do not start execution until the user explicitly approves.

---

## Step 4 — Set up a worktree and feature branch

Once the plan is approved:

Derive branch and directory names from the roadmap and phase. Convert `.` to `-` in the phase identifier:
- branch: `feat/golive-<slug>-phase-<N-sanitised>` (e.g. `feat/golive-dev-phase-1-4`, `feat/golive-mobile-phase-m1`, `feat/golive-mobile-phase-m2-1`)
- worktree path: `/tmp/ra-golive-<slug>-<N-sanitised>` (e.g. `/tmp/ra-golive-dev-1-4`, `/tmp/ra-golive-mobile-m1`)

Run:
```bash
git worktree add -b feat/golive-<slug>-phase-<N-sanitised> /tmp/ra-golive-<slug>-<N-sanitised> dev
```

All file edits from this point forward happen inside that worktree directory. Do **not** modify files in the main working directory.

---

## Step 5 — Execute the plan

Work through each implementation step from the approved plan inside the worktree.

**Conventions:**
- Terraform files go under `infra/` following the layout described in §1.4 of DEV.md.
- GitHub Actions workflows go under `.github/workflows/`.
- Application code goes in the relevant `apps/` or `pkgs/` subdirectory. For mobile phases, edits land under `src/apps/mobile/` (screens at `src/apps/mobile/app/**`, shared components at `src/apps/mobile/components/**`, data layer at `src/apps/mobile/lib/api/**`).
- Do not create documentation files or READMEs unless the phase explicitly requires one.
- Do not add code comments that explain *what* the code does; only add a comment when the *why* is non-obvious.

As you complete each task, immediately mark the corresponding line in `<doc>` (i.e. `docs/GO_LIVE/DEV.md` or `docs/GO_LIVE/MOBILE.md`) from `- [ ]` to `- [x]`.

---

## Step 6 — Create the phase TODO file

After all tasks are attempted, create (or update) the phase TODO file inside the worktree.

- For `DEV.md` phases: `docs/GO_LIVE/PHASE_<N>_TODO.md`
- For `MOBILE.md` phases: `docs/GO_LIVE/MOBILE_PHASE_<N>_TODO.md`

(`<N>` keeps its original format — `1`, `1.4`, `M0`, `M2.1`.)

```markdown
# Phase <N> — <title>: Outstanding Items

> Auto-generated by /golive-phase on <date> from <doc>. Update manually as tasks are completed.

## Completed this session
- list of tasks just marked [x]

## Still outstanding
- list of any tasks that remain [ ] (if all done, write "None — phase complete.")

## Blockers / notes
- anything that couldn't be automated (requires GCP console access, external KYC, legal review, EAS credentials, App Store / Play Store accounts, design assets from DESIGN, etc.)
```

---

## Step 7 — Commit and push

Stage all changes in the worktree and create a single commit. Title format depends on roadmap:

- DEV: `feat(golive): Phase <N> — <title> implementation`
- MOBILE: `feat(golive-mobile): Phase <N> — <title> implementation`

```
<title-line>

Covers: <brief one-line summary of what was done>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Push the branch to origin.

---

## Step 8 — Open a pull request

PR title mirrors the commit title:
- DEV: `feat(golive): Phase <N> — <title>`
- MOBILE: `feat(golive-mobile): Phase <N> — <title>`

Run:
```bash
gh pr create \
  --base dev \
  --title "<pr-title>" \
  --body "$(cat <<'EOF'
## Summary

Phase <N> — <title>  (from <doc>)

<2-3 bullet points describing the concrete changes>

## Go-live checklist items addressed

<!-- copy the - [x] lines from <doc> that were completed -->

## Still outstanding in this phase

<!-- copy any - [ ] lines that remain, or write "None — phase complete." -->

## Test plan

- [ ] Code builds clean (`moon run :build` / phase-relevant targets)
- [ ] Type-check + lint pass (`moon run :typecheck`, `moon run :lint`)
- [ ] For DEV phases: Terraform plan runs clean if infra touched; GitHub Actions workflows validate
- [ ] For MOBILE phases: Expo dev server boots; relevant screens render against fixtures; `EXPO_PUBLIC_USE_API=true` mode reaches the API
- [ ] <doc> updated with completed checkboxes
- [ ] Phase TODO file created/updated

🤖 Generated with [Claude Code](https://claude.com/claude-code) via /golive-phase
EOF
)"
```

Print the PR URL so the user can open it directly.

---

## Done

Print the following block (substitute `<doc>`, `<N>`, `<title>`, `<slug>`):

```
Phase <N> — <title>  (from <doc>)
PR: <url>
Worktree: /tmp/ra-golive-<slug>-<N-sanitised>
  └─ clean up with: git worktree remove /tmp/ra-golive-<slug>-<N-sanitised>
```

Then print a session summary in this exact style — concise, scannable, one line per item:

---

Done. Here's what was checked off in <doc>:

✅ **Marked complete** (code exists in this PR):

- <short description of each task just marked `[x]`, matching the <doc> wording>

⬜ **Left unchecked** (require a manual, external, or non-DEV action):

- <short description of each task still `[ ]`, with a one-phrase reason: e.g. "needs live GCP account", "awaiting legal sign-off", "requires Stripe KYC", "needs DESIGN icon set", "blocked on Apple Developer enrolment">

---

Rules for this summary:
- Keep each bullet to one line — trim the prose to its essential noun phrase.
- If every task in the phase is complete, replace the ⬜ block with: `⬜ Nothing outstanding — phase complete.`
- Do not invent items; only reflect what is actually in `<doc>` for this phase.
- The ✅ / ⬜ distinction is the most important signal — make it visually obvious.
