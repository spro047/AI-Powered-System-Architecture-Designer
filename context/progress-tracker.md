# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 6 — Authentication (Completed)

## Current Goal

- User registration, login, JWT auth with httpOnly cookies, protected API routes

## Completed

- Created `context/project-overview.md` — product description, goals, features, scope, success criteria
- Created `context/architecture.md` — stack, system boundaries, API endpoints, storage model, auth, invariants, AI pipeline
- Created `AGENTS.md` — project-state instruction file for future OpenCode sessions
- Extracted full specification from `AI-Powered System Architecture Designer.docx` and `Development Phases.docx`
- Phase 2: Monorepo setup — turborepo + npm workspaces
- Phase 2: TypeScript strict mode with shared base tsconfig
- Phase 2: Next.js 15 with App Router scaffolded in `apps/frontend/`
- Phase 2: `@archigen/shared` package placeholder in `packages/shared/`
- Phase 2: Prettier config, .gitignore, turbo.json pipeline
- Build verified: `npm run build` passes (turborepo + Next.js production build)
- Phase 5: Express.js server with full production middleware (helmet, cors, morgan, rate-limit, error handler)
- Phase 5: MongoDB Atlas integration (Mongoose document model, non-SRV connection string workaround)
- Phase 5: Project CRUD APIs (create, list, get, update, delete)
- Phase 5: Canvas save/load (PUT /:id/canvas with full state replacement)
- Phase 5: Version management (create snapshot, list versions)
- Phase 5: Component CRUD (add, update, delete project-scoped components)
- Phase 5: Component library API (47 component types across 12 categories)
- Phase 5: Auth middleware (dev: X-User-Id header; JWT placeholder for production)
- Phase 5: Zod validation middleware for all mutation endpoints
- Phase 5: Database seed script (demo user + sample e-commerce project)
- Phase 5: All APIs verified end-to-end via curl against running server
- Phase 5: `turbo build` passes with zero TypeScript errors
- Phase 6: User model with Mongoose (email unique, name, password hashed with bcryptjs, timestamps)
- Phase 6: Auth controller — register (hash + create + JWT), login (verify + JWT), getMe (profile)
- Phase 6: Auth middleware — JWT from Authorization header, httpOnly cookie, or X-User-Id dev fallback
- Phase 6: Zod validators for register/login (email format, password min 6, name required)
- Phase 6: Next.js API route proxies (login, register, logout, me) with httpOnly `archigen-token` cookie
- Phase 6: AuthProvider React context — user state, login/register/logout, auto-redirect (public→login, login→workspace)
- Phase 6: Login page with email/password form, loading spinner, error display
- Phase 6: Register page with name/email/password form, loading spinner, error display
- Phase 6: ClientLayout wrapper providing AuthContext to all routes
- Phase 6: API client updated — removed hardcoded X-User-Id, cookie-based auth flows automatically via fetch
- Phase 6: Full auth flow verified end-to-end (register → cookie set → getMe → cookie works → logout → cookie cleared)
- Phase 6: Protected project routes work with cookie auth through Next.js rewrite proxy
- Phase 6: X-User-Id dev fallback verified still functioning
- Phase 6: `turbo build` passes with zero TypeScript errors

*(none — waiting for next phase direction)*

## Next Up

**Phase 2: Frontend Setup (Next.js scaffold done)**
- [x] Tailwind CSS integration (Next.js starter includes it)
- [x] TypeScript strict mode verified
- [ ] Landing page
- [ ] Dashboard
- [ ] Architecture workspace layout (Top Nav, Left Sidebar, Canvas, Right Panel, Bottom AI Panel)
- [ ] Component sidebar
- [ ] Prompt input panel

**Phase 3: Canvas Engine**
- [ ] React Flow integration
- [ ] Nodes, edges, drag-drop
- [ ] Zoom / pan
- [ ] Auto-layout (ELK.js / Dagre)

**Phase 4: Component Library**
- [ ] Build custom React Flow nodes for each component type (User, Web App, API Gateway, Backend, Database, Cache, Storage, Load Balancer, AI Service)

**Phase 5: Backend Development**
- [x] Express.js server with project CRUD APIs
- [x] MongoDB Atlas connection and document model
- [x] Component library API
- [ ] Export API (POST /api/export)

