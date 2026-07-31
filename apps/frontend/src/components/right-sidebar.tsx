"use client";

import { useState, useCallback, useEffect } from "react";
import type { ArchitectureCategory } from "@/components/nodes/types";
import { getNodeTypeForItem } from "@/components/nodes/node-registry";
import { useProject } from "@/components/project-provider";
import { api } from "@/lib/api";
import type { ArchitectureExplanation } from "@/lib/api";
import { ReportModal } from "@/components/report-modal";

/* ── Tab navigation ── */

type TabId = "components" | "ai-chat" | "report";

/* ── Component Library data ── */

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

const DND_DATA_KEY = "application/archigen-component";

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

/* ── AI Chat constants ── */

const ALL_STAGES = [
  "Analyzing Requirements",
  "Selecting Pattern",
  "Identifying Components",
  "Placing on Canvas",
] as const;

/* ── Component Library Panel ── */

function ComponentLibrary() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b-4 border-neo-black shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-widest">Component Library</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {COMPONENT_CATEGORIES.map((cat) => (
          <div key={cat.name}>
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

      <div className="px-4 py-2 border-t-4 border-neo-black shrink-0">
        <p className="text-xs font-medium text-neo-gray-600 uppercase tracking-wide text-center">
          Drag components to canvas
        </p>
      </div>
    </div>
  );
}

/* ── AI Chat Panel ── */

