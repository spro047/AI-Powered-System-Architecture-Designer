"use client";

import { useState, useEffect } from "react";

const ALL_STAGES = [
  "Analyzing Requirements",
  "Selecting Pattern",
  "Identifying Components",
  "Placing on Canvas",
] as const;

export function PromptPanel() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);

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
    window.addEventListener(
      "generation-progress",
      onProgress as EventListener,
    );
    return () =>
      window.removeEventListener(
        "generation-progress",
        onProgress as EventListener,
      );
  }, []);

  const triggerGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setCurrentStage(ALL_STAGES[0]!);
    window.dispatchEvent(
      new CustomEvent("generate-architecture", { detail: { prompt } }),
    );
  };

  return (
    <div className="border-t-4 border-neo-black bg-neo-cream shrink-0">
      <div className="p-4 space-y-3">
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
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

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the software you want to build..."
              className="neo-input !rounded-16 min-h-[56px] max-h-[120px] py-3 pr-12 resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  triggerGenerate();
                }
              }}
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

          <div className="flex gap-2 shrink-0">
            <button
              disabled={!prompt.trim() || isGenerating}
              onClick={triggerGenerate}
              className="neo-btn-primary !px-6 !py-3 flex items-center gap-2"
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
            <button
              className="neo-btn !px-4 !py-3 !text-sm"
              title="Improve Prompt"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-neo-gray-600">
          <span>Try:</span>
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
  );
}
