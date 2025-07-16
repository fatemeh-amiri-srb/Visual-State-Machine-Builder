import { create } from "zustand";

interface StateNode {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Transition {
  from: string;
  to: string;
  label?: string;
}

interface EditorState {
  nodes: StateNode[];
  connections: Transition[];
  selectedNode: string | null;
  history: { nodes: StateNode[]; connections: Transition[] }[];
  historyIndex: number;
  addNode: (node: StateNode) => void;
  moveNode: (id: string, x: number, y: number) => void;
  removeNode: (id: string) => void;
  connectNodes: (from: string, to: string) => void;
  selectNode: (id: string | null) => void;
  setState: (data: { nodes: StateNode[]; connections: Transition[] }) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: (newState: {
    nodes: StateNode[];
    connections: Transition[];
  }) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  connections: [],
  selectedNode: null,
  history: [],
  historyIndex: -1,

  pushHistory: (newState) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      nodes: newState.nodes,
      connections: newState.connections,
    });
  },

  addNode: (node) => {
    const { nodes, connections, pushHistory } = get();
    const newNodes = [...nodes, node];
    pushHistory({ nodes: newNodes, connections });
  },

  moveNode: (id, x, y) => {
    const { nodes, connections, pushHistory } = get();
    const newNodes = nodes.map((n) => (n.id === id ? { ...n, x, y } : n));
    pushHistory({ nodes: newNodes, connections });
  },

  removeNode: (id) => {
    const { nodes, connections, pushHistory } = get();
    const newNodes = nodes.filter((n) => n.id !== id);
    const newConnections = connections.filter(
      (c) => c.from !== id && c.to !== id
    );
    pushHistory({ nodes: newNodes, connections: newConnections });
  },

  connectNodes: (from, to) => {
    const { nodes, connections, pushHistory } = get();
    const newConnections = [
      ...connections,
      {
        from,
        to,
        label: `event${connections.length + 1}`,
      },
    ];
    pushHistory({ nodes, connections: newConnections });
  },

  selectNode: (id) => set(() => ({ selectedNode: id })),

  setState: ({ nodes, connections }) => {
    const { pushHistory } = get();
    pushHistory({ nodes, connections });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({
        nodes: prevState.nodes,
        connections: prevState.connections,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        nodes: nextState.nodes,
        connections: nextState.connections,
        historyIndex: historyIndex + 1,
      });
    }
  },
}));