function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [hasRecentGeneration, setHasRecentGeneration] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const { projectId, pattern, description, nodes, edges, explanation, setExplanation, setLastArchitectureData, createNewProject } = useProject();

  useEffect(() => {
    const onProgress = (e: CustomEvent) => {
      const label = e.detail?.label;
      if (label === "Architecture Ready") {
        setCurrentStage(null);
        setIsGenerating(false);
      } else if (label) {
        setCurrentStage(label);
      }
    };
    window.addEventListener("generation-progress", onProgress as EventListener);
    return () => window.removeEventListener("generation-progress", onProgress as EventListener);
  }, []);

  useEffect(() => {
    const onGenerated = (e: CustomEvent) => {
      const data = e.detail;
      if (data && data.pattern) {
        setHasRecentGeneration(true);
        setLastArchitectureData(data);
      }
    };
    window.addEventListener("architecture-generated", onGenerated as EventListener);
    return () => window.removeEventListener("architecture-generated", onGenerated as EventListener);
  }, [setLastArchitectureData]);

  const triggerGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setCurrentStage(ALL_STAGES[0]!);
    window.dispatchEvent(
      new CustomEvent("generate-architecture", { detail: { prompt } }),
    );
  };

  const handleExplain = useCallback(async () => {
    if (isExplaining || hasRecentGeneration === false) return;
    setIsExplaining(true);
    try {
      // Ensure a project exists before making the explain API call
      let pid = projectId;
      if (!pid) {
        pid = await createNewProject();
        if (!pid) throw new Error("Failed to create project");
      }
      const result = await api.explainArchitecture({
        projectId: pid,
        pattern: pattern ?? "Unknown",
        description: description ?? "",
        components: nodes.map((n) => ({
          id: n.id,
          type: n.data.category,
          label: n.data.label,
          description: n.data.description ?? "",
        })),
        connections: edges.map((e) => ({
          id: e.id,
          sourceId: e.source,
          targetId: e.target,
          label: (e.label as string) ?? "",
          type: e.type ?? "default",
        })),
      });
      setExplanation(result);
      setHasRecentGeneration(false);
    } catch {
      // Error is handled silently
    } finally {
      setIsExplaining(false);
    }
  }, [projectId, pattern, description, nodes, edges, isExplaining, hasRecentGeneration, setExplanation, createNewProject]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      triggerGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b-4 border-neo-black shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-widest">AI Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {isGenerating && (
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide">
              {ALL_STAGES.map((stage) => {
                const stageIndex = ALL_STAGES.indexOf(stage);
                const currentIndex = ALL_STAGES.indexOf(
                  currentStage as (typeof ALL_STAGES)[number],
                );
                const done = currentIndex >= stageIndex;
                const active = currentStage === stage;
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <span
                      className={`neo-badge text-xs whitespace-nowrap ${
                        active
                          ? "bg-neo-green text-white animate-pulse"
                          : done
                            ? "bg-neo-black text-white"
                            : "bg-neo-gray-200 text-neo-gray-600"
                      }`}
                    >
                      {done && !active ? "✓" : active ? "→" : ""} {stage}
                    </span>
                    {stageIndex < ALL_STAGES.length - 1 && (
                      <span className="text-neo-gray-300 text-xs">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the software you want to build..."
              className="neo-input !rounded-16 w-full min-h-[140px] py-3 resize-none"
              rows={5}
              onKeyDown={handleKeyDown}
            />
            {prompt.length > 0 && (
              <button
                onClick={() => setPrompt("")}
                className="absolute top-3 right-3 neo-btn !px-2 !py-1 !text-xs !border-2"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <button
            disabled={!prompt.trim() || isGenerating}
            onClick={triggerGenerate}
            className="neo-btn-primary !w-full !py-3.5 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Generate
              </>
            )}
          </button>

          {hasRecentGeneration && !explanation && (
            <button
              onClick={handleExplain}
              disabled={isExplaining}
              className="neo-btn !w-full !py-3 !text-sm flex items-center justify-center gap-2 border-neo-green text-neo-green hover:bg-neo-green hover:text-white transition-colors"
            >
              {isExplaining ? (
                <>
                  <span className="w-4 h-4 border-2 border-neo-green border-t-transparent rounded-full animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Generate Architecture Summary
                </>
              )}
            </button>
          )}

          {explanation && (
            <div className="neo-badge bg-neo-green text-white text-xs w-full justify-center">
              ✓ Architecture summary generated
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neo-gray-600">
              Try:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Build an e-commerce platform with payments",
                "Food delivery app with real-time tracking",
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="neo-badge bg-white text-neo-black text-xs border-2 hover:shadow-neo-sm transition-shadow cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Report Panel ── */

function ReportPanel() {
  const { explanation, nodes } = useProject();
  const [showModal, setShowModal] = useState(false);

  if (!explanation) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-4 py-3 border-b-4 border-neo-black shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-widest">Report</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 mb-4 bg-neo-gray-200 border-4 border-neo-black rounded-16 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <p className="text-sm font-bold text-neo-gray-600 mb-1">No Report Yet</p>
          <p className="text-xs text-neo-gray-400">
            Generate an architecture first, then create a summary from the AI Chat tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b-4 border-neo-black shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-widest">Report</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Summary widget */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full neo-card !p-0 overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-neo cursor-pointer"
          >
            <div className="bg-neo-green text-white px-4 py-2 border-b-4 border-neo-black">
              <span className="text-xs font-bold uppercase tracking-wider">
                Architecture Overview
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-neo-gray-600 line-clamp-4 leading-relaxed">
                {explanation.summary}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-neo-green uppercase tracking-wide">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                Open Full Report
              </div>
            </div>
          </button>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="neo-badge bg-neo-black text-white text-xs flex-col items-start p-3">
              <span className="text-neo-gray-400 text-[10px] uppercase tracking-wider">Pattern</span>
              <span className="font-bold mt-0.5">{explanation.patternExplanation.slice(0, 60)}...</span>
            </div>
            <div className="neo-badge bg-neo-black text-white text-xs flex-col items-start p-3">
              <span className="text-neo-gray-400 text-[10px] uppercase tracking-wider">Components</span>
              <span className="font-bold mt-0.5">{explanation.componentExplanations.length} services</span>
            </div>
          </div>

          {/* Design Decisions quick list */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neo-gray-600">
              Key Decisions
            </span>
            {explanation.designDecisions.slice(0, 3).map((dd, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="w-1.5 h-1.5 mt-1 bg-neo-green rounded-full shrink-0" />
                <span className="text-neo-gray-600">{dd.decision}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <ReportModal
          explanation={explanation}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ── Main RightSidebar ── */

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<TabId>("ai-chat");

  return (
    <aside className="w-80 border-r-4 border-neo-black bg-neo-cream flex flex-col shrink-0 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b-4 border-neo-black shrink-0">
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
            activeTab === "components"
              ? "bg-neo-black text-white"
              : "bg-neo-cream text-neo-black hover:bg-neo-gray-200"
          }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab("ai-chat")}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
            activeTab === "ai-chat"
              ? "bg-neo-black text-white"
              : "bg-neo-cream text-neo-black hover:bg-neo-gray-200"
          }`}
        >
          AI Chat
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
            activeTab === "report"
              ? "bg-neo-black text-white"
              : "bg-neo-cream text-neo-black hover:bg-neo-gray-200"
          }`}
        >
          Report
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "components" ? (
          <ComponentLibrary />
        ) : activeTab === "ai-chat" ? (
          <AIChat />
        ) : (
          <ReportPanel />
        )}
      </div>
    </aside>
  );
}