**Phase 6: Authentication**
- [x] User model (Mongoose, bcryptjs hashing)
- [x] Auth controller + routes (register, login, getMe)
- [x] Auth middleware (JWT Bearer + httpOnly cookie + X-User-Id dev fallback)
- [x] Next.js API route proxies with httpOnly `archigen-token` cookie
- [x] AuthProvider React context with auto-redirect
- [x] Login / Register pages

**Phase 7: AI Integration**
- [ ] Ollama setup
- [ ] Requirement analysis prompt
- [ ] Architecture selection prompt
- [ ] Component extraction prompt
- [ ] Connection generation prompt
- [ ] Structured JSON output pipeline

**Phase 8: AI → Canvas Integration**
- [ ] Parse AI JSON to React Flow nodes/edges
- [ ] Auto-position components
- [ ] Real-time canvas updates during generation

**Phase 9: Architecture Editing**
- [ ] Add/delete/rename components
- [ ] Connect/manage edges
- [ ] Move/resize nodes

**Phase 10: Save & Load Projects**
- [x] Persist canvas state to backend
- [x] Load project and restore canvas

**Phase 11: Export System**
- [ ] Export PNG (using html-to-image or similar)
- [ ] Export JSON (architecture metadata)

**Phase 12: AI Explanation Engine**
- [ ] Architecture summary
- [ ] Component explanations
- [ ] Design decisions

**Phase 13: Architecture Validation**
- [ ] Detect missing/disconnected components
- [ ] Detect invalid connections
- [ ] AI-suggested fixes

**Phase 14: Testing & Optimization**
- [ ] Fix bugs
- [ ] Improve UI polish
- [ ] Optimize AI prompts for accuracy
- [ ] Improve response time
- [ ] User testing

## Open Questions

- ~~Should the project use a monorepo structure (turborepo/nx) or separate frontend/backend directories?~~ **Resolved: monorepo with turborepo + npm workspaces**
- ~~Should the MVP support both PostgreSQL and MongoDB, or commit to PostgreSQL only?~~ **Resolved: MongoDB Atlas with Mongoose (document model)**
- What is the exact deployment target (Vercel for frontend, Railway/Fly for backend)?

## Architecture Decisions

- **HLD-only scope**: The project generates High-Level Design diagrams only. LLD, schema, API specs, and IaC are explicitly out of scope for the MVP. This keeps the project focused and realistic for an MVP/final-year project scope.
- **Local AI with Ollama**: Using open-source LLMs via Ollama avoids API costs. DeepSeek-V3 and Qwen 3 are recommended for MVP — they provide sufficient reasoning for architecture tasks.
- **React Flow for canvas**: Chosen over custom canvas implementations (Fabric.js, Konva) because it provides node/edge management, zoom/pan, drag-drop, and auto-layout integration out of the box.
- **6-component architecture**: Frontend, Backend, AI Engine, Database, Authentication, Storage — no separate microservices or message queues in the MVP architecture.
- **MongoDB document model**: Components, connections, and versions embedded inside the Project document (single `findById()` loads everything, no joins).
- **Non-SRV connection string**: Node.js DNS `querySrv` fails on Windows; using resolved shard hosts with `replicaSet` in standard `mongodb://` format.
- **Dev auth**: `X-User-Id` header in development; JWT from `Authorization: Bearer <token>` in production.
- **httpOnly cookie auth**: JWT stored in httpOnly `archigen-token` cookie set by Next.js API routes (login/register) for XSS protection. Cookie forwarded through the `afterFiles` rewrite proxy to the backend, which also reads JWT from the `Cookie` header. Eliminates the need for client-side token management.
- **Auth middleware priority**: (1) `Authorization: Bearer <token>` (always accepted), (2) `archigen-token` cookie (set by Next.js proxy), (3) `X-User-Id` header (dev/test only).

## Session Notes

- Context files were populated from `AI-Powered System Architecture Designer.docx` (full specification, 1930 paragraphs) and `Development Phases.docx` (14-phase build plan, 194 paragraphs).
- AGENTS.md created at project root with project state, file map, workflow instructions, and constraints for future AI sessions.
- Phase 5 completed with MongoDB Atlas migration. Migrated from Prisma/PostgreSQL to Mongoose document model. All 14 API endpoints verified via curl against the running server. Server on port 4000, database `archigen` on Atlas cluster `cluster0.epujrc8.mongodb.net`.
- Component routes were fixed: project-scoped component CRUD was mounted at wrong path (`/api/components/projects/:id/components`), moved to project router at correct path (`/api/projects/:id/components`).
