import { create } from 'zustand';

export type EventType = 'AGENT_START' | 'THINKING' | 'MODEL_CALL' | 'COMPLETED' | 'METRICS_UPDATE' | 'ERROR';

export interface AgentEvent {
  id: string;
  timestamp: number;
  agent: string;
  type: EventType;
  message: string;
  data?: any;
}

interface EventStore {
  events: AgentEvent[];
  totalTokens: number;
  totalLatency: number; // in ms
  activeAgents: string[];
  addEvent: (event: Omit<AgentEvent, 'id' | 'timestamp'>) => void;
  updateMetrics: (tokens: number, latency: number) => void;
  addActiveAgent: (agent: string) => void;
  removeActiveAgent: (agent: string) => void;
  clearEvents: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  totalTokens: 0,
  totalLatency: 0,
  activeAgents: [],
  addEvent: (event) => set((state) => ({
    events: [...state.events, { ...event, id: Math.random().toString(36).substring(7), timestamp: Date.now() }]
  })),
  updateMetrics: (tokens, latency) => set((state) => ({
    totalTokens: state.totalTokens + tokens,
    totalLatency: state.totalLatency + latency
  })),
  addActiveAgent: (agent) => set((state) => ({
    activeAgents: state.activeAgents.includes(agent) ? state.activeAgents : [...state.activeAgents, agent]
  })),
  removeActiveAgent: (agent) => set((state) => ({
    activeAgents: state.activeAgents.filter((a) => a !== agent)
  })),
  clearEvents: () => set({ events: [], totalTokens: 0, totalLatency: 0, activeAgents: [] }),
}));
