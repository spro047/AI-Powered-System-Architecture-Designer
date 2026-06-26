import type { Node, Edge } from "@xyflow/react";

export type ArchitectureCategory =
  | "user"
  | "frontend"
  | "backend"
  | "infrastructure"
  | "database"
  | "messaging"
  | "storage"
  | "ai"
  | "external"
  | "monitoring";

export interface ArchitectureNodeData {
  label: string;
  category: ArchitectureCategory;
  icon: string;
  technology?: string;
  description?: string;
  [key: string]: unknown;
}

export interface DatabaseNodeData extends ArchitectureNodeData {
  dbType?: "sql" | "nosql" | "document" | "relational";
}

export interface CacheNodeData extends ArchitectureNodeData {
  cacheType?: "redis" | "in-memory";
}

export interface LoadBalancerNodeData extends ArchitectureNodeData {
  algorithm?: "round-robin" | "least-connections" | "ip-hash";
}

export type ArchitectureNode = Node<ArchitectureNodeData, "architecture">;
export type ArchitectureEdge = Edge;

// Category visual config
export interface CategoryStyle {
  bg: string;
  border: string;
  headerBg: string;
  textColor: string;
}

export const CATEGORY_STYLES: Record<ArchitectureCategory, CategoryStyle> = {
  user: {
    bg: "bg-purple-100",
    border: "border-purple-400",
    headerBg: "bg-purple-400",
    textColor: "text-purple-900",
  },
  frontend: {
    bg: "bg-blue-100",
    border: "border-blue-400",
    headerBg: "bg-blue-400",
    textColor: "text-blue-900",
  },
  backend: {
    bg: "bg-green-100",
    border: "border-green-400",
    headerBg: "bg-green-400",
    textColor: "text-green-900",
  },
  infrastructure: {
    bg: "bg-orange-100",
    border: "border-orange-400",
    headerBg: "bg-orange-400",
    textColor: "text-orange-900",
  },
  database: {
    bg: "bg-cyan-100",
    border: "border-cyan-400",
    headerBg: "bg-cyan-400",
    textColor: "text-cyan-900",
  },
  messaging: {
    bg: "bg-pink-100",
    border: "border-pink-400",
    headerBg: "bg-pink-400",
    textColor: "text-pink-900",
  },
  storage: {
    bg: "bg-amber-100",
    border: "border-amber-400",
    headerBg: "bg-amber-400",
    textColor: "text-amber-900",
  },
  ai: {
    bg: "bg-indigo-100",
    border: "border-indigo-400",
    headerBg: "bg-indigo-400",
    textColor: "text-indigo-900",
  },
  external: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    headerBg: "bg-gray-400",
    textColor: "text-gray-900",
  },
  monitoring: {
    bg: "bg-rose-100",
    border: "border-rose-400",
    headerBg: "bg-rose-400",
    textColor: "text-rose-900",
  },
};

export const CATEGORY_ICONS: Record<ArchitectureCategory, string> = {
  user: "👤",
  frontend: "🖥",
  backend: "⚙️",
  infrastructure: "☁️",
  database: "🗄️",
  messaging: "📨",
  storage: "📦",
  ai: "🤖",
  external: "🔗",
  monitoring: "📊",
};
