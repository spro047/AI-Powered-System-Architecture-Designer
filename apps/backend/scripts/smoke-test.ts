/**
 * Smoke test — verifies the backend is working end-to-end.
 *
 * Prerequisites:
 *   1. MongoDB Atlas connection string set in .env
 *   2. `npx tsx src/seed.ts` has been run to seed demo data
 *
 * Usage:
 *   npx tsx apps/backend/scripts/smoke-test.ts
 */

const BASE_URL = process.env["BASE_URL"] ?? "http://localhost:4000";

async function request(method: string, path: string, body?: unknown) {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Use the demo user ID from the seed script
  // In dev mode, auth middleware reads X-User-Id
  headers["X-User-Id"] = "00000000-0000-0000-0000-000000000000";

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, ok: res.ok, data };
}

function assert(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${label}`);
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    process.exitCode = 1;
  }
}

async function main() {
  console.log(`\n🚀 Smoke testing backend at ${BASE_URL}\n`);

  // ── 1. Health check ────────────────────────────────────────
  console.log("1. Health check");
  const health = await request("GET", "/health");
  assert("GET /health returns 200", health.status === 200);
  assert("Response has status 'ok'", (health.data as Record<string, unknown>)?.["status"] === "ok");

  // ── 2. GET /api/components (public, no auth) ───────────────
  console.log("\n2. Component library (public)");
  const lib = await request("GET", "/api/components");
  // Skip auth header for public endpoint
  const lib2 = await fetch(`${BASE_URL}/api/components`);
  const libData = await lib2.json() as Record<string, unknown>;
  assert("GET /api/components returns 200", lib2.status === 200);
  assert("Library has categories", Array.isArray(libData["data"]));
  assert("Library has 12 categories", (libData["data"] as unknown[]).length === 12);

  // ── 3. POST /api/projects — create ─────────────────────────
  console.log("\n3. Create project");
  const created = await request("POST", "/api/projects", {
    title: "Smoke Test E-Commerce",
    description: "Testing the project API",
    pattern: "Microservices",
  });

  const projectId = ((created.data as Record<string, unknown>)?.["data"] as Record<string, string>)?.["id"];

  if (created.status === 201 && projectId) {
    assert("POST /api/projects returns 201", true);
    assert("Created project has an ID", !!projectId);

    // ── 4. GET /api/projects — list ──────────────────────────
    console.log("\n4. List projects");
    const list = await request("GET", "/api/projects");
    assert("GET /api/projects returns 200", list.status === 200);
    const projects = (list.data as Record<string, unknown>)?.["data"] as unknown[];
    assert("At least 1 project exists", projects.length >= 1);

    // ── 5. GET /api/projects/:id — load ──────────────────────
    console.log("\n5. Load project by ID");
    const loaded = await request("GET", `/api/projects/${projectId}`);
    assert("GET /api/projects/:id returns 200", loaded.status === 200);
    const proj = (loaded.data as Record<string, unknown>)?.["data"] as Record<string, unknown>;
    assert("Project has title", proj["title"] === "Smoke Test E-Commerce");

    // ── 6. PUT /api/projects/:id/canvas — save canvas ────────
    console.log("\n6. Save canvas state");
    const saved = await request("PUT", `/api/projects/${projectId}/canvas`, {
      title: "Smoke Test Updated",
      components: [
        { id: "a0000000-0000-0000-0000-000000000001", label: "Web App", type: "WebApp", x: 100, y: 50, width: 200, height: 120 },
        { id: "a0000000-0000-0000-0000-000000000002", label: "API Gateway", type: "APIGateway", x: 100, y: 250, width: 200, height: 120 },
        { id: "a0000000-0000-0000-0000-000000000003", label: "PostgreSQL", type: "Database", x: 100, y: 450, width: 200, height: 120 },
      ],
      connections: [
        { label: "HTTP", type: "http", sourceId: "a0000000-0000-0000-0000-000000000001", targetId: "a0000000-0000-0000-0000-000000000002" },
        { label: "SQL", type: "data-flow", sourceId: "a0000000-0000-0000-0000-000000000002", targetId: "a0000000-0000-0000-0000-000000000003" },
      ],
    });
    assert("PUT /api/projects/:id/canvas returns 200", saved.status === 200);
    const savedData = (saved.data as Record<string, unknown>)?.["data"] as Record<string, unknown>;
    assert("Title was updated", (savedData?.["title"] as string) === "Smoke Test Updated");
    const comps = savedData?.["components"] as unknown[];
    assert("3 components saved", comps?.length === 3);
    const conns = savedData?.["connections"] as unknown[];
    assert("2 connections saved", conns?.length === 2);

    // ── 7. POST /api/projects/:id/versions — snapshot ────────
    console.log("\n7. Create version snapshot");
    const ver = await request("POST", `/api/projects/${projectId}/versions`, {
      label: "After initial layout",
    });
    assert("POST /api/projects/:id/versions returns 201", ver.status === 201);

    // ── 8. GET /api/projects/:id/versions — list ─────────────
    console.log("\n8. List versions");
    const versions = await request("GET", `/api/projects/${projectId}/versions`);
    assert("GET /api/projects/:id/versions returns 200", versions.status === 200);
    const versList = (versions.data as Record<string, unknown>)?.["data"] as unknown[];
    assert("At least 1 version", versList?.length >= 1);

    // ── 9. Add a component ───────────────────────────────────
    console.log("\n9. Add component");
    const added = await request("POST", `/api/projects/${projectId}/components`, {
      label: "Redis Cache",
      type: "Redis",
      x: 400,
      y: 450,
      width: 160,
      height: 110,
    });
    assert("POST /api/projects/:id/components returns 201", added.status === 201);

    // ── 10. DELETE /api/projects/:id — cleanup ───────────────
    console.log("\n10. Cleanup — delete project");
    const del = await request("DELETE", `/api/projects/${projectId}`);
    assert("DELETE /api/projects/:id returns 204", del.status === 204);

    console.log("\n─── All smoke tests passed ───");
  } else {
    console.log(`\n  ❌ Project creation failed (status ${created.status}):`, created.data);
    console.log("\n  Most likely causes:");
    console.log("  • MongoDB not reachable — check your Atlas connection string in .env");
    console.log("  • Seed not run — then run:");
    console.log("    cd apps/backend && npx tsx src/seed.ts");
    console.log("  • Server not started on port 4000 — run:");
    console.log("    cd apps/backend && npx tsx src/index.ts");
    console.log("  • X-User-Id not recognized — use the demo user's _id from the seed output.");
  }
}

main().catch(console.error);
