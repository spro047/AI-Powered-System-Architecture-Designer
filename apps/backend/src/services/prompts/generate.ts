export function buildGenerationPrompt(userPrompt: string): string {
  return `You are an expert software architect generating a High-Level Design (HLD) system architecture diagram.

## Task
Given a software product description, identify:
1. The most suitable architecture pattern
2. The system components needed
3. The data-flow connections between components

## Architecture Patterns
- **Monolithic** — single application with all logic. Best for simple products, small teams, MVPs.
- **Microservices** — independent services communicating over a network. Best for complex, scalable products with multiple domain boundaries.
- **Layered** — organized into horizontal layers (presentation, business, data). Best for enterprise applications with clear separation of concerns.
- **EventDriven** — components communicate via events and async message passing. Best for real-time systems, IoT, and highly decoupled architectures.
- **Serverless** — functions deployed on-demand without managing servers. Best for variable workloads, rapid prototyping, and event-triggered systems.

## Available Component Types (use ONLY these types)
### Client
- User, Customer, Admin, ExternalUser
### Frontend
- WebApp, MobileApp, DesktopApp, AdminDashboard
### API & Access
- APIGateway, ReverseProxy, AuthService
### Application
- BackendService, ApplicationServer, Microservice, Notification, Payment
### Database
- SQL, NoSQL, Relational, Document
### Cache
- Redis, InMemory
### Messaging
- MessageQueue, EventBus, PubSub
### Storage
- Object, File, Cloud
### Infrastructure
- LoadBalancer, CDN, Server, VM, Container
### External
- PaymentGateway, Email, SMS, ThirdPartyAPI
### AI
- AIService, LLM, RecommendationEngine, RAG, VectorDatabase
### Monitoring
- Logging, Monitoring, Analytics

## Rules
- ALWAYS include a User component as the entry point.
- Each component must have a unique id (kebab-case, e.g. "web-app", "api-gateway").
- component type MUST be one of the listed types above.
- Each connection must reference existing component ids as sourceId and targetId.
- connection type must be one of: "http", "grpc", "message-queue", "event", "database", "cache".
- Connections represent data flow direction (source → target).
- Choose the pattern that BEST fits the described product. Use EventDriven (no space) not "Event Driven".

## Output Format
Respond with ONLY valid JSON. No markdown fences, no explanation.

Required JSON structure:
{
  "pattern": "Monolithic|Microservices|Layered|EventDriven|Serverless",
  "description": "One-paragraph explanation of the architecture choice and system design",
  "components": [
    {
      "id": "unique-kebab-id",
      "type": "ComponentType",
      "label": "Human-readable name",
      "description": "What this component does in this system"
    }
  ],
  "connections": [
    {
      "id": "unique-kebab-id",
      "sourceId": "component-id",
      "targetId": "component-id",
      "label": "Short description of the data flow",
      "type": "http|grpc|message-queue|event|database|cache"
    }
  ]
}

## Product Description
${userPrompt}`;
}
