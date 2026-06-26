import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type {
  ArchitectureCategory,
  ArchitectureNodeData,
} from "@/components/nodes/types";
import { CATEGORY_ICONS } from "@/components/nodes/types";
import { getNodeTypeForCategory } from "@/components/nodes/node-registry";

/* ── Architecture Patterns ── */

export type ArchitecturePattern =
  | "monolithic"
  | "microservices"
  | "event-driven"
  | "serverless"
  | "layered";

interface PatternTemplate {
  label: ArchitecturePattern;
  description: string;
  stages: string[];
  baseComponents: ComponentSpec[];
}

interface ComponentSpec {
  label: string;
  category: ArchitectureCategory;
  technology: string;
  dependsOn: string[]; // component labels this connects from
}

const PATTERN_TEMPLATES: Record<ArchitecturePattern, PatternTemplate> = {
  monolithic: {
    label: "monolithic",
    description: "Single unified codebase deployed as one unit",
    stages: [
      "Analyzing Requirements",
      "Selecting Architecture Pattern",
      "Identifying Components",
      "Placing on Canvas",
    ],
    baseComponents: [
      { label: "User", category: "user", technology: "Browser", dependsOn: [] },
      { label: "Web App", category: "frontend", technology: "React", dependsOn: ["User"] },
      { label: "Monolith Server", category: "backend", technology: "Node.js", dependsOn: ["Web App"] },
      { label: "Primary Database", category: "database", technology: "PostgreSQL", dependsOn: ["Monolith Server"] },
    ],
  },
  microservices: {
    label: "microservices",
    description: "Independent services communicating via API Gateway",
    stages: [
      "Analyzing Requirements",
      "Selecting Architecture Pattern",
      "Identifying Components",
      "Placing on Canvas",
    ],
    baseComponents: [
      { label: "User", category: "user", technology: "Browser", dependsOn: [] },
      { label: "Web App", category: "frontend", technology: "Next.js", dependsOn: ["User"] },
      { label: "API Gateway", category: "infrastructure", technology: "Kong", dependsOn: ["Web App"] },
      { label: "Auth Service", category: "backend", technology: "JWT", dependsOn: ["API Gateway"] },
      { label: "Main Service", category: "backend", technology: "Node.js", dependsOn: ["API Gateway"] },
      { label: "Message Queue", category: "messaging", technology: "RabbitMQ", dependsOn: ["Main Service"] },
      { label: "Worker Service", category: "backend", technology: "Python", dependsOn: ["Message Queue"] },
      { label: "Database", category: "database", technology: "PostgreSQL", dependsOn: ["Main Service"] },
    ],
  },
  "event-driven": {
    label: "event-driven",
    description: "Decoupled services communicating via events",
    stages: [
      "Analyzing Requirements",
      "Selecting Architecture Pattern",
      "Identifying Components",
      "Placing on Canvas",
    ],
    baseComponents: [
      { label: "User", category: "user", technology: "Browser", dependsOn: [] },
      { label: "Web App", category: "frontend", technology: "React", dependsOn: ["User"] },
      { label: "Event Bus", category: "messaging", technology: "Kafka", dependsOn: ["Web App"] },
      { label: "Event Producer", category: "backend", technology: "Node.js", dependsOn: ["Event Bus"] },
      { label: "Event Consumer", category: "backend", technology: "Python", dependsOn: ["Event Bus"] },
      { label: "Database", category: "database", technology: "PostgreSQL", dependsOn: ["Event Consumer"] },
      { label: "Analytics Svc", category: "monitoring", technology: "Elasticsearch", dependsOn: ["Event Bus"] },
    ],
  },
  serverless: {
    label: "serverless",
    description: "Cloud functions + managed services, no server management",
    stages: [
      "Analyzing Requirements",
      "Selecting Architecture Pattern",
      "Identifying Components",
      "Placing on Canvas",
    ],
    baseComponents: [
      { label: "User", category: "user", technology: "Browser", dependsOn: [] },
      { label: "Static Site", category: "frontend", technology: "Vercel", dependsOn: ["User"] },
      { label: "Function Gateway", category: "infrastructure", technology: "AWS API Gateway", dependsOn: ["Static Site"] },
      { label: "Auth Function", category: "backend", technology: "Lambda", dependsOn: ["Function Gateway"] },
      { label: "Business Logic", category: "backend", technology: "Lambda", dependsOn: ["Function Gateway"] },
      { label: "Database", category: "database", technology: "DynamoDB", dependsOn: ["Business Logic"] },
      { label: "Object Storage", category: "storage", technology: "S3", dependsOn: ["Business Logic"] },
    ],
  },
  layered: {
    label: "layered",
    description: "Strict separation into presentation, business, and data layers",
    stages: [
      "Analyzing Requirements",
      "Selecting Architecture Pattern",
      "Identifying Components",
      "Placing on Canvas",
    ],
    baseComponents: [
      { label: "User", category: "user", technology: "Browser", dependsOn: [] },
      { label: "Presentation Layer", category: "frontend", technology: "React", dependsOn: ["User"] },
      { label: "API Gateway", category: "infrastructure", technology: "Nginx", dependsOn: ["Presentation Layer"] },
      { label: "Business Layer", category: "backend", technology: "Node.js", dependsOn: ["API Gateway"] },
      { label: "Persistence Layer", category: "database", technology: "PostgreSQL", dependsOn: ["Business Layer"] },
      { label: "Cache Layer", category: "database", technology: "Redis", dependsOn: ["Business Layer"] },
    ],
  },
};

