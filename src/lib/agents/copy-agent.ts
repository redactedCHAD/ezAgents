import { GoogleGenAI } from '@google/genai';
import { useEventStore } from '@/store/useEventStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { copyOutputGenAISchema } from '@/lib/schemas';

export async function runCopyAgent(task: string, onOutput: (data: any) => void) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const eventStore = useEventStore.getState();
  const workflowStore = useWorkflowStore.getState();

  const nodeId = 'copy-agent';
  eventStore.addActiveAgent('Copy Agent');
  eventStore.addEvent({ agent: 'Copy Agent', type: 'AGENT_START', message: `Generating copy for: "${task}"` });
  workflowStore.updateNodeStatus(nodeId, 'Executing');

  const startTime = Date.now();

  try {
    eventStore.addEvent({ agent: 'Copy Agent', type: 'MODEL_CALL', message: 'Calling gemini-3-flash-preview' });
    
    const node = workflowStore.nodes.find(n => n.id === nodeId);
    const systemInstruction = node?.data.systemPrompt || 'You are an expert marketing copywriter. Generate a catchy headline, an engaging post body, and relevant hashtags.';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate marketing copy for the following task: ${task}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: copyOutputGenAISchema,
        systemInstruction,
      }
    });

    const latency = Date.now() - startTime;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    const tokens = Math.floor(text.length / 4) + 100; 

    eventStore.updateMetrics(tokens, latency);
    workflowStore.updateNodeStatus(nodeId, 'Completed', tokens, latency, data);
    eventStore.addEvent({ agent: 'Copy Agent', type: 'COMPLETED', message: `Copy generation complete.`, data });
    eventStore.removeActiveAgent('Copy Agent');
    
    onOutput({ type: 'copy', data });
    return data;
  } catch (error: any) {
    workflowStore.updateNodeStatus(nodeId, 'Error');
    eventStore.addEvent({ agent: 'Copy Agent', type: 'ERROR', message: `Error: ${error.message}` });
    eventStore.removeActiveAgent('Copy Agent');
    return null;
  }
}
