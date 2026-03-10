import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type AgentNodeData = {
  agentName: string;
  modelName: string;
  status: 'Idle' | 'Thinking' | 'Executing' | 'Completed' | 'Error';
  tokens: number;
  latency: number;
  systemPrompt?: string;
  temperature?: number;
  output?: any;
};

export type AgentNode = Node<AgentNodeData>;

interface WorkflowStore {
  nodes: AgentNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange<AgentNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AgentNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeStatus: (nodeId: string, status: AgentNodeData['status'], tokens?: number, latency?: number, output?: any) => void;
  updateNodeSystemPrompt: (nodeId: string, systemPrompt: string) => void;
  addNode: (node: AgentNode) => void;
  setSelectedNodeId: (id: string | null) => void;
}

const initialNodes: AgentNode[] = [
  {
    id: 'orchestrator',
    type: 'agentNode',
    position: { x: 250, y: 50 },
    data: { agentName: 'Orchestrator', modelName: 'gemini-3.1-pro-preview', status: 'Idle', tokens: 0, latency: 0, systemPrompt: 'You are an orchestrator agent. Decide which agents to run based on the user task. Return a JSON object with an "agents" array.' },
  },
  {
    id: 'copy-agent',
    type: 'agentNode',
    position: { x: 100, y: 200 },
    data: { agentName: 'Copy Agent', modelName: 'gemini-3-flash-preview', status: 'Idle', tokens: 0, latency: 0, systemPrompt: 'You are an expert marketing copywriter. Generate a catchy headline, an engaging post body, and relevant hashtags.' },
  },
  {
    id: 'image-agent',
    type: 'agentNode',
    position: { x: 400, y: 200 },
    data: { agentName: 'Image Agent', modelName: 'gemini-3-flash-preview', status: 'Idle', tokens: 0, latency: 0, systemPrompt: 'You are an expert visual director. Generate a detailed image prompt, a social media caption for the image, and alt text.' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-orch-copy', source: 'orchestrator', target: 'copy-agent', animated: true },
  { id: 'e-orch-image', source: 'orchestrator', target: 'image-agent', animated: true },
];

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  onNodesChange: (changes: NodeChange<AgentNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  updateNodeStatus: (nodeId, status, tokens = 0, latency = 0, output) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status,
              tokens: node.data.tokens + tokens,
              latency: node.data.latency + latency,
              ...(output !== undefined ? { output } : {}),
            },
          };
        }
        return node;
      }),
    }));
  },
  updateNodeSystemPrompt: (nodeId, systemPrompt) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              systemPrompt,
            },
          };
        }
        return node;
      }),
    }));
  },
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));
