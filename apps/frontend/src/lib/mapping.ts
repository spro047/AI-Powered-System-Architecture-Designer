/**
 * Converts between React Flow nodes/edges and the backend's
 * component/connection format so the canvas state can be
 * persisted and restored faithfully.
 */

import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData, ArchitectureCategory } from "@/components/nodes/types";
import type { BackendComponent, BackendConnection, ArchitectureExplanation } from "./api";
import { getNodeTypeForItem } from "@/components/nodes/node-registry";
import { CATEGORY_ICONS } from "@/components/nodes/types";

/* ── Frontend label → Backend type lookup ──
 * The frontend sidebar uses display labels ("Web App", "API Gateway")
 * while the backend stores machine types ("WebApp", "APIGateway").
 */

const DISPLAY_TO_TYPE: Record<string, string> = {
  "User": "User",
  "Customer": "Customer",
  "Admin": "Admin",
  "External User": "ExternalUser",
  "Web App": "WebApp",
  "Mobile App": "MobileApp",
  "Desktop App": "DesktopApp",
  "Admin Dashboard": "AdminDashboard",
  "API Gateway": "APIGateway",
  "Reverse Proxy": "ReverseProxy",
  "Auth Service": "AuthService",
  "Backend Service": "BackendService",
  "Application Server": "ApplicationServer",
  "Microservice": "Microservice",
  "Notification Svc": "Notification",
  "Payment Service": "Payment",
  "SQL Database": "SQL",
  "NoSQL Database": "NoSQL",
  "Relational DB": "Relational",
  "Document DB": "Document",
  "Cache (Redis)": "Redis",
  "In-Memory Cache": "InMemory",
  "Object Storage": "Object",
  "File Storage": "File",
  "Cloud Storage": "Cloud",
  "Message Queue": "MessageQueue",
  "Event Bus": "EventBus",
  "Pub/Sub": "PubSub",
  "Load Balancer": "LoadBalancer",
  "CDN": "CDN",
  "Server": "Server",
  "VM": "VM",
  "Container": "Container",
  "Payment Gateway": "PaymentGateway",
  "Email Service": "Email",
  "SMS Service": "SMS",
  "Third-Party API": "ThirdPartyAPI",
  "AI Service": "AIService",
  "LLM Service": "LLM",
  "Recommendation Engine": "RecommendationEngine",
  "RAG Pipeline": "RAG",
  "Vector Database": "VectorDatabase",
  "Logging": "Logging",
  "Monitoring": "Monitoring",
  "Analytics": "Analytics",
  "End User": "User",
  "Search Engine": "BackendService",
  "Stream Processor": "Microservice",
  "WebSocket Server": "Microservice",
  "Chat Service": "BackendService",
  "Event Producer": "Microservice",
  "Event Consumer": "Microservice",
  "Cache": "Redis",
};

/* Backend type → Frontend label (reverse) */
const TYPE_TO_DISPLAY: Record<string, string> = {};
for (const [display, type] of Object.entries(DISPLAY_TO_TYPE)) {
  TYPE_TO_DISPLAY[type] = display;
}

/* ── Backend type → Frontend category ── */
export const TYPE_TO_CATEGORY: Record<string, ArchitectureCategory> = {
  User: "user",
  Customer: "user",
  Admin: "user",
  ExternalUser: "user",
  WebApp: "frontend",
  MobileApp: "frontend",
  DesktopApp: "frontend",
  AdminDashboard: "frontend",
  APIGateway: "infrastructure",
  ReverseProxy: "infrastructure",
  AuthService: "backend",
  BackendService: "backend",
  ApplicationServer: "backend",
  Microservice: "backend",
  Notification: "backend",
  Payment: "backend",
  SQL: "database",
  NoSQL: "database",
  Relational: "database",
  Document: "database",
  Redis: "database",
  InMemory: "database",
  Object: "storage",
  File: "storage",
  Cloud: "storage",
  MessageQueue: "messaging",
  EventBus: "messaging",
  PubSub: "messaging",
  LoadBalancer: "infrastructure",
  CDN: "infrastructure",
  Server: "infrastructure",
  VM: "infrastructure",
  Container: "infrastructure",
  PaymentGateway: "external",
  Email: "external",
  SMS: "external",
  ThirdPartyAPI: "external",
  AIService: "ai",
  LLM: "ai",
  RecommendationEngine: "ai",
  RAG: "ai",
  VectorDatabase: "ai",
  Logging: "monitoring",
  Monitoring: "monitoring",
  Analytics: "monitoring",
};

