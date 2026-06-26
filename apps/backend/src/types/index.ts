// ─────────────────────────────────────────────────────────────
// Shared types for the backend
// Domain types used across controllers, services, and routes
// ─────────────────────────────────────────────────────────────

/** Architecture pattern options */
export type ArchitecturePattern = "Monolithic" | "Microservices" | "Layered" | "EventDriven" | "Serverless";

/** API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AiComponent {
  id: string;
  type: string;
  label: string;
  description: string;
}

export interface AiConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type: string;
}

export interface ArchitectureResult {
  pattern: ArchitecturePattern;
  description: string;
  components: AiComponent[];
  connections: AiConnection[];
}
