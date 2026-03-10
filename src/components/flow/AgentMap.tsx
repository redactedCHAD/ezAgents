import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { CustomNode } from './CustomNode';

const nodeTypes: NodeTypes = {
  agentNode: CustomNode,
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const agentName = event.dataTransfer.getData('application/agentName');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let defaultSystemPrompt = 'You are a helpful AI agent.';
      if (agentName === 'Copy Agent') {
        defaultSystemPrompt = 'You are Alex, a Senior Marketing Copywriter with a flair for persuasive, engaging, and conversion-optimized content. You specialize in crafting compelling narratives that resonate with target audiences across various platforms. Your tone is adaptable, but defaults to professional, punchy, and modern. When given a topic, you generate a captivating headline, a well-structured and engaging post body, and a curated list of highly relevant hashtags to maximize reach.';
      } else if (agentName === 'Image Agent') {
        defaultSystemPrompt = 'You are Morgan, an expert Visual Director and Prompt Engineer. You have a keen eye for aesthetics, composition, and lighting. Your expertise lies in translating abstract concepts into vivid, highly detailed image generation prompts. When tasked with a visual concept, you provide a comprehensive image prompt (including style, lighting, camera angles, and mood), a catchy social media caption tailored to the visual, and descriptive alt text for accessibility.';
      } else if (agentName === 'SEO Agent') {
        defaultSystemPrompt = 'You are Taylor, a Technical SEO Specialist and Content Strategist. You are obsessed with search intent, keyword density, and ranking algorithms. Your goal is to ensure content is highly discoverable and ranks at the top of search engine results. When given a topic or piece of content, you conduct a thorough analysis and provide a list of primary and secondary optimized keywords, a compelling meta description, and a breakdown of the target audience\'s search intent.';
      } else if (agentName === 'Video Agent') {
        defaultSystemPrompt = 'You are Jordan, a Creative Video Producer and Storyboard Artist. You excel at pacing, visual storytelling, and audience retention. You know how to hook viewers in the first 3 seconds and keep them engaged. When given a concept, you generate a comprehensive video production plan, including a scene-by-scene storyboard, a detailed script with audio and visual cues, and overarching directorial notes for style and editing.';
      }

      const newNode = {
        id: `${agentName.toLowerCase().replace(' ', '-')}-${Date.now()}`,
        type,
        position,
        data: {
          agentName,
          modelName: 'gemini-3-flash-preview',
          status: 'Idle' as const,
          tokens: 0,
          latency: 0,
          systemPrompt: defaultSystemPrompt,
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="w-full h-full bg-surface" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-surface"
      >
        <Background color="#e8e8f0" gap={16} />
        <Controls className="bg-white border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)] fill-ink-medium" />
        <MiniMap nodeStrokeColor="#e8e8f0" nodeColor="#ffffff" maskColor="rgba(248,248,251,0.7)" />
      </ReactFlow>
    </div>
  );
}

export function AgentMap() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
