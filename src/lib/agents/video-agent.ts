import { GoogleGenAI, Type } from '@google/genai';
import { useEventStore } from '@/store/useEventStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';

export const videoOutputGenAISchema = {
  type: Type.OBJECT,
  properties: {
    storyboard_scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scene_number: { type: Type.INTEGER },
          visual: { type: Type.STRING },
          audio: { type: Type.STRING },
          duration_seconds: { type: Type.INTEGER },
        },
        required: ['scene_number', 'visual', 'audio', 'duration_seconds'],
      },
    },
    directorial_notes: { type: Type.STRING },
  },
  required: ['storyboard_scenes', 'directorial_notes'],
};

export async function runVideoAgent(task: string, onOutput: (data: any) => void) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const eventStore = useEventStore.getState();
  const workflowStore = useWorkflowStore.getState();

  const node = workflowStore.nodes.find(n => n.data.agentName === 'Video Agent');
  const nodeId = node?.id || 'video-agent';
  eventStore.addActiveAgent('Video Agent');
  eventStore.addEvent({ agent: 'Video Agent', type: 'AGENT_START', message: `Producing video script for: "${task}"` });
  workflowStore.updateNodeStatus(nodeId, 'Executing');

  const startTime = Date.now();

  try {
    eventStore.addEvent({ agent: 'Video Agent', type: 'MODEL_CALL', message: 'Calling gemini-3-flash-preview' });
    
    const systemInstruction = node?.data.systemPrompt || 'You are Jordan, a Creative Video Producer and Storyboard Artist. You excel at pacing, visual storytelling, and audience retention. You know how to hook viewers in the first 3 seconds and keep them engaged. When given a concept, you generate a comprehensive video production plan, including a scene-by-scene storyboard, a detailed script with audio and visual cues, and overarching directorial notes for style and editing.';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a short video storyboard and script for the following marketing task: ${task}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: videoOutputGenAISchema,
        systemInstruction,
      }
    });

    const latency = Date.now() - startTime;
    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    const tokens = Math.floor(text.length / 4) + 150; 

    eventStore.updateMetrics(tokens, latency);
    workflowStore.updateNodeStatus(nodeId, 'Completed', tokens, latency, data);
    eventStore.addEvent({ agent: 'Video Agent', type: 'COMPLETED', message: `Video storyboard complete.`, data });
    eventStore.removeActiveAgent('Video Agent');
    
    onOutput({ type: 'video', data });
    return data;
  } catch (error: any) {
    workflowStore.updateNodeStatus(nodeId, 'Error');
    eventStore.addEvent({ agent: 'Video Agent', type: 'ERROR', message: `Error: ${error.message}` });
    eventStore.removeActiveAgent('Video Agent');
    return null;
  }
}
