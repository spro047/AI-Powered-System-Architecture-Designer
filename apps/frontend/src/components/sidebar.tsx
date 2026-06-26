"use client";

import { useState, useCallback } from "react";
import type { ArchitectureCategory } from "@/components/nodes/types";
import { getNodeTypeForItem } from "@/components/nodes/node-registry";

const DND_DATA_KEY = "application/archigen-component";

interface ComponentItem {
  name: string;
  color: string;
  category: ArchitectureCategory;
}

interface ComponentCategory {
  name: string;
  icon: string;
  colorClass: string;
  items: ComponentItem[];
}

const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: "Users",
    icon: "👤",
    colorClass: "cat-user",
    items: [
      { name: "End User", color: "bg-purple-400", category: "user" },
      { name: "Admin", color: "bg-purple-500", category: "user" },
      { name: "External User", color: "bg-purple-300", category: "user" },
    ],
  },
  {
    name: "Frontend",
    icon: "🖥",
    colorClass: "cat-frontend",
    items: [
      { name: "Web App", color: "bg-blue-400", category: "frontend" },
      { name: "Mobile App", color: "bg-blue-500", category: "frontend" },
      { name: "Desktop App", color: "bg-blue-300", category: "frontend" },
      { name: "Admin Dashboard", color: "bg-blue-300", category: "frontend" },
    ],
  },
  {
    name: "Backend",
    icon: "⚙️",
    colorClass: "cat-backend",
    items: [
      { name: "API Gateway", color: "bg-green-400", category: "infrastructure" },
      { name: "Backend Service", color: "bg-green-500", category: "backend" },
      { name: "Microservice", color: "bg-green-300", category: "backend" },
      { name: "Application Server", color: "bg-green-400", category: "backend" },
      { name: "Auth Service", color: "bg-green-600", category: "backend" },
      { name: "Notification Svc", color: "bg-green-400", category: "backend" },
      { name: "Payment Service", color: "bg-green-400", category: "backend" },
    ],
  },
  {
    name: "Infrastructure",
    icon: "☁️",
    colorClass: "cat-infra",
    items: [
      { name: "Load Balancer", color: "bg-orange-400", category: "infrastructure" },
      { name: "CDN", color: "bg-orange-500", category: "infrastructure" },
      { name: "Reverse Proxy", color: "bg-orange-300", category: "infrastructure" },
      { name: "Server", color: "bg-orange-400", category: "infrastructure" },
      { name: "VM", color: "bg-orange-500", category: "infrastructure" },
      { name: "Container", color: "bg-orange-300", category: "infrastructure" },
    ],
  },
  {
    name: "Database",
    icon: "🗄️",
    colorClass: "cat-database",
    items: [
      { name: "SQL Database", color: "bg-cyan-400", category: "database" },
      { name: "NoSQL Database", color: "bg-cyan-500", category: "database" },
      { name: "Relational DB", color: "bg-cyan-400", category: "database" },
      { name: "Document DB", color: "bg-cyan-500", category: "database" },
      { name: "Cache (Redis)", color: "bg-cyan-300", category: "database" },
      { name: "In-Memory Cache", color: "bg-cyan-300", category: "database" },
    ],
  },
  {
    name: "Storage",
    icon: "📦",
    colorClass: "cat-storage",
    items: [
      { name: "Object Storage", color: "bg-amber-400", category: "storage" },
      { name: "File Storage", color: "bg-amber-500", category: "storage" },
      { name: "Cloud Storage", color: "bg-amber-300", category: "storage" },
    ],
  },
  {
    name: "Messaging",
    icon: "📨",
    colorClass: "cat-messaging",
    items: [
      { name: "Message Queue", color: "bg-pink-400", category: "messaging" },
      { name: "Event Bus", color: "bg-pink-500", category: "messaging" },
      { name: "Pub/Sub", color: "bg-pink-300", category: "messaging" },
    ],
  },
  {
    name: "AI",
    icon: "🤖",
    colorClass: "cat-ai",
    items: [
      { name: "AI Service", color: "bg-indigo-400", category: "ai" },
      { name: "LLM Service", color: "bg-indigo-500", category: "ai" },
      { name: "Recommendation Engine", color: "bg-indigo-400", category: "ai" },
      { name: "RAG Pipeline", color: "bg-indigo-500", category: "ai" },
      { name: "Vector Database", color: "bg-indigo-300", category: "ai" },
    ],
  },
  {
    name: "External",
    icon: "🔗",
    colorClass: "cat-external",
    items: [
      { name: "Payment Gateway", color: "bg-gray-400", category: "external" },
      { name: "Email Service", color: "bg-gray-500", category: "external" },
      { name: "SMS Service", color: "bg-gray-300", category: "external" },
      { name: "Third-Party API", color: "bg-gray-400", category: "external" },
    ],
  },
  {
    name: "Monitoring",
    icon: "📊",
    colorClass: "cat-monitoring",
    items: [
      { name: "Logging", color: "bg-rose-400", category: "monitoring" },
      { name: "Monitoring", color: "bg-rose-500", category: "monitoring" },
      { name: "Analytics", color: "bg-rose-300", category: "monitoring" },
    ],
  },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState<string | null>("Backend");

  const toggle = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  const onDragStart = useCallback(
    (e: React.DragEvent, item: ComponentItem) => {
      e.dataTransfer.setData(
        DND_DATA_KEY,
        JSON.stringify({
          name: item.name,
          category: item.category,
          nodeType: getNodeTypeForItem(item.name),
        }),
      );
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  return (
    <aside className="w-64 border-r-4 border-neo-black bg-neo-cream flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b-4 border-neo-black">
        <h2 className="text-sm font-bold uppercase tracking-widest">Component Library</h2>
      </div>

      {/* Scrollable categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {COMPONENT_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            {/* Category header */}
            <button
              onClick={() => toggle(cat.name)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 border-2 border-neo-black rounded-16 font-bold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-neo-sm ${cat.colorClass} text-white`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="flex-1 text-left">{cat.name}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${expanded === cat.name ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Items */}
            {expanded === cat.name && (
              <div className="mt-1.5 ml-2 space-y-1">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-neo-black rounded-16 bg-white cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-neo-sm node-pop-in"
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color} border border-neo-black`} />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t-4 border-neo-black">
        <p className="text-xs font-medium text-neo-gray-600 uppercase tracking-wide text-center">
          Drag components to canvas
        </p>
      </div>
    </aside>
  );
}
