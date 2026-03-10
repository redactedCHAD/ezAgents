import { z } from 'zod';
import { Type } from '@google/genai';

export const CopyOutputSchema = z.object({
  headline: z.string(),
  post: z.string(),
  hashtags: z.array(z.string()),
});

export const ImageOutputSchema = z.object({
  image_prompt: z.string(),
  caption: z.string(),
  alt_text: z.string(),
});

export const OrchestratorSchema = z.object({
  agents: z.array(z.string()),
});

export const copyOutputGenAISchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    post: { type: Type.STRING },
    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['headline', 'post', 'hashtags'],
};

export const imageOutputGenAISchema = {
  type: Type.OBJECT,
  properties: {
    image_prompt: { type: Type.STRING },
    caption: { type: Type.STRING },
    alt_text: { type: Type.STRING },
  },
  required: ['image_prompt', 'caption', 'alt_text'],
};

export const orchestratorGenAISchema = {
  type: Type.OBJECT,
  properties: {
    agents: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of agent names to execute. Valid agents: 'Copy Agent', 'Image Agent', 'SEO Agent', 'Video Agent'",
    },
  },
  required: ['agents'],
};