/* ── Keyword-based feature analysis ── */

interface FeatureMatch {
  keyword: string;
  addComponents: ComponentSpec[];
}

const FEATURE_MAP: FeatureMatch[] = [
  {
    keyword: "payment",
    addComponents: [
      { label: "Payment Service", category: "backend", technology: "Stripe", dependsOn: [] },
    ],
  },
  {
    keyword: "notification",
    addComponents: [
      { label: "Notification Svc", category: "backend", technology: "SendGrid", dependsOn: [] },
    ],
  },
  {
    keyword: "email",
    addComponents: [
      { label: "Notification Svc", category: "backend", technology: "SendGrid", dependsOn: [] },
    ],
  },
  {
    keyword: "chat",
    addComponents: [
      { label: "Chat Service", category: "backend", technology: "WebSocket", dependsOn: [] },
    ],
  },
  {
    keyword: "realtime",
    addComponents: [
      { label: "WebSocket Server", category: "backend", technology: "Socket.io", dependsOn: [] },
    ],
  },
  {
    keyword: "ai",
    addComponents: [
      { label: "AI Service", category: "ai", technology: "LLM", dependsOn: [] },
    ],
  },
  {
    keyword: "ml",
    addComponents: [
      { label: "AI Service", category: "ai", technology: "LLM", dependsOn: [] },
    ],
  },
  {
    keyword: "recommend",
    addComponents: [
      { label: "AI Service", category: "ai", technology: "LLM", dependsOn: [] },
    ],
  },
  {
    keyword: "cache",
    addComponents: [
      { label: "Cache", category: "database", technology: "Redis", dependsOn: [] },
    ],
  },
  {
    keyword: "redis",
    addComponents: [
      { label: "Cache", category: "database", technology: "Redis", dependsOn: [] },
    ],
  },
  {
    keyword: "analytics",
    addComponents: [
      { label: "Analytics", category: "monitoring", technology: "Elasticsearch", dependsOn: [] },
    ],
  },
  {
    keyword: "logging",
    addComponents: [
      { label: "Logging", category: "monitoring", technology: "ELK Stack", dependsOn: [] },
    ],
  },
  {
    keyword: "search",
    addComponents: [
      { label: "Search Engine", category: "backend", technology: "Elasticsearch", dependsOn: [] },
    ],
  },
  {
    keyword: "cdn",
    addComponents: [
      { label: "CDN", category: "infrastructure", technology: "CloudFront", dependsOn: [] },
    ],
  },
  {
    keyword: "queue",
    addComponents: [
      { label: "Message Queue", category: "messaging", technology: "RabbitMQ", dependsOn: [] },
    ],
  },
  {
    keyword: "image",
    addComponents: [
      { label: "Object Storage", category: "storage", technology: "S3", dependsOn: [] },
    ],
  },
  {
    keyword: "upload",
    addComponents: [
      { label: "Object Storage", category: "storage", technology: "S3", dependsOn: [] },
    ],
  },
  {
    keyword: "stream",
    addComponents: [
      { label: "Stream Processor", category: "backend", technology: "Kafka Streams", dependsOn: [] },
    ],
  },
  {
    keyword: "mobile",
    addComponents: [
      { label: "Mobile App", category: "frontend", technology: "React Native", dependsOn: [] },
    ],
  },
  {
    keyword: "auth",
    addComponents: [
      { label: "Auth Service", category: "backend", technology: "JWT", dependsOn: [] },
    ],
  },
  {
    keyword: "login",
    addComponents: [
      { label: "Auth Service", category: "backend", technology: "JWT", dependsOn: [] },
    ],
  },
  {
    keyword: "nosql",
    addComponents: [
      { label: "NoSQL Database", category: "database", technology: "MongoDB", dependsOn: [] },
    ],
  },
];

