import {
  ArchitectureNode,
} from "./architecture-node";
import { UserNode } from "./user-node";
import { WebAppNode } from "./webapp-node";
import { MobileAppNode } from "./mobileapp-node";
import { APIGatewayNode } from "./apigateway-node";
import { BackendNode } from "./backend-node";
import { DatabaseNode } from "./database-node";
import { CacheNode } from "./cache-node";
import { StorageNode } from "./storage-node";
import { LoadBalancerNode } from "./loadbalancer-node";
import { AIServiceNode } from "./aiservice-node";

export type NodeTypeId =
  | "architecture"
  | "user"
  | "webapp"
  | "mobileapp"
  | "apigateway"
  | "backend"
  | "database"
  | "cache"
  | "storage"
  | "loadbalancer"
  | "aiservice";

/* ── React Flow nodeTypes registry ── */

export const NODE_TYPES = {
  architecture: ArchitectureNode,
  user: UserNode,
  webapp: WebAppNode,
  mobileapp: MobileAppNode,
  apigateway: APIGatewayNode,
  backend: BackendNode,
  database: DatabaseNode,
  cache: CacheNode,
  storage: StorageNode,
  loadbalancer: LoadBalancerNode,
  aiservice: AIServiceNode,
} satisfies Record<string, unknown>;

/* ── Sidebar item name → node type mapping ── */

const ITEM_TO_NODE_TYPE: Record<string, NodeTypeId> = {
  // Users
  "End User": "user",
  Admin: "user",
  "External User": "user",
  // Frontend
  "Web App": "webapp",
  "Mobile App": "mobileapp",
  "Desktop App": "webapp",
  "Admin Dashboard": "webapp",
  // API & Access
  "API Gateway": "apigateway",
  "Reverse Proxy": "apigateway",
  // Backend / Application
  "Backend Service": "backend",
  Microservice: "backend",
  "Application Server": "backend",
  "Auth Service": "backend",
  "Notification Svc": "backend",
  "Payment Service": "backend",
  "Chat Service": "backend",
  "WebSocket Server": "backend",
  "Search Engine": "backend",
  "Stream Processor": "backend",
  // Infrastructure
  "Load Balancer": "loadbalancer",
  Server: "backend",
  VM: "backend",
  Container: "backend",
  // Database
  "SQL Database": "database",
  "NoSQL Database": "database",
  "Relational DB": "database",
  "Document DB": "database",
  // Cache
  "Cache (Redis)": "cache",
  "In-Memory Cache": "cache",
  // Storage
  "Object Storage": "storage",
  "File Storage": "storage",
  "Cloud Storage": "storage",
  // Messaging (no dedicated type → backend)
  "Message Queue": "backend",
  "Event Bus": "backend",
  "Pub/Sub": "backend",
  // AI
  "AI Service": "aiservice",
  "LLM Service": "aiservice",
  "Recommendation Engine": "aiservice",
  "RAG Pipeline": "aiservice",
  "Vector Database": "aiservice",
  // External (no dedicated type → architecture fallback)
  "Payment Gateway": "architecture",
  "Email Service": "architecture",
  "SMS Service": "architecture",
  "Third-Party API": "architecture",
  // Monitoring (no dedicated type → architecture fallback)
  Logging: "architecture",
  Monitoring: "architecture",
  Analytics: "architecture",
};

/* ── Category + label → node type (for AI generation) ── */

const CATEGORY_TO_NODE_TYPE: Record<string, NodeTypeId> = {
  user: "user",
  frontend: "webapp",
  backend: "backend",
  infrastructure: "apigateway",
  database: "database",
  storage: "storage",
  ai: "aiservice",
  messaging: "backend",
};

export function getNodeTypeForItem(itemName: string): NodeTypeId {
  return ITEM_TO_NODE_TYPE[itemName] ?? "architecture";
}

export function getNodeTypeForCategory(
  category: string,
  label: string,
): NodeTypeId {
  // Check specific item match first
  const byItem = ITEM_TO_NODE_TYPE[label];
  if (byItem) return byItem;
  // Fall back to category mapping
  return CATEGORY_TO_NODE_TYPE[category] ?? "architecture";
}
