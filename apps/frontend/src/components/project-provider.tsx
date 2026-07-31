"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import { api, type ProjectDetail, type ProjectSummary, type ArchitectureExplanation } from "@/lib/api";
import { buildCanvasPayload, projectToCanvas } from "@/lib/mapping";

/* ── State shape ── */

export interface ProjectState {
  /** null = no project loaded yet */
  projectId: string | null;
  title: string;
  description: string | null;
  pattern: string | null;
  nodes: Node<ArchitectureNodeData>[];
  edges: Edge[];
  /** true while a save is in flight */
  saving: boolean;
  /** true while loading a project from the API */
  loading: boolean;
  /** Error message from the last failed operation */
  error: string | null;
  /** Last save timestamp */
  lastSaved: Date | null;
  /** User's project list */
  projectList: ProjectSummary[];
  /** Architecture explanation (from AI) */
  explanation: ArchitectureExplanation | null;
  /** The last generated architecture data (for generating explanation) */
  lastArchitectureData: {
    pattern: string;
    description: string;
    components: Array<{ id: string; type: string; label: string; description: string }>;
    connections: Array<{ id: string; sourceId: string; targetId: string; label: string; type: string }>;
  } | null;
}

/* ── Context ── */

type SetNodesFn = (nodes: Node<ArchitectureNodeData>[] | ((prev: Node<ArchitectureNodeData>[]) => Node<ArchitectureNodeData>[])) => void;
type SetEdgesFn = (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;

interface ProjectContextValue extends ProjectState {
  setNodes: SetNodesFn;
  setEdges: SetEdgesFn;
  setTitle: (title: string) => void;
  setDescription: (description: string | null) => void;
  setPattern: (pattern: string | null) => void;
  setExplanation: (explanation: ArchitectureExplanation | null) => void;
  setLastArchitectureData: (data: ProjectState["lastArchitectureData"]) => void;
  save: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  createNewProject: (title?: string) => Promise<string>;
  loadProjectList: () => Promise<void>;
  dismissError: () => void;
  resetCanvas: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within a ProjectProvider");
  return ctx;
}

/* ── Provider ── */

const DEFAULT_TITLE = "Untitled Project";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>({
    projectId: null,
    title: DEFAULT_TITLE,
    description: null,
    pattern: null,
    nodes: [],
    edges: [],
    saving: false,
    loading: false,
    error: null,
    lastSaved: null,
    projectList: [],
    explanation: null,
    lastArchitectureData: null,
  });

  /* Derived setters — support both direct values and updater callbacks */
  const setNodes = useCallback(
    (nodesOrUpdater: Node<ArchitectureNodeData>[] | ((prev: Node<ArchitectureNodeData>[]) => Node<ArchitectureNodeData>[])) => {
      setState((s) => ({
        ...s,
        nodes: typeof nodesOrUpdater === "function" ? nodesOrUpdater(s.nodes) : nodesOrUpdater,
      }));
    },
    [],
  );

  const setEdges = useCallback(
    (edgesOrUpdater: Edge[] | ((prev: Edge[]) => Edge[])) => {
      setState((s) => ({
        ...s,
        edges: typeof edgesOrUpdater === "function" ? edgesOrUpdater(s.edges) : edgesOrUpdater,
      }));
    },
    [],
  );

  const setTitle = useCallback((title: string) => {
    setState((s) => ({ ...s, title }));
  }, []);

  const setDescription = useCallback((description: string | null) => {
    setState((s) => ({ ...s, description }));
  }, []);

  const setPattern = useCallback((pattern: string | null) => {
    setState((s) => ({ ...s, pattern }));
  }, []);

  const setExplanation = useCallback((explanation: ArchitectureExplanation | null) => {
    setState((s) => ({ ...s, explanation }));
  }, []);

  const setLastArchitectureData = useCallback(
    (data: ProjectState["lastArchitectureData"]) => {
      setState((s) => ({ ...s, lastArchitectureData: data }));
    },
    [],
  );

  const dismissError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const resetCanvas = useCallback(() => {
    setState((s) => ({ ...s, nodes: [], edges: [] }));
  }, []);

  /* ── Save ── */

  const saveInFlight = useRef(false);

  const save = useCallback(async () => {
    const current = state;
    if (saveInFlight.current) return;
    saveInFlight.current = true;

    try {
      setState((s) => ({ ...s, saving: true, error: null }));

      const payload = buildCanvasPayload(
        current.title,
        current.description,
        current.pattern,
        current.nodes,
        current.edges,
        current.explanation ?? undefined,
      );

      if (current.projectId) {
        /* Update existing project */
        await api.saveCanvas(current.projectId, payload);
        setState((s) => ({ ...s, lastSaved: new Date(), saving: false }));
      } else {
        /* Create then save */
        const created = await api.createProject({
          title: current.title,
          description: current.description ?? undefined,
          pattern: current.pattern ?? undefined,
        });
        await api.saveCanvas(created._id, payload);
        setState((s) => ({
          ...s,
          projectId: created._id,
          lastSaved: new Date(),
          saving: false,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setState((s) => ({ ...s, error: msg, saving: false }));
    } finally {
      saveInFlight.current = false;
    }
  }, [state]);

  /* ── Load project ── */

  const loadProject = useCallback(async (id: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));

      const project: ProjectDetail = await api.getProject(id);
      const { nodes, edges } = projectToCanvas(project.components, project.connections);

      setState((s) => ({
        ...s,
        projectId: project._id,
        title: project.title,
        description: project.description,
        pattern: project.pattern,
        nodes,
        edges,
        explanation: (project as any).explanation ?? null,
        lastSaved: new Date(project.updatedAt),
        loading: false,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load project";
      setState((s) => ({ ...s, error: msg, loading: false }));
    }
  }, []);

  /* ── Create new project ── */

  const createNewProject = useCallback(async (title?: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null, nodes: [], edges: [] }));

      const created = await api.createProject({
        title: title ?? DEFAULT_TITLE,
      });

      setState((s) => ({
        ...s,
        projectId: created._id,
        title: created.title,
        description: created.description,
        pattern: created.pattern,
        nodes: [],
        edges: [],
        lastSaved: new Date(created.updatedAt),
        loading: false,
      }));

      return created._id;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create project";
      setState((s) => ({ ...s, error: msg, loading: false }));
      return "";
    }
  }, []);

  /* ── Load project list ── */

  const loadProjectList = useCallback(async () => {
    try {
      const list = await api.listProjects();
      setState((s) => ({ ...s, projectList: list }));
    } catch {
      /* silently fail — list is populated lazily */
    }
  }, []);

  /* Auto-load project list on mount */
  useEffect(() => {
    loadProjectList();
  }, [loadProjectList]);

  /* ── Auto-save debounce via custom event ──
   * The canvas dispatches "canvas-changed" when nodes/edges change.
   * The debounce waits 2 seconds of inactivity and saves.
   */
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        save();
      }, 2000);
    };

    window.addEventListener("canvas-changed", handler);
    return () => {
      window.removeEventListener("canvas-changed", handler);
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [save, state.projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: ProjectContextValue = {
    ...state,
    setNodes,
    setEdges,
    setTitle,
    setDescription,
    setPattern,
    setExplanation,
    setLastArchitectureData,
    save,
    loadProject,
    createNewProject,
    loadProjectList,
    dismissError,
    resetCanvas,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