/* ── Technology suggestion map ── */

function suggestTechnology(category: ArchitectureCategory, label: string): string {
  const techMap: Partial<Record<ArchitectureCategory, string[]>> = {
    user: ["Browser", "Mobile Device"],
    frontend: ["React", "Next.js", "Vue", "Angular", "Svelte"],
    backend: ["Node.js", "Python", "Go", "Java", "Rust"],
    database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "DynamoDB"],
    infrastructure: ["Docker", "Kubernetes", "Nginx", "AWS", "GCP"],
    messaging: ["Kafka", "RabbitMQ", "SQS", "Pub/Sub"],
    storage: ["S3", "GCS", "MinIO", "Cloud Storage"],
    ai: ["OpenAI", "Ollama", "DeepSeek", "Llama"],
    external: ["Stripe", "SendGrid", "Twilio"],
    monitoring: ["Prometheus", "Grafana", "ELK", "Datadog"],
  };

  const options = techMap[category];
  if (!options || options.length === 0) return "";

  // Stable hash-based selection so same label gets same tech
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }
  return options[Math.abs(hash) % options.length] ?? options[0]!;
}

/* ── Pattern detection ── */

function detectPattern(prompt: string): ArchitecturePattern {
  const lower = prompt.toLowerCase();

  if (lower.includes("microservice") || lower.includes("micro-service")) return "microservices";
  if (lower.includes("event") || lower.includes("kafka") || lower.includes("stream"))
    return "event-driven";
  if (lower.includes("serverless") || lower.includes("lambda"))
    return "serverless";
  if (lower.includes("layered") || lower.includes("n-tier") || lower.includes("n tier"))
    return "layered";
  if (lower.includes("monolith") || lower.includes("simple") || lower.includes("small"))
    return "monolithic";

  // Default: choose based on perceived complexity
  const complexityIndicators = [
    "scale", "distributed", "complex", "large", "enterprise",
    "multiple", "service", "api", "many", "platform",
  ];
  const complexityScore = complexityIndicators.filter((w) => lower.includes(w)).length;
  return complexityScore >= 3 ? "microservices" : "layered";
}

import { TYPE_TO_CATEGORY } from "./mapping";

export interface BackendArchitectureResult {
  pattern: string;
  description: string;
  components: { id: string; type: string; label: string; description: string }[];
  connections: { id: string; sourceId: string; targetId: string; label: string; type: string }[];
}

