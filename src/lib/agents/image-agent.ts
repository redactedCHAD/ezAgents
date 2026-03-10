import { GoogleGenAI } from '@google/genai';
import { useEventStore } from '@/store/useEventStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { imageOutputGenAISchema } from '@/lib/schemas';

export async function runImageAgent(task: string, onOutput: (data: any) => void) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const eventStore = useEventStore.getState();
  const workflowStore = useWorkflowStore.getState();

  const nodeId = 'image-agent';
  eventStore.addActiveAgent('Image Agent');
  eventStore.addEvent({ agent: 'Image Agent', type: 'AGENT_START', message: `Generating image prompt for: "${task}"` });
  workflowStore.updateNodeStatus(nodeId, 'Executing');

  const startTime = Date.now();

  try {
    eventStore.addEvent({ agent: 'Image Agent', type: 'MODEL_CALL', message: 'Calling gemini-3-flash-preview' });
    
    const node = workflowStore.nodes.find(n => n.id === nodeId);
    const systemInstruction = node?.data.systemPrompt || 'You are an expert visual director. Generate a detailed image prompt, a social media caption for the image, and alt text.';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create an image generation prompt and caption for the following marketing task: ${task}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: imageOutputGenAISchema,
        systemInstruction,
      }
    });

    const latency = Date.now() - startTime;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    const tokens = Math.floor(text.length / 4) + 80; 

    eventStore.updateMetrics(tokens, latency);
    workflowStore.updateNodeStatus(nodeId, 'Completed', tokens, latency, data);
    eventStore.addEvent({ agent: 'Image Agent', type: 'COMPLETED', message: `Image prompt generation complete.`, data });
    eventStore.removeActiveAgent('Image Agent');
    
    onOutput({ type: 'image', data });
    return data;
  } catch (error: any) {
    workflowStore.updateNodeStatus(nodeId, 'Error');
    eventStore.addEvent({ agent: 'Image Agent', type: 'ERROR', message: `Error: ${error.message}` });
    eventStore.removeActiveAgent('Image Agent');
    return null;
  }
}
