/**
 * Typed API client for the ArchiGen backend.
 * All calls go through the Next.js rewrite proxy (/api/* -> localhost:4000/api/*).
 * Auth is handled via httpOnly archigen-token cookie set by Next.js API routes
 * on login/register. The cookie flows through the rewrite proxy automatically.
 * In dev, the backend also accepts the X-User-Id header as a convenience fallback.
 */

/* ── Response shapes ── */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ProjectSummary {
  _id: string;
  title: string;
  description: string | null;
  pattern: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendComponent {
  id: string;
  label: string;
  type: string;
  description: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  metadata: Record<string, unknown> | null;
}

export interface BackendConnection {
  id: string;
  label: string | null;
  type: string;
  sourceId: string;
  targetId: string;
}

export interface ProjectDetail {
  _id: string;
  title: string;
  description: string | null;
  pattern: string | null;
  ownerId: string;
  components: BackendComponent[];
  connections: BackendConnection[];
  explanation: ArchitectureExplanation | null;
  versions: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  pattern?: string;
}

export interface SaveCanvasInput {
  title?: string;
  description?: string;
  pattern?: string;
  components: BackendComponent[];
  connections: BackendConnection[];
  explanation?: ArchitectureExplanation;
}

export interface CreateVersionInput {
  label?: string;
}

export interface VersionResult {
  version: number;
  label: string | null;
  createdAt: string;
}

/* ── Fetch wrapper ── */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (res.status === 204) return null as T;

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError(body.error ?? body.message ?? "Request failed", res.status);
  }

  return body.data as T;
}

/* ── API methods ── */

export const api = {
  /* Projects */
  listProjects(): Promise<ProjectSummary[]> {
    return request("/api/projects");
  },

  getProject(id: string): Promise<ProjectDetail> {
    return request(`/api/projects/${id}`);
  },

  createProject(input: CreateProjectInput): Promise<ProjectDetail> {
    return request("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateProjectMeta(id: string, input: Partial<CreateProjectInput>): Promise<ProjectDetail> {
    return request(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  deleteProject(id: string): Promise<null> {
    return request(`/api/projects/${id}`, { method: "DELETE" });
  },

  /* Canvas */
  saveCanvas(id: string, input: SaveCanvasInput): Promise<ProjectDetail> {
    return request(`/api/projects/${id}/canvas`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  /* Versions */
  createVersion(id: string, input: CreateVersionInput): Promise<VersionResult> {
    return request(`/api/projects/${id}/versions`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  listVersions(id: string): Promise<unknown[]> {
    return request(`/api/projects/${id}/versions`);
  },

  /* Component library */
  getLibrary(): Promise<unknown> {
    return request("/api/components");
  },

  /* Architecture explanation */
  explainArchitecture(input: ExplainArchitectureInput): Promise<ArchitectureExplanation> {
    return request("/api/architecture/explain", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};

/* ── Architecture Explanation types ── */

export interface ExplainComponentInput {
  id: string;
  type: string;
  label: string;
  description: string;
}

export interface ExplainConnectionInput {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type: string;
}

export interface ExplainArchitectureInput {
  projectId: string;
  pattern: string;
  description: string;
  components: ExplainComponentInput[];
  connections: ExplainConnectionInput[];
}

export interface ComponentExplanation {
  id: string;
  label: string;
  explanation: string;
}

export interface DesignDecision {
  topic: string;
  decision: string;
  rationale: string;
}

export interface ArchitectureExplanation {
  summary: string;
  patternExplanation: string;
  componentExplanations: ComponentExplanation[];
  designDecisions: DesignDecision[];
}