export async function generateArchitectureFromBackend(prompt: string): Promise<BackendArchitectureResult & { suggestions: string[] }> {
  const res = await fetch("/api/architecture/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? json.details?.[0]?.message ?? "Architecture generation failed");
  }

  return { ...json.data, suggestions: [] };
}

function backendTypeToCategory(type: string): ArchitectureCategory {
  return (TYPE_TO_CATEGORY as Record<string, ArchitectureCategory>)[type] ?? "backend";
}

/**
 * Distribute edges across all 4 node handles so connections aren't
 * always on top/bottom.  Source alternates between "bottom" and "right";
 * target alternates between "top" and "left".  Each node's outgoing and
 * incoming edges are staggered independently.
 */
const SOURCE_HANDLES = ["bottom", "right"] as const;
const TARGET_HANDLES = ["top", "left"] as const;

function distributeHandles(edges: Edge[]): Edge[] {
  const srcCount = new Map<string, number>();
  const tgtCount = new Map<string, number>();

  return edges.map((e) => {
    const si = (srcCount.get(e.source) ?? 0) % SOURCE_HANDLES.length;
    srcCount.set(e.source, (srcCount.get(e.source) ?? 0) + 1);

    const ti = (tgtCount.get(e.target) ?? 0) % TARGET_HANDLES.length;
    tgtCount.set(e.target, (tgtCount.get(e.target) ?? 0) + 1);

    return {
      ...e,
      sourceHandle: SOURCE_HANDLES[si],
      targetHandle: TARGET_HANDLES[ti],
    };
  });
}

export function architectureResultToFlow(
  result: BackendArchitectureResult,
): { nodes: Node<ArchitectureNodeData>[]; edges: Edge[] } {
  const { components, connections } = result;
  const nodes: Node<ArchitectureNodeData>[] = [];
  const edges: Edge[] = [];

  const compById = new Map(components.map((c) => [c.id, c]));

  const cols = Math.min(components.length, 3);
  components.forEach((comp, i) => {
    const category = backendTypeToCategory(comp.type);
    const nodeType = getNodeTypeForCategory(category, comp.label);
    const col = i % cols;
    const row = Math.floor(i / cols);

    nodes.push({
      id: comp.id,
      type: nodeType,
      position: { x: col * 320 + 60, y: row * 240 + 60 },
      data: {
        label: comp.label,
        category,
        icon: CATEGORY_ICONS[category],
        description: comp.description,
      },
    });
  });

  connections.forEach((conn) => {
    if (compById.has(conn.sourceId) && compById.has(conn.targetId)) {
      const isAsync = conn.type === "event" || conn.type === "message-queue";
      const edgeStyle = isAsync
        ? { stroke: "#8b5cf6", strokeWidth: 3, strokeDasharray: "8 4" }
        : { stroke: "#1A1A1A", strokeWidth: 3 };

      edges.push({
        id: conn.id,
        source: conn.sourceId,
        target: conn.targetId,
        label: conn.label || undefined,
        type: "default",
        animated: isAsync,
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeStyle.stroke,
          width: 20,
          height: 20,
        },
      });
    }
  });

  return { nodes, edges: distributeHandles(edges) };
}

/* ── Layout computation ── */

function computeGridPositions(
  components: ComponentSpec[],
  cols: number,
): { x: number; y: number }[] {
  return components.map((_, i) => ({
    x: (i % cols) * 240,
    y: Math.floor(i / cols) * 160,
  }));
}

/* ── Generator result ── */

export interface GenerateResult {
  pattern: ArchitecturePattern;
  components: { label: string; category: ArchitectureCategory; technology: string }[];
  suggestions: string[];
}

/* ── Main generator ── */

