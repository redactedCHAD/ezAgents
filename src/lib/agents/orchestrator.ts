import { GoogleGenAI } from '@google/genai';
import { useEventStore } from '@/store/useEventStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { orchestratorGenAISchema } from '@/lib/schemas';

export async function runOrchestrator(task: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const eventStore = useEventStore.getState();
  const workflowStore = useWorkflowStore.getState();

  const nodeId = 'orchestrator';
  eventStore.addActiveAgent('Orchestrator');
  eventStore.addEvent({ agent: 'Orchestrator', type: 'AGENT_START', message: `Starting orchestration for task: "${task}"` });
  workflowStore.updateNodeStatus(nodeId, 'Thinking');

  const startTime = Date.now();

  try {
    eventStore.addEvent({ agent: 'Orchestrator', type: 'MODEL_CALL', message: 'Calling gemini-3.1-pro-preview' });
    
    const node = workflowStore.nodes.find(n => n.id === nodeId);
    const systemInstruction = node?.data.systemPrompt || 'You are an orchestrator agent. Decide which agents to run based on the user task. Return a JSON object with an "agents" array.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Analyze the following marketing task and determine which agents are needed.
      Available agents: 'Copy Agent', 'Image Agent', 'SEO Agent', 'Video Agent'.
      Task: ${task}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: orchestratorGenAISchema,
        systemInstruction,
      }
    });

    const latency = Date.now() - startTime;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    // Estimate tokens (rough estimation for UI purposes since actual token count might not be available in response directly)
    const tokens = Math.floor(text.length / 4) + 50; 

    eventStore.updateMetrics(tokens, latency);
    workflowStore.updateNodeStatus(nodeId, 'Completed', tokens, latency, data);
    eventStore.addEvent({ agent: 'Orchestrator', type: 'COMPLETED', message: `Orchestration complete. Selected agents: ${data.agents?.join(', ') || 'None'}`, data });
    eventStore.removeActiveAgent('Orchestrator');

    return data.agents || [];
  } catch (error: any) {
    workflowStore.updateNodeStatus(nodeId, 'Error');
    eventStore.addEvent({ agent: 'Orchestrator', type: 'ERROR', message: `Error: ${error.message}` });
    eventStore.removeActiveAgent('Orchestrator');
    return [];
  }
}
