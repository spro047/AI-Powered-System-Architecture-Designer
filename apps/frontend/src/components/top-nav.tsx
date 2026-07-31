"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useProject } from "@/components/project-provider";
import { exportPng, exportJson } from "@/lib/export";

export function TopNav() {
  const {
    title,
    pattern,
    description,
    nodes,
    edges,
    saving,
    error,
    lastSaved,
    save,
    loadProjectList,
    projectList,
    loadProject,
    createNewProject,
    dismissError,
    loading,
  } = useProject();

  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const closeExport = useCallback(() => setExportOpen(false), []);

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        closeExport();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen, closeExport]);

  const handleExportPng = useCallback(async () => {
    setExporting(true);
    closeExport();
    try {
      await exportPng(title);
    } catch {
      // html-to-image failures surface as console errors; silently handled
    } finally {
      setExporting(false);
    }
  }, [title, closeExport]);

  const handleExportJson = useCallback(() => {
    closeExport();
    exportJson(title, pattern, description, nodes, edges);
  }, [title, pattern, description, nodes, edges, closeExport]);

  const handleSave = () => {
    save();
  };

  const handleNew = async () => {
    await createNewProject();
  };

  const timeSinceSave = lastSaved
    ? `${Math.round((Date.now() - lastSaved.getTime()) / 1000)}s ago`
    : null;

  return (
    <header className="h-16 border-b-4 border-neo-black bg-neo-cream px-4 flex items-center justify-between shrink-0">
      {/* Left: Logo + Project Name */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-neo-black rounded-16 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">ArchiGen</span>
        </div>
        <span className="w-px h-6 bg-neo-black shrink-0" />
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-neo-gray-600 uppercase tracking-wide truncate">
            {title}
          </span>
          {saving && (
            <span className="text-xs text-neo-gray-600 shrink-0 animate-pulse">
              saving...
            </span>
          )}
          {!saving && lastSaved && (
            <span className="text-xs text-neo-gray-300 shrink-0 whitespace-nowrap">
              saved {timeSinceSave}
            </span>
          )}
        </div>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleNew}
          className="neo-btn !px-3 !py-2 !text-sm"
          title="New Project"
          disabled={loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="neo-btn !px-4 !py-2 !text-sm flex items-center gap-1.5"
          title="Save"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {saving ? "Saving..." : "Save"}
        </button>
        <div ref={exportRef} className="relative">
          <button
            onClick={() => setExportOpen((o) => !o)}
            disabled={exporting}
            className="neo-btn !px-4 !py-2 !text-sm flex items-center gap-1.5"
            title="Export"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? "Exporting..." : "Export"}
          </button>
          {exportOpen && (
            <div className="absolute top-full right-0 mt-1 min-w-[160px] bg-neo-cream border-3 border-neo-black rounded-8 shadow-neo z-50 overflow-hidden">
              <button
                onClick={handleExportPng}
                disabled={exporting}
                className="w-full px-4 py-2.5 text-sm font-semibold text-left flex items-center gap-2 hover:bg-neo-black/5 transition-colors border-b-2 border-neo-black/10"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Export PNG
              </button>
              <button
                onClick={handleExportJson}
                className="w-full px-4 py-2.5 text-sm font-semibold text-left flex items-center gap-2 hover:bg-neo-black/5 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Export JSON
              </button>
            </div>
          )}
        </div>
        <span className="w-px h-6 bg-neo-black/30 mx-1" />
        <button className="neo-btn !px-3 !py-2 !text-sm" title="Undo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button className="neo-btn !px-3 !py-2 !text-sm" title="Redo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* Right: Save Status + AI Status + User */}
      <div className="flex items-center gap-3 shrink-0">
        {error && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neo-red font-bold">{error}</span>
            <button
              onClick={dismissError}
              className="neo-btn !px-1 !py-0 !text-xs !border-2"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 neo-badge bg-neo-green text-white text-xs">
          <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse" />
          AI Ready
        </div>
        <div className="w-9 h-9 bg-neo-black rounded-16 flex items-center justify-center text-neo-cream font-bold text-sm">
          U
        </div>
      </div>
    </header>
  );
}