export function generateArchitecture(
  prompt: string,
): GenerateResult {
  const lower = prompt.toLowerCase();

  // 1. Detect pattern
  const pattern = detectPattern(prompt);
  const template = PATTERN_TEMPLATES[pattern];

  // 2. Start with template base components
  const componentMap = new Map<string, ComponentSpec>();
  for (const c of template.baseComponents) {
    componentMap.set(c.label, { ...c });
  }

  // 3. Apply feature matches
  const featureComponents: ComponentSpec[] = [];
  for (const feature of FEATURE_MAP) {
    if (lower.includes(feature.keyword)) {
      for (const comp of feature.addComponents) {
        // Avoid duplicates from multiple keyword matches
        if (!featureComponents.some((f) => f.label === comp.label)) {
          featureComponents.push({ ...comp });
        }
        // Also add if not already in template
        if (!componentMap.has(comp.label)) {
          componentMap.set(comp.label, { ...comp });
        }
      }
    }
  }

  // 4. Build final component list (deduped, template first, then features)
  const seen = new Set<string>();
  const allComponents: ComponentSpec[] = [];
  for (const c of template.baseComponents) {
    allComponents.push({ ...c });
    seen.add(c.label);
  }
  for (const c of featureComponents) {
    if (!seen.has(c.label)) {
      allComponents.push({ ...c });
      seen.add(c.label);
    }
  }

  // 5. Assign technology (template has it pre-set; features and suggestions get assigned)
  const finalComponents = allComponents.map((c) => ({
    label: c.label,
    category: c.category,
    technology: c.technology || suggestTechnology(c.category, c.label),
  }));

  // 6. Generate improvement suggestions
  const suggestions = generateSuggestions(prompt, pattern, finalComponents);

  return {
    pattern,
    components: finalComponents,
    suggestions,
  };
}

/* ── Suggestions generator ── */

function generateSuggestions(
  prompt: string,
  pattern: ArchitecturePattern,
  components: { label: string; category: ArchitectureCategory; technology: string }[],
): string[] {
  const suggestions: string[] = [];
  const lower = prompt.toLowerCase();
  const categories = new Set(components.map((c) => c.category));

  if (pattern === "monolithic" && lower.includes("scale")) {
    suggestions.push("Consider adopting a Microservices pattern for better scalability");
  }

  if (categories.has("database")) {
    suggestions.push("Consider adding a caching layer (Redis) to improve read performance");
  }

  if (lower.includes("high availability") || lower.includes("reliable")) {
    suggestions.push("Add a Load Balancer to distribute traffic across multiple instances");
    suggestions.push("Configure database replication for failover");
  }

  if (lower.includes("secure") || lower.includes("auth")) {
    if (!components.some((c) => c.label === "Auth Service")) {
      suggestions.push("Ensure all services authenticate via a centralized Auth Service");
    }
  }

  if (lower.includes("payment") && !categories.has("external")) {
    suggestions.push("Use a managed Payment Gateway (Stripe) for PCI-compliant payments");
  }

  return suggestions;
}

/* ── Convert generator result to React Flow nodes + edges ── */

