# AGENTS.md

## Project state

Pre-development scaffold. **No code has been written yet.** The `context/` directory holds the populated specification extracted from the two `.docx` files. Always implement against these context files — they are the binding spec.

## File map

| Path | Purpose |
|------|---------|
| `AI-Powered System Architecture Designer.docx` | Project specification (primary source of truth) |
| `Development Phases.docx` | Phased build plan |
| `context/*.md` | Spec templates — populate these before coding |
| `.codegraph/` | CodeGraph tool data — entire directory gitignored (`.gitignore` only preserves itself). Never edit manually. |

## Workflow

1. **Populate context files first.** Extract spec from the `.docx` files into `context/project-overview.md`, `context/architecture.md`, `context/code-standards.md`, `context/ui-context.md`, and `context/ai-workflow-rules.md`. Update `context/progress-tracker.md` as work progresses.
2. **Implement against context specs.** Do not invent behavior not defined in the context files — they are the binding spec.
3. **No package manager or toolchain yet.** When the stack is chosen, set up `package.json`, TypeScript config, linter, formatter, and dev servers before writing application code.
4. **Follow the phase plan in `context/progress-tracker.md`.** Build phases in order: Foundation → Frontend → Canvas → Components → Backend → Auth → AI → AI→Canvas → Editing → Save/Load → Export → Explanation → Validation → Testing.

## Constraints from context templates

- Architecture invariants, code standards, and UI tokens all live in `context/*.md` — keep them in sync with implementation.
- The `context/ai-workflow-rules.md` template specifies an incremental, spec-driven workflow: one feature unit at a time, no mixing unrelated system boundaries, verify end-to-end before moving on.
- Protected files identified in the workflow rules must be respected once chosen.
- Before each implementation phase, `npm run build` (or equivalent) must pass.

## Monorepo structure

```
├── apps/
│   └── frontend/          # Next.js 15 (App Router) + TypeScript
├── packages/
│   └── shared/            # @archigen/shared — shared types (placeholder)
├── package.json           # npm workspaces root
├── turbo.json             # Turborepo pipeline config
├── tsconfig.base.json     # Shared strict TypeScript config
├── .prettierrc
└── .gitignore
```

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start all apps in dev mode (turbo) |
| `npm run build` | Build all apps (turbo, type-checked) |
| `npm run lint` | Lint all apps |
| `npm run clean` | Remove build artifacts across all apps |
| `npm run format` | Prettier format all files |

## What is not here

- No source code beyond scaffold pages
- No tests
- No git history
- No Docker, CI config, or deployment infra
- Backend (Express.js), AI engine, database setup — all future phases
