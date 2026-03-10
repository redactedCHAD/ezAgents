import { GoogleGenAI, Type } from '@google/genai';
import { useEventStore } from '@/store/useEventStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';

export const seoOutputGenAISchema = {
  type: Type.OBJECT,
  properties: {
    primary_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    secondary_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    meta_description: { type: Type.STRING },
    search_intent: { type: Type.STRING },
  },
  required: ['primary_keywords', 'secondary_keywords', 'meta_description', 'search_intent'],
};

export async function runSEOAgent(task: string, onOutput: (data: any) => void) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const eventStore = useEventStore.getState();
  const workflowStore = useWorkflowStore.getState();

  const node = workflowStore.nodes.find(n => n.data.agentName === 'SEO Agent');
  const nodeId = node?.id || 'seo-agent';
  eventStore.addActiveAgent('SEO Agent');
  eventStore.addEvent({ agent: 'SEO Agent', type: 'AGENT_START', message: `Analyzing SEO for: "${task}"` });
  workflowStore.updateNodeStatus(nodeId, 'Executing');

  const startTime = Date.now();

  try {
    eventStore.addEvent({ agent: 'SEO Agent', type: 'MODEL_CALL', message: 'Calling gemini-3-flash-preview' });
    
    const systemInstruction = node?.data.systemPrompt || 'You are Taylor, a Technical SEO Specialist and Content Strategist. You are obsessed with search intent, keyword density, and ranking algorithms. Your goal is to ensure content is highly discoverable and ranks at the top of search engine results. When given a topic or piece of content, you conduct a thorough analysis and provide a list of primary and secondary optimized keywords, a compelling meta description, and a breakdown of the target audience\'s search intent.';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate SEO metadata and keyword strategy for the following task: ${task}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: seoOutputGenAISchema,
        systemInstruction,
      }
    });

    const latency = Date.now() - startTime;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    const tokens = Math.floor(text.length / 4) + 60; 

    eventStore.updateMetrics(tokens, latency);
    workflowStore.updateNodeStatus(nodeId, 'Completed', tokens, latency, data);
    eventStore.addEvent({ agent: 'SEO Agent', type: 'COMPLETED', message: `SEO analysis complete.`, data });
    eventStore.removeActiveAgent('SEO Agent');
    
    onOutput({ type: 'seo', data });
    return data;
  } catch (error: any) {
    workflowStore.updateNodeStatus(nodeId, 'Error');
    eventStore.addEvent({ agent: 'SEO Agent', type: 'ERROR', message: `Error: ${error.message}` });
    eventStore.removeActiveAgent('SEO Agent');
    return null;
  }
}