/* ── Public API ── */

/**
 * Convert a React Flow node to the backend's component format.
 */
export function nodeToComponent(node: Node<ArchitectureNodeData>): BackendComponent {
  const label = node.data.label;
  const type = DISPLAY_TO_TYPE[label]
    ?? TYPE_TO_DISPLAY[label]
    ?? label.replace(/\s+/g, "");

  return {
    id: node.id,
    label,
    type,
    description: node.data.description ?? null,
    x: Math.round(node.position.x),
    y: Math.round(node.position.y),
    width: Math.round((node as any).width ?? 200),
    height: Math.round((node as any).height ?? 120),
    metadata: {
      category: node.data.category,
      icon: node.data.icon,
      technology: node.data.technology ?? null,
    },
  };
}

/**
 * Convert a backend component back into a React Flow node.
 */
export function componentToNode(comp: BackendComponent): Node<ArchitectureNodeData> {
  const category =
    (comp.metadata?.category as ArchitectureCategory)
    ?? TYPE_TO_CATEGORY[comp.type]
    ?? "backend";

  const label = TYPE_TO_DISPLAY[comp.type] ?? comp.label;

  const nodeData: ArchitectureNodeData = {
    label,
    category,
    icon: (comp.metadata?.icon as string) ?? CATEGORY_ICONS[category] ?? "⚙️",
    technology: (comp.metadata?.technology as string) ?? undefined,
    description: comp.description ?? undefined,
  };

  const mappedType = getNodeTypeForItem(label);

  return {
    id: comp.id,
    type: mappedType,
    position: { x: comp.x, y: comp.y },
    data: nodeData,
    width: comp.width,
    height: comp.height,
  };
}

/**
 * Convert a React Flow edge to the backend's connection format.
 */
export function edgeToConnection(edge: Edge): BackendConnection {
  return {
    id: edge.id,
    label: typeof edge.label === "string" ? edge.label : null,
    type: edge.type ?? "default",
    sourceId: edge.source,
    targetId: edge.target,
  };
}

/**
 * Convert a backend connection back into a React Flow edge.
 */
export function connectionToEdge(conn: BackendConnection): Edge {
  return {
    id: conn.id,
    source: conn.sourceId,
    target: conn.targetId,
    type: conn.type ?? "default",
    label: conn.label ?? undefined,
    animated: true,
    style: { stroke: "#1A1A1A", strokeWidth: 3 },
  };
}

/**
 * Build a save-canvas payload from the current nodes and edges.
 */
export function buildCanvasPayload(
  title: string | undefined,
  description: string | null | undefined,
  pattern: string | null | undefined,
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
  explanation?: ArchitectureExplanation,
) {
  return {
    title,
    ...(description !== undefined ? { description: description ?? undefined } : {}),
    ...(pattern !== undefined ? { pattern: pattern ?? undefined } : {}),
    components: nodes.map(nodeToComponent),
    connections: edges.map(edgeToConnection),
    ...(explanation !== undefined ? { explanation } : {}),
  };
}

/**
 * Build nodes and edges from a loaded project's components and connections.
 */
export function projectToCanvas(
  components: BackendComponent[],
  connections: BackendConnection[],
): { nodes: Node<ArchitectureNodeData>[]; edges: Edge[] } {
  return {
    nodes: components.map(componentToNode),
    edges: connections.map(connectionToEdge),
  };
}
