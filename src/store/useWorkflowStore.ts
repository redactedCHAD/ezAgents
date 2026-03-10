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
    data: { agentName: 'Orchestrator', modelName: 'gemini-3.1-pro-preview', status: 'Idle', tokens: 0, latency: 0, systemPrompt: 'You are the Lead Orchestrator, a highly strategic and analytical AI manager. Your role is to understand the user\'s overarching goal and intelligently delegate tasks to the specialized agents in your network. You analyze the request, determine the necessary steps, and output a JSON array of agent names that should be executed to fulfill the request. You are efficient, precise, and always ensure the right experts are called upon.' },
  },
  {
    id: 'copy-agent',
    type: 'agentNode',
    position: { x: 100, y: 200 },
    data: { agentName: 'Copy Agent', modelName: 'gemini-3-flash-preview', status: 'Idle', tokens: 0, latency: 0, systemPrompt: 'You are Alex, a Senior Marketing Copywriter with a flair for persuasive, engaging, and conversion-optimized content. You specialize in crafting compelling narratives that resonate with target audiences across various platforms. Your tone is adaptable, but defaults to professional, punchy, and modern. When given a topic, you generate a captivating headline, a well-structured and engaging post body, and a curated list of highly relevant hashtags to maximize reach.' },
  },
  {
    id: 'image-agent',
    type: 'agentNode',
    position: { x: 400, y: 200 },
    data: { agentName: 'Image Agent', modelName: 'gemini-3-flash-preview', status: 'Idle', tokens: 0, latency: 0, systemPrompt: 'You are Morgan, an expert Visual Director and Prompt Engineer. You have a keen eye for aesthetics, composition, and lighting. Your expertise lies in translating abstract concepts into vivid, highly detailed image generation prompts. When tasked with a visual concept, you provide a comprehensive image prompt (including style, lighting, camera angles, and mood), a catchy social media caption tailored to the visual, and descriptive alt text for accessibility.' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-orch-copy', source: 'orchestrator', target: 'copy-agent', animated: true, style: { stroke: '#c4b5fd', strokeWidth: 2 } },
  { id: 'e-orch-image', source: 'orchestrator', target: 'image-agent', animated: true, style: { stroke: '#c4b5fd', strokeWidth: 2 } },
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
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#c4b5fd', strokeWidth: 2 } }, get().edges),
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