export function generateResultToFlow(
  result: GenerateResult,
): { nodes: Node<ArchitectureNodeData>[]; edges: Edge[] } {
  const { components } = result;
  const nodes: Node<ArchitectureNodeData>[] = [];
  const edges: Edge[] = [];

  const cols = Math.min(components.length, 3);

  // Build connection map: which components connect to which
  // Define semantic flow rules
  const BACKEND_TYPES = new Set<ArchitectureCategory>([
    "backend",
    "infrastructure",
    "messaging",
  ]);
  const DATA_TYPES = new Set<ArchitectureCategory>(["database", "storage"]);
  const USER_TYPES = new Set<ArchitectureCategory>(["user"]);
  const FRONTEND_TYPES = new Set<ArchitectureCategory>(["frontend"]);

  // Find indices by role
  const userIdx = components.findIndex((c) => USER_TYPES.has(c.category));
  const frontendIdx = components.findIndex((c) => FRONTEND_TYPES.has(c.category));
  const apiGatewayIdx = components.findIndex(
    (c) => c.label.includes("Gateway") || c.label.includes("Gateway"),
  );
  const backendIndices = components
    .map((c, i) => (BACKEND_TYPES.has(c.category) ? i : -1))
    .filter((i) => i >= 0);
  const dataIndices = components
    .map((c, i) => (DATA_TYPES.has(c.category) ? i : -1))
    .filter((i) => i >= 0);

  // Generate nodes
  components.forEach((comp, i) => {
    const nodeType = getNodeTypeForCategory(comp.category, comp.label);
    nodes.push({
      id: `gen_${i}`,
      type: nodeType,
      position: { x: 0, y: 0 },
      data: {
        label: comp.label,
        category: comp.category,
        icon: CATEGORY_ICONS[comp.category],
        technology: comp.technology,
        description: `${comp.category} component — ${comp.technology}`,
      },
    });
  });

  // Generate semantic edges
  const addEdge = (fromIdx: number, toIdx: number) => {
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;
    edges.push({
      id: `edge_gen_${fromIdx}_${toIdx}`,
      source: `gen_${fromIdx}`,
      target: `gen_${toIdx}`,
      animated: true,
      style: { stroke: "#1A1A1A", strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#1A1A1A",
        width: 20,
        height: 20,
      },
    });
  };

  // User → Frontend
  if (userIdx >= 0 && frontendIdx >= 0) {
    addEdge(userIdx, frontendIdx);
  }

  // Frontend → API Gateway (or first backend)
  if (frontendIdx >= 0) {
    if (apiGatewayIdx >= 0) {
      addEdge(frontendIdx, apiGatewayIdx);
    } else {
      const firstBackend = backendIndices.find((i) => i >= 0);
      if (firstBackend !== undefined) addEdge(frontendIdx, firstBackend);
    }
  }

  // API Gateway → Backend services
  if (apiGatewayIdx >= 0) {
    for (const bi of backendIndices) {
      if (bi !== apiGatewayIdx) addEdge(apiGatewayIdx, bi);
    }
  }

  // Backend services → Data stores
  let lastBackend = backendIndices[backendIndices.length - 1];
  if (lastBackend === undefined) lastBackend = apiGatewayIdx;
  for (const di of dataIndices) {
    if (lastBackend >= 0) addEdge(lastBackend, di);
  }

  // Backend → Messaging
  const msgIndices = components
    .map((c, i) => (c.category === "messaging" ? i : -1))
    .filter((i) => i >= 0);
  for (const mi of msgIndices) {
    const src = apiGatewayIdx >= 0 ? apiGatewayIdx : lastBackend;
    if (src >= 0) addEdge(src, mi);
  }

  // AI components → Database (AI reads from DB)
  const aiIndices = components
    .map((c, i) => (c.category === "ai" ? i : -1))
    .filter((i) => i >= 0);
  for (const ai of aiIndices) {
    const firstData = dataIndices[0];
    if (firstData !== undefined) addEdge(firstData, ai);
  }

  // Fallback: connect components that aren't connected yet
  const connected = new Set<number>();
  for (const e of edges) {
    connected.add(parseInt(e.source.replace("gen_", ""), 10));
    connected.add(parseInt(e.target.replace("gen_", ""), 10));
  }
  let lastConnected = components.length - 1;
  for (let i = components.length - 1; i >= 0; i--) {
    if (connected.has(i)) {
      lastConnected = i;
      break;
    }
  }
  for (let i = 0; i < components.length; i++) {
    if (!connected.has(i)) {
      if (lastConnected !== i) {
        addEdge(lastConnected, i);
      }
    }
  }

  // Assign positions using grid with even spacing
  components.forEach((_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    nodes[i] = {
      ...nodes[i]!,
      position: {
        x: col * 320 + 60,
        y: row * 240 + 60,
      },
    };
  });

  return { nodes, edges: distributeHandles(edges) };
}
