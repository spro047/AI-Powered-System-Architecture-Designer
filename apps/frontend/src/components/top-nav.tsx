"use client";

import { useProject } from "@/components/project-provider";

export function TopNav() {
  const {
    title,
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

  const handleSave = () => {
    save();
  };

  const handleNew = async () => {
    await createNewProject();
  };

  /* Auto-refresh project list on open for project-switcher (future: dropdown) */
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
        <button className="neo-btn !px-4 !py-2 !text-sm flex items-center gap-1.5" title="Export">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
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
