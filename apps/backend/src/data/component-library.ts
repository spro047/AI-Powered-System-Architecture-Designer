/**
 * Static component library — the canonical list of architecture component types.
 * Sourced from the PRD (project-overview.md).
 * Served at GET /api/components.
 */

export interface ComponentLibraryEntry {
  type: string;
  label: string;
  category: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  color?: string;
}

type CategoryGroup = {
  category: string;
  items: ComponentLibraryEntry[];
};

const library: CategoryGroup[] = [
  {
    category: "Client",
    items: [
      { type: "User", label: "User", category: "Client", description: "End user interacting with the system", defaultWidth: 160, defaultHeight: 120, color: "#6366f1" },
      { type: "Customer", label: "Customer", category: "Client", description: "Paying customer or subscriber", defaultWidth: 160, defaultHeight: 120, color: "#6366f1" },
      { type: "Admin", label: "Admin", category: "Client", description: "System administrator user", defaultWidth: 160, defaultHeight: 120, color: "#6366f1" },
      { type: "ExternalUser", label: "External User", category: "Client", description: "Third-party or external system user", defaultWidth: 160, defaultHeight: 120, color: "#6366f1" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { type: "WebApp", label: "Web App", category: "Frontend", description: "Browser-based web application", defaultWidth: 200, defaultHeight: 140, color: "#06b6d4" },
      { type: "MobileApp", label: "Mobile App", category: "Frontend", description: "Native or cross-platform mobile application", defaultWidth: 200, defaultHeight: 140, color: "#06b6d4" },
      { type: "DesktopApp", label: "Desktop App", category: "Frontend", description: "Native desktop application", defaultWidth: 200, defaultHeight: 140, color: "#06b6d4" },
      { type: "AdminDashboard", label: "Admin Dashboard", category: "Frontend", description: "Administrative web interface", defaultWidth: 200, defaultHeight: 140, color: "#06b6d4" },
    ],
  },
  {
    category: "API & Access",
    items: [
      { type: "APIGateway", label: "API Gateway", category: "API & Access", description: "Single entry point for API requests", defaultWidth: 200, defaultHeight: 120, color: "#f59e0b" },
      { type: "ReverseProxy", label: "Reverse Proxy", category: "API & Access", description: "Proxies client requests to backend services", defaultWidth: 200, defaultHeight: 120, color: "#f59e0b" },
      { type: "AuthService", label: "Auth Service", category: "API & Access", description: "Authentication and authorization service", defaultWidth: 200, defaultHeight: 120, color: "#f59e0b" },
    ],
  },
  {
    category: "Application",
    items: [
      { type: "BackendService", label: "Backend Service", category: "Application", description: "Core backend processing service", defaultWidth: 200, defaultHeight: 140, color: "#10b981" },
      { type: "ApplicationServer", label: "Application Server", category: "Application", description: "Application server hosting business logic", defaultWidth: 200, defaultHeight: 140, color: "#10b981" },
      { type: "Microservice", label: "Microservice", category: "Application", description: "Independent, deployable microservice", defaultWidth: 200, defaultHeight: 140, color: "#10b981" },
      { type: "Notification", label: "Notification Service", category: "Application", description: "Push, email, and in-app notification delivery", defaultWidth: 200, defaultHeight: 140, color: "#10b981" },
      { type: "Payment", label: "Payment Service", category: "Application", description: "Payment processing and billing", defaultWidth: 200, defaultHeight: 140, color: "#10b981" },
    ],
  },
  {
    category: "Database",
    items: [
      { type: "SQL", label: "SQL Database", category: "Database", description: "Relational database (PostgreSQL, MySQL, etc.)", defaultWidth: 200, defaultHeight: 130, color: "#ef4444" },
      { type: "NoSQL", label: "NoSQL Database", category: "Database", description: "Document or key-value NoSQL database", defaultWidth: 200, defaultHeight: 130, color: "#ef4444" },
      { type: "Relational", label: "Relational DB", category: "Database", description: "Relational database system", defaultWidth: 200, defaultHeight: 130, color: "#ef4444" },
      { type: "Document", label: "Document DB", category: "Database", description: "Document-oriented database (MongoDB, etc.)", defaultWidth: 200, defaultHeight: 130, color: "#ef4444" },
    ],
  },
  {
    category: "Cache",
    items: [
      { type: "Redis", label: "Redis", category: "Cache", description: "In-memory cache and message broker", defaultWidth: 160, defaultHeight: 110, color: "#f97316" },
      { type: "InMemory", label: "In-Memory Cache", category: "Cache", description: "Application-level in-memory cache", defaultWidth: 160, defaultHeight: 110, color: "#f97316" },
    ],
  },
  {
    category: "Messaging",
    items: [
      { type: "MessageQueue", label: "Message Queue", category: "Messaging", description: "Message queue for async processing (RabbitMQ, SQS)", defaultWidth: 200, defaultHeight: 120, color: "#8b5cf6" },
      { type: "EventBus", label: "Event Bus", category: "Messaging", description: "Event streaming platform (Kafka, EventBridge)", defaultWidth: 200, defaultHeight: 120, color: "#8b5cf6" },
      { type: "PubSub", label: "Pub/Sub", category: "Messaging", description: "Publish-subscribe messaging system", defaultWidth: 200, defaultHeight: 120, color: "#8b5cf6" },
    ],
  },
  {
    category: "Storage",
    items: [
      { type: "Object", label: "Object Storage", category: "Storage", description: "Object storage (S3, GCS, Blob)", defaultWidth: 180, defaultHeight: 110, color: "#84cc16" },
      { type: "File", label: "File Storage", category: "Storage", description: "File system storage", defaultWidth: 180, defaultHeight: 110, color: "#84cc16" },
      { type: "Cloud", label: "Cloud Storage", category: "Storage", description: "Cloud-based storage solution", defaultWidth: 180, defaultHeight: 110, color: "#84cc16" },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      { type: "LoadBalancer", label: "Load Balancer", category: "Infrastructure", description: "Distributes traffic across multiple servers", defaultWidth: 200, defaultHeight: 110, color: "#64748b" },
      { type: "CDN", label: "CDN", category: "Infrastructure", description: "Content delivery network", defaultWidth: 160, defaultHeight: 110, color: "#64748b" },
      { type: "Server", label: "Server", category: "Infrastructure", description: "Compute server (VM or bare metal)", defaultWidth: 160, defaultHeight: 110, color: "#64748b" },
      { type: "VM", label: "Virtual Machine", category: "Infrastructure", description: "Virtualized compute instance", defaultWidth: 160, defaultHeight: 110, color: "#64748b" },
      { type: "Container", label: "Container", category: "Infrastructure", description: "Containerized application (Docker)", defaultWidth: 160, defaultHeight: 110, color: "#64748b" },
    ],
  },
  {
    category: "External",
    items: [
      { type: "PaymentGateway", label: "Payment Gateway", category: "External", description: "Third-party payment processor (Stripe, PayPal)", defaultWidth: 200, defaultHeight: 110, color: "#e11d48" },
      { type: "Email", label: "Email Service", category: "External", description: "Email delivery service (SendGrid, SES)", defaultWidth: 180, defaultHeight: 110, color: "#e11d48" },
      { type: "SMS", label: "SMS Service", category: "External", description: "SMS notification service (Twilio)", defaultWidth: 180, defaultHeight: 110, color: "#e11d48" },
      { type: "ThirdPartyAPI", label: "Third-Party API", category: "External", description: "External API integration", defaultWidth: 200, defaultHeight: 110, color: "#e11d48" },
    ],
  },
  {
    category: "AI",
    items: [
      { type: "AIService", label: "AI Service", category: "AI", description: "AI-powered processing service", defaultWidth: 200, defaultHeight: 130, color: "#a855f7" },
      { type: "LLM", label: "LLM", category: "AI", description: "Large language model service", defaultWidth: 180, defaultHeight: 130, color: "#a855f7" },
      { type: "RecommendationEngine", label: "Recommendation Engine", category: "AI", description: "AI recommendation and personalization", defaultWidth: 200, defaultHeight: 130, color: "#a855f7" },
      { type: "RAG", label: "RAG Pipeline", category: "AI", description: "Retrieval-augmented generation pipeline", defaultWidth: 180, defaultHeight: 130, color: "#a855f7" },
      { type: "VectorDatabase", label: "Vector Database", category: "AI", description: "Vector database for embeddings (Pinecone, Weaviate)", defaultWidth: 200, defaultHeight: 130, color: "#a855f7" },
    ],
  },
  {
    category: "Monitoring",
    items: [
      { type: "Logging", label: "Logging Service", category: "Monitoring", description: "Centralized log aggregation", defaultWidth: 180, defaultHeight: 110, color: "#78716c" },
      { type: "Monitoring", label: "Monitoring", category: "Monitoring", description: "System monitoring and alerting", defaultWidth: 180, defaultHeight: 110, color: "#78716c" },
      { type: "Analytics", label: "Analytics", category: "Monitoring", description: "Usage analytics and reporting", defaultWidth: 180, defaultHeight: 110, color: "#78716c" },
    ],
  },
];

export function getComponentLibrary(): CategoryGroup[] {
  return library;
}

export function getFlatComponentList(): ComponentLibraryEntry[] {
  return library.flatMap((g) => g.items);
}

export function getComponentByType(type: string): ComponentLibraryEntry | undefined {
  return getFlatComponentList().find((c) => c.type === type);
}
