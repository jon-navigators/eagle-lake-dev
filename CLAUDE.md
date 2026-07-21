# Project foundation: GSD Core

This repository uses **GSD Core** (Git. Ship. Done — `@opengsd/gsd-core`) as its
coding-rules and development foundation. GSD Core is a spec-driven, context-engineering
workflow that drives work through a disciplined per-phase loop, keeping the main session
lean by running heavy research, planning, and execution in fresh-context subagents.

Installed locally for Claude Code under `./.claude/` (version pinned in
`.claude/gsd-install-state.json`, profile in `.claude/.gsd-profile`).

## The phase loop

Each milestone repeats the same five steps, one phase at a time:

1. **Discuss** — capture implementation decisions before planning
2. **Plan** — research, decompose, verify the plan fits a fresh context window
3. **Execute** — run plans in parallel waves, each executor with a clean context
4. **Verify** — walk through what was built; diagnose and fix before declaring done
5. **Ship** — create the PR, archive the phase, repeat

## Getting started

- New/greenfield work: `/gsd-new-project`
- Onboarding this existing codebase: `/gsd-onboard`
- Full command list: `.claude/commands/` (71 `/gsd-*` commands)
- Agents: `.claude/agents/` · Hooks: `.claude/hooks/` (wired in `.claude/settings.local.json`)

## Working rules

- Follow the GSD phase loop for feature work — do not skip Discuss/Plan/Verify.
- Do not hand-copy files from GSD's `agents/` or `commands/` source; manage the install
  via the `npx @opengsd/gsd-core` installer so runtime transformations stay correct.
- Structured artifacts (`STATE.md`, `CONTEXT.md`, `.planning/`) are the shared memory
  across sessions — keep them current.

See the upstream docs at https://github.com/open-gsd/gsd-core for the full reference.
