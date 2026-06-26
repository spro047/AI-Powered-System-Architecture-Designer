"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { NodeTypes } from "@xyflow/react";
import type {
  ArchitectureCategory,
  ArchitectureNodeData,
} from "@/components/nodes/types";
import { CATEGORY_ICONS } from "@/components/nodes/types";
import { getLayoutedNodes } from "@/lib/layout";
import { NODE_TYPES, getNodeTypeForItem } from "@/components/nodes/node-registry";
import {
  generateArchitectureFromBackend,
  architectureResultToFlow,
} from "@/lib/generator";
import { useProject } from "@/components/project-provider";

const nodeTypes = NODE_TYPES as unknown as NodeTypes;

const defaultEdgeOptions = {
  style: { stroke: "#1A1A1A", strokeWidth: 3 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#1A1A1A",
    width: 20,
    height: 20,
  },
  animated: false,
};

const DND_DATA_KEY = "application/archigen-component";

interface DraggedComponent {
  name: string;
  category: ArchitectureCategory;
  icon?: string;
  nodeType?: string;
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `node_${Date.now()}_${idCounter}`;
}

export default function CanvasContainer() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}

function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    save,
    loading,
    projectId,
  } = useProject();

  /* Local only: React Flow instance + generating status */
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /* Track last-known node/edge count so we only dispatch on actual change */
  const lastCount = useRef({ nodes: 0, edges: 0 });

  /* Defer to provider state — useNodesState/useEdgesState are replaced
     by the provider's setNodes/setEdges */
  const onNodesChange = useCallback(
    (changes: any) => {
      const updated = applyNodeChanges(changes, nodes);
      setNodes(updated);
    },
    [nodes, setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      const updated = applyEdgeChanges(changes, edges);
      setEdges(updated);
    },
    [edges, setEdges],
  );

  /* Dispatch "canvas-changed" when nodes/edges actually change */
  useEffect(() => {
    const nn = nodes.length;
    const ne = edges.length;
    const prev = lastCount.current;
    if (nn !== prev.nodes || ne !== prev.edges) {
      lastCount.current = { nodes: nn, edges: ne };
      window.dispatchEvent(new CustomEvent("canvas-changed"));
    }
  }, [nodes, edges]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      handleGenerate(e.detail?.prompt || "");
    };
    window.addEventListener("generate-architecture", handler as EventListener);
    return () =>
      window.removeEventListener(
        "generate-architecture",
        handler as EventListener,
      );
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { id, data } = e.detail ?? {};
      if (!id) return;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...data } } : n)),
      );
    };
    window.addEventListener("node-updated", handler as EventListener);
    return () =>
      window.removeEventListener("node-updated", handler as EventListener);
  }, [setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#1A1A1A", strokeWidth: 3 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#1A1A1A",
              width: 20,
              height: 20,
            },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const raw = event.dataTransfer?.getData(DND_DATA_KEY);
      if (!raw) return;

      const component: DraggedComponent = JSON.parse(raw);

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const mappedType = component.nodeType || getNodeTypeForItem(component.name);

      const newNode: Node<ArchitectureNodeData> = {
        id: nextId(),
        type: mappedType,
        position,
        data: {
          label: component.name,
          category: component.category,
          icon: component.icon || CATEGORY_ICONS[component.category],
          description: `${component.category} component`,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const evt = new CustomEvent("node-selected", {
      detail: { node: { ...node } },
    });
    window.dispatchEvent(evt);
  }, []);

  const onNodeDragStart = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event: any, _node: Node) => {
      window.dispatchEvent(new CustomEvent("node-deselected"));
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("node-deselected"));
  }, []);

  const onAutoLayout = useCallback(() => {
    setNodes((nds) => getLayoutedNodes(nds, edges) as Node<ArchitectureNodeData>[]);
  }, [edges, setNodes]);

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const ids = new Set(deleted.map((n) => n.id));
      setEdges((eds) =>
        eds.filter(
          (e) => !ids.has(e.source) && !ids.has(e.target),
        ),
      );
      window.dispatchEvent(new CustomEvent("node-deselected"));
    },
    [setEdges],
  );

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const label = e.detail?.id;
      if (!label) return;
      setNodes((nds) => {
        const node = nds.find((n) => n.data.label === label);
        if (node) {
          setEdges((eds) =>
            eds.filter(
              (e) => e.source !== node.id && e.target !== node.id,
            ),
          );
          return nds.filter((n) => n.id !== node.id);
        }
        return nds;
      });
    };
    window.addEventListener("delete-node", handler as EventListener);
    return () =>
      window.removeEventListener("delete-node", handler as EventListener);
  }, [setNodes, setEdges]);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isGenerating) return;
      setIsGenerating(true);

      window.dispatchEvent(
        new CustomEvent("generation-progress", {
          detail: { label: "Analyzing Requirements", delay: 0 },
        }),
      );

      try {
        const result = await generateArchitectureFromBackend(prompt);

        const stages = [
          { label: `Pattern: ${result.pattern}`, delay: 400 },
          { label: `Identifying ${result.components.length} Components`, delay: 600 },
          { label: "Placing on Canvas", delay: 600 },
        ];

        for (const stage of stages) {
          window.dispatchEvent(
            new CustomEvent("generation-progress", { detail: stage }),
          );
          await new Promise((r) => setTimeout(r, stage.delay));
        }

        const { nodes: genNodes, edges: genEdges } =
          architectureResultToFlow(result);

        setNodes([]);
        setEdges([]);
        await new Promise((r) => setTimeout(r, 100));

        for (let i = 0; i < genNodes.length; i++) {
          setNodes((prev) => [...prev, genNodes[i]!]);
          await new Promise((r) => setTimeout(r, 250));
        }

        await new Promise((r) => setTimeout(r, 150));
        setEdges(genEdges);

        if (result.suggestions.length > 0) {
          window.dispatchEvent(
            new CustomEvent("ai-suggestions", {
              detail: { suggestions: result.suggestions },
            }),
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        window.dispatchEvent(
          new CustomEvent("generation-progress", {
            detail: { label: `Error: ${msg}`, delay: 0 },
          }),
        );
      }

      window.dispatchEvent(
        new CustomEvent("generation-progress", {
          detail: { label: "Architecture Ready", delay: 0 },
        }),
      );
      setIsGenerating(false);
    },
    [setNodes, setEdges],
  );

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      {nodes.length === 0 && !isGenerating && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="neo-card max-w-lg text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-neo-yellow border-4 border-neo-black rounded-16 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Your Architecture Canvas</h2>
            <p className="text-neo-gray-600 font-medium">
              Describe your software in the AI panel below, or drag components
              from the library.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-neo-gray-600">
              <span className="neo-badge bg-neo-blue text-white text-xs">
                Zoom
              </span>
              <span className="neo-badge bg-neo-green text-white text-xs">
                Pan
              </span>
              <span className="neo-badge bg-neo-yellow text-black text-xs">
                Drag & Drop
              </span>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 neo-badge bg-neo-green text-white text-sm border-4 animate-pulse">
          AI is building your architecture...
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodesDelete={onNodesDelete}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={["Backspace", "Delete"]}
        panOnDrag={true}
        selectNodesOnDrag={false}
        fitView
        className="neo-grid-bg"
        minZoom={0.1}
        maxZoom={4}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#FFF3C4"
          bgColor="#FFF8E7"
          size={2}
          gap={24}
        />
        <Controls
          position="bottom-right"
          className="!border-2 !border-neo-black !rounded-16 !shadow-neo-sm !overflow-hidden"
          showInteractive={false}
        >
          <button
            onClick={onAutoLayout}
            className="react-flow__controls-button !border-0 !rounded-none"
            title="Auto Layout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <line x1="10" y1="6.5" x2="14" y2="6.5" />
              <line x1="6.5" y1="10" x2="6.5" y2="14" />
              <line x1="17.5" y1="10" x2="17.5" y2="14" />
            </svg>
          </button>
        </Controls>
      </ReactFlow>
    </div>
  );
}
