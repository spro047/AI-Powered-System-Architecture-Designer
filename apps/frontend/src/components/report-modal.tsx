"use client";

import type { ArchitectureExplanation } from "@/lib/api";

interface ReportModalProps {
  explanation: ArchitectureExplanation;
  onClose: () => void;
}

export function ReportModal({ explanation, onClose }: ReportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] mx-4 bg-neo-cream border-4 border-neo-black rounded-16 shadow-neo overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-neo-black bg-neo-black text-white shrink-0">
          <h2 className="text-lg font-bold uppercase tracking-wider">
            Architecture Report
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-neo-red border-2 border-white rounded-16 flex items-center justify-center text-white font-bold text-sm hover:bg-red-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Architecture Summary */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-neo-blue border-2 border-neo-black rounded-8 flex items-center justify-center text-white text-xs font-bold shrink-0">
                1
              </span>
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Architecture Summary
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neo-black whitespace-pre-line">
              {explanation.summary}
            </p>
          </section>

          {/* Pattern Explanation */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-neo-green border-2 border-neo-black rounded-8 flex items-center justify-center text-white text-xs font-bold shrink-0">
                2
              </span>
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Pattern Explanation
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neo-black whitespace-pre-line">
              {explanation.patternExplanation}
            </p>
          </section>

          {/* Component Explanations */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-neo-yellow border-2 border-neo-black rounded-8 flex items-center justify-center text-black text-xs font-bold shrink-0">
                3
              </span>
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Component Explanations
              </h3>
            </div>
            <div className="space-y-3">
              {explanation.componentExplanations.map((comp) => (
                <div
                  key={comp.id}
                  className="border-2 border-neo-black rounded-12 p-4 bg-white"
                >
                  <h4 className="text-sm font-bold mb-1.5 uppercase tracking-wide">
                    {comp.label}
                  </h4>
                  <p className="text-xs leading-relaxed text-neo-gray-600">
                    {comp.explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Design Decisions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-neo-red border-2 border-neo-black rounded-8 flex items-center justify-center text-white text-xs font-bold shrink-0">
                4
              </span>
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Design Decisions
              </h3>
            </div>
            <div className="space-y-3">
              {explanation.designDecisions.map((dd, i) => (
                <div
                  key={i}
                  className="border-2 border-neo-black rounded-12 p-4 bg-white"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neo-gray-600 bg-neo-gray-200 px-2 py-0.5 rounded-8">
                      {dd.topic}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mb-1">{dd.decision}</h4>
                  <p className="text-xs leading-relaxed text-neo-gray-600">
                    {dd.rationale}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
