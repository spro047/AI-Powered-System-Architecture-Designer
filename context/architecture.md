# Architecture Context

## Stack

| Layer           | Technology                                   | Role                          |
| --------------- | -------------------------------------------- | ----------------------------- |
| Framework       | Next.js + TypeScript                         | Fullstack framework           |
| UI              | Tailwind CSS + React Flow                    | Styling + interactive canvas  |
| Auth            | NextAuth.js / JWT                            | Authentication                |
| Database        | PostgreSQL (primary) + MongoDB (optional)    | Data persistence              |
| Backend API     | Node.js + Express.js                         | REST API server               |
| AI Integration  | Ollama (local) + DeepSeek-V3 / Qwen 3        | LLM inference                 |
| Layout Engine   | ELK.js / Dagre                               | Auto-layout for architecture diagrams |
| Drag & Drop     | React DnD / React Flow built-in              | Component manipulation on canvas |
| Storage         | Local filesystem (MVP); cloud storage (future) | Exported files and assets   |
| Containerization| Docker                                       | Local development environment |

## System Boundaries

- `frontend/` — Next.js application. Owns the UI: landing page, dashboard, architecture workspace, prompt input panel, component sidebar, canvas, export module, properties panel.
- `backend/` — Express.js API server. Owns project CRUD, architecture generation orchestration, export processing, user management.
- `ai-engine/` — LLM integration layer. Owns requirement analysis, architecture pattern selection, component identification, connection generation, recommendation engine, architecture explanation.
- `database/` — PostgreSQL schema and migrations. Owns user data, project metadata, component/connection state, architecture versions, AI generation history.
- `storage/` — File storage layer. Owns exported PNG/PDF/SVG/JSON files.

## Component Architecture (6-service model for MVP)

```
User
  ↓
Frontend (Next.js + React Flow)
  ↓
Backend (Express.js REST API)
  ↓
AI Engine (Ollama + DeepSeek-V3 / Qwen 3)
  ↓
Database (PostgreSQL)
  │
  └── Storage (Local filesystem for exports)
```

The project follows a **6-component architecture** for MVP:
1. Frontend — Next.js + React Flow + Tailwind
2. Backend — Express.js REST API
3. AI Engine — Ollama + LLM prompt pipeline
4. Database — PostgreSQL
5. Authentication — JWT-based auth layer
6. Storage — Local filesystem for exports

No separate microservices, message queues, Kubernetes, or cloud infrastructure is included in the initial PRD — this keeps the architecture simple and aligned with the HLD-only project scope.

## API Endpoints (MVP)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | `/api/projects` | Create project |
| GET    | `/api/projects` | List user projects |
| GET    | `/api/projects/{id}` | Load project with components/connections |
| PUT    | `/api/projects/{id}` | Save project |
| DELETE | `/api/projects/{id}` | Delete project |
| POST   | `/api/architecture/generate` | Generate HLD from prompt |
| POST   | `/api/architecture/regenerate` | Update architecture with new prompt |
| GET    | `/api/architecture/{id}/explanation` | Get AI architecture explanation |
| POST   | `/api/export` | Export diagram (PNG/PDF/SVG/JSON) |
| GET    | `/api/components` | Get component library |
| POST   | `/api/projects/{id}/versions` | Save architecture version |
| GET    | `/api/projects/{id}/versions` | List architecture versions |

## Storage Model

- **Database (PostgreSQL)**: User accounts, project metadata, component placements (x/y/width/height), connections (source/target/type), architecture versions, AI generation history, component library definitions.
- **File Storage (Local filesystem - MVP)**: Exported PNG, PDF, SVG, JSON files. Cloud storage (S3/compatible) is planned for future.

## Auth and Access Model

- Every user signs up and logs in via JWT-based authentication.
- Passwords are hashed with bcrypt before storage.
- Every project has a single owner (User ID).
- Only the owner can view, edit, or delete their projects.
- Unauthorized API requests are rejected with 401/403.
- HTTPS required for all client-server communication.
- Input validation and sanitization applied at all API boundaries.

## Invariants

1. Request handlers validate auth and ownership before any mutation.
2. AI-generated architectures are editable — the system never locks a user out of manual changes.
3. Project data is never lost on AI failure — the canvas state is persisted independently.
4. The canvas supports undo/redo — destructive AI regeneration must not destroy manual edits.
5. No LLD, database schema, API spec, Terraform, or Kubernetes code is generated — the project is HLD-only.
6. AI runs via local/open-source models (Ollama) — no paid API key requirement for MVP.
7. Architecture generations are non-deterministic — validation rules catch common AI errors (missing components, invalid connections).
8. Browser performance is preserved via virtual rendering — diagrams with hundreds of nodes must not freeze the canvas.

## AI Generation Pipeline

```
User Prompt
  → Requirement Analysis (extract features & modules)
  → Architecture Pattern Selection (Monolithic / Microservices / Layered)
  → Component Identification (map features to component types)
  → Connection Generation (define directional data flow)
  → JSON Output { pattern, components[], connections[] }
  → Canvas Rendering (React Flow nodes + edges + auto-layout)
```

LLM prompt strategy uses structured prompts with predefined rules to minimize AI hallucinations. Architecture validation runs after generation to catch missing components, disconnected nodes, and invalid connections.
